// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode:
import * as vscode from 'vscode';

// this method is called when the extension is activated:
export function activate(context: vscode.ExtensionContext) {

	// Notify the user that the extension has been activated successfully:
	console.log('Thank you for installing Web Search, the extension is now active! To use, right click some highlighted text in your editor or type "web search" in the command pallete.');

	// Provide the implementation of the command with registerCommand using the commandId parameter from the command field in package.json
	context.subscriptions.push(vscode.commands.registerCommand('WebSearch.webSearchMenu', () => {
		performWebSearch();
	}));

	async function performWebSearch() {
		//Function to perform the web search

		//Gather the user's currently selected text from the active text editor:
		const editor = vscode.window.activeTextEditor;
		let text = vscode.window.activeTextEditor?.document.getText(editor!.selection);
		let manualSearch: boolean = vscode.workspace.getConfiguration('webSearch').get('allowManualSearch')!;

		//Display a message to the user if no text was selected:
		if ((text === undefined || text === "") && (!manualSearch)) {
			vscode.window.showInformationMessage(`No text selected. Please select text in the editor and try again.`);
			return;
		}
		//If manual search setting is enabled, prompt the user for a search term:
		else if ((text === undefined || text === "") && (manualSearch)) {
			text = await vscode.window.showInputBox({
				placeHolder: 'Please enter the text you would like to search for.',
				prompt: 'Please enter the text you would like to search for.'
			});
			if (text === undefined || text === "") {
				vscode.window.showInformationMessage(`No text entered. Please enter text in the prompt, or select text.`);
				return;
			}
		}

		//Retrieve the extension's search engine configuration from the user settings:
		let searchEngineOld: string = vscode.workspace.getConfiguration('webSearch').get('searchEngine')!;//Deprecated, will be removed in future versions
		//var searchEngine: string[] = new Array(vscode.workspace.getConfiguration('webSearch').get('searchEngines'));

		//Get the user settings from the extension's settings.json file:
		const searchEngine: string[] = new Array(vscode.workspace.getConfiguration('webSearch').get('searchEngines'));

		//Convert the JSON object to string and parse the string to an object:
		var searchEngineList = JSON.parse(JSON.stringify(searchEngine));

		//Map the searchEngineList to a new array:
		var searchEngineArray = Object.keys(searchEngineList[0]).map((key) => [String(key), searchEngineList[0][key]]);

		//Now that we have an array of search engines, we need to loop through them and display them in a quick pick list
		let items: vscode.QuickPickItem[] = [];

		//Loop through the search engines array in the configuration settings and add them to the list:
		for (let i = 0; i < searchEngineArray.length; i++) {
			items.push({
				label: searchEngineArray[i][0],
				description: searchEngineArray[i][1],
				//Display the selected text in the quick pick list. If the text exceeds 60 characters, it will be truncated with an ellipsis:
				detail: `Search ${searchEngineArray[i][0]} for ${text ? text.length <= 60 ? text.slice(0, 60) : text.slice(0, 60).concat('…') : ""}`,
			});
		}

		//Create a quick pick list variable to handle the old search engine (defined as it is used a couple times, saving many lines of code):
		const searchEngineOldArray: vscode.QuickPickItem = {
			label: "Old Search Engine",
			description: searchEngineOld,
			detail: "Search Engine from old settings",
		};

		items.push(searchEngineOldArray);

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
			vscode.window.showInformationMessage(`No search engine selected. Please select one from the list and try again.`);
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
			vscode.window.showErrorMessage(`Search engine, ${selectedSearchEngine?.label ? selectedSearchEngine?.label : "web"} setting is not valid. Please check your custom settings.`);
		}

	}

}

// Extension is deactivated
export function deactivate() { }
