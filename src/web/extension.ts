// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode:
import * as vscode from 'vscode';

// this method is called when the extension is activated:
export function activate(context: vscode.ExtensionContext) {

	// Notify the user that the extension has been activated successfully:
	console.log('Thank you for installing Web Search, the extension is now active! To use, right click some highlighted text in your editor or type "web search" in the command palette.');

	// Register a command to update a setting (toggling demo mode), which is used in the extension's walkthrough:
	context.subscriptions.push(vscode.commands.registerCommand('WebSearch.changeSetting', async () => {
		await new Promise(resolve => setTimeout(resolve, 1000));
		vscode.workspace.getConfiguration('webSearch').update('useDefaultSearchEnginesList', false);
		vscode.commands.executeCommand('setContext', 'demoModeOff', true);
		vscode.window.showInformationMessage(`Demo mode off. Remember to add your own search engines in settings.`);
	}));

	// Register a command that will take the user to the WebSearch extension's settings page:
	context.subscriptions.push(vscode.commands.registerCommand('WebSearch.openSettings', () => {
		vscode.commands.executeCommand('workbench.action.openSettings', 'WebSearch.searchEngines');
		vscode.window.showInformationMessage(`Add your own search engines by clicking the Add Item button.`);
	}));

	// Register a command that will toggle when the extension is run after entering custom search engines:
	context.subscriptions.push(vscode.commands.registerCommand('WebSearch.setContext', async () => {
		await new Promise(resolve => setTimeout(resolve, 1000));
		vscode.commands.executeCommand('setContext', 'customSearch', true);
		vscode.window.showInformationMessage(`You should now see your custom search engines in the search bar.`);
		performWebSearch();
	}));

	// Register a command that will toggle when the extension is demoing the Command Palette:
	context.subscriptions.push(vscode.commands.registerCommand('WebSearch.setPaletteContext', async () => {
		await new Promise(resolve => setTimeout(resolve, 1000));
		vscode.commands.executeCommand('setContext', 'searchCommandPalette', true);
		vscode.window.showInformationMessage(`You can run the extension by typing "web search" in the command palette.`);
		performWebSearch();
	}));

	// Provide the implementation of the command with registerCommand using the commandId parameter from the command field in package.json
	context.subscriptions.push(vscode.commands.registerCommand('WebSearch.webSearchMenu', () => {
		performWebSearch();
	}));

	async function performWebSearch() {
		//Function to perform the web search

		//Gather the user's currently selected text from the active text editor:
		const editor = vscode.window.activeTextEditor;
		let text = vscode.window.activeTextEditor?.document.getText(editor!.selection);
		const manualSearch: boolean = vscode.workspace.getConfiguration('webSearch').get('allowManualSearch')!;
		const defaultSearch: boolean = vscode.workspace.getConfiguration('webSearch').get('useDefaultSearchEnginesList')!;

		//Display a message to the user if no text was selected:
		if ((text === undefined || text === "") && (!manualSearch)) {
			vscode.window.showInformationMessage(`No text selected. Please select text in the editor and try again.`);
			return;
		}
		//If manual search setting is enabled, prompt the user for a search term:
		else if ((text === undefined || text === "") && (manualSearch)) {
			text = await vscode.window.showInputBox({
				placeHolder: 'Please enter the text you would like to search for.',
				prompt: 'Please enter the text you would like to search for.',
				ignoreFocusOut: true,
				validateInput: (value: string) => {
					if (value === '') {
						return 'Please enter a search term.';
					}
					return null;
				}

			});
			if (text === undefined || text === "") {
				vscode.window.showInformationMessage(`No text entered. Please enter text in the prompt, or select text.`);
				return;
			}
		}

		//Retrieve the extension's search engine configuration from the user settings:
		const searchEngineOld: string = vscode.workspace.getConfiguration('webSearch').get('searchEngine')!;//Deprecated, will be removed in future versions

		//Get the user settings from the extension's settings.json file:
		const searchEngine: string[] = new Array(vscode.workspace.getConfiguration('webSearch').get('searchEngines'));

		//Define default search engine signature:
		interface IDefaultObject { sitename: string; url: string; }

		//use this interface to ghet the default search engine list from the settings.json file:
		const defaultSearchEngines: IDefaultObject[] = new Array(vscode.workspace.getConfiguration('webSearch').get('defaultSearchEngines'));

		//Now that we have an array of search engines, we need to loop through them and display them in a quick pick list
		let items: vscode.QuickPickItem[] = [];

		//Only populate the default search engine list if the user wishes to use default search engines:
		if (defaultSearch) {
			//Loop through the search engines array in the configuration settings and add them to the list:
			defaultSearchEngines.forEach(site => {
				Object.entries(site).forEach(([key, value]) => {
					//console.log(key, value);
					items.push({
						label: value.sitename,
						description: value.url,
						//Display the selected text in the quick pick list. If the text exceeds 60 characters, it will be truncated with an ellipsis:
						detail: `Search ${value.sitename} for ${text ? text.length <= 60 ? text.slice(0, 60) : text.slice(0, 60).concat('…') : ""}`,
					});
				});
			});
		}

		//Convert the JSON object to string and parse the string to an object:
		var searchEngineList = JSON.parse(JSON.stringify(searchEngine));

		//Map the searchEngineList to a new array:
		var searchEngineArray = Object.keys(searchEngineList[0]).map((key) => [String(key), searchEngineList[0][key]]);

		//Loop through the search engines array in the configuration settings and add them to the list:
		for (let i = 0; i < searchEngineArray.length; i++) {
			items.push({
				label: searchEngineArray[i][0],
				description: searchEngineArray[i][1],
				//Display the selected text in the quick pick list. If the text exceeds 60 characters, it will be truncated with an ellipsis:
				detail: `Search ${searchEngineArray[i][0]} for ${text ? text.length <= 60 ? text.slice(0, 60) : text.slice(0, 60).concat('…') : ""}`,
			});
		}


		//Only populate the old search engine list if the user wishes to use default search engines:
		if (defaultSearch || items.length === 0) {

			//Create a quick pick list variable to handle the old search engine (defined as it is used a couple times, saving many lines of code):
			const searchEngineOldArray: vscode.QuickPickItem = {
				label: "Old Search Engine",
				description: searchEngineOld,
				detail: "Search Engine from old settings",
			};

			items.push(searchEngineOldArray);
		}

		//remove any duplicate items with the same description:
		items = items.filter((item, index, self) =>
			index === self.findIndex((t) => (
				t.description === item.description
			))
		);

		//Initialize selectedSearchEngine variable as a QuickPickItem:
		let selectedSearchEngine: vscode.QuickPickItem;

		//If more than one item is in the list, display the list in a quick pick list, otherwise, just run the search in the single search engine:
		if (items.length > 1) {
			//Use await to wait for the user to select an item from the list:
			selectedSearchEngine = await vscode.window.showQuickPick(items) as vscode.QuickPickItem;
		}
		else {
			//If only one item exits in the list, use that item as the search engine and no need to prompt the user:
			selectedSearchEngine = items[0];

		}

		//Create the final search url:
		let searchUrl: string = "";

		if (selectedSearchEngine === null || selectedSearchEngine === undefined) {
			//Since no search engine was selected, notify the user and end the function:
			vscode.window.showWarningMessage(`No search engine selected. Please select one from the list and try again.`);
			return;
		}
		else {
			//Set the search engine to the selected Quick Pick engine:
			searchUrl = selectedSearchEngine?.description!;

		}

		//Determine if the searchURL contains '%s', and if it does not, then display a message to the user that thir setting entry is not valid:
		if (searchUrl.includes("%s")) {

			//Perform a string replacement to replace the %s placeholder of the search engine with the $text search query:
			searchUrl = searchUrl.replace('%s', text ? text : "")!;

			//Display to the user what action is being taken and on what search engine:
			vscode.window.showInformationMessage(`Searching ${selectedSearchEngine?.label ? selectedSearchEngine?.label : "web"} for: ${text}`);
			//Perform the web search in the default browser:
			vscode.env.openExternal(vscode.Uri.parse(searchUrl!));
		}
		else {
			//Display to the user that their search engine setting is not valid:
			const errorMessage: string = `Search engine, *${selectedSearchEngine?.label ? selectedSearchEngine?.label : "web"}* setting is not valid. Please check your custom settings.`;
			vscode.window.showErrorMessage(errorMessage);
			console.log(errorMessage);

			//Log the error to the extension's output channel:
			let webSearchConsole = vscode.window.createOutputChannel("Web Search", "markdown");
			webSearchConsole.appendLine(errorMessage + "\nBe sure to include `%s` in the search engine URL.");
		}

	}

}

// Extension is deactivated
export function deactivate() { }
