// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode:
import * as vscode from 'vscode';
const open = require('open');

//Define a channel for the output of any potential errors:
const webSearchConsole = vscode.window.createOutputChannel("Web Search", "markdown");

// this method is called when the extension is activated:
export function activate(context: vscode.ExtensionContext) {

	// Notify the user that the extension has been activated successfully:
	console.log('Thank you for installing Web Search, the extension is now active! To use, right click some highlighted text in your editor or type "web search" in the command palette.');

	// Register a command that will toggle when the extension is demoing searching from selected text:
	context.subscriptions.push(vscode.commands.registerCommand('WebSearch.selectedTextDemo', async () => {
		await new Promise(resolve => setTimeout(resolve, 1000));
		vscode.commands.executeCommand('setContext', 'searchSelectedText', true);
		performWebSearch(true);
	}));

	// Register a command to run the extension for the first time - used in the extension's walkthrough:
	context.subscriptions.push(vscode.commands.registerCommand('WebSearch.firstRun', async () => {
		await new Promise(resolve => setTimeout(resolve, 500));
		vscode.commands.executeCommand('setContext', 'firstRun', true);
		vscode.window.showInformationMessage(`Type a query in the search bar at the top of the screen & press Enter.`);
		performWebSearch();
	}));

	// Register a command to update a setting (toggling demo mode), which is used in the extension's walkthrough:
	context.subscriptions.push(vscode.commands.registerCommand('WebSearch.changeSetting', async () => {
		await new Promise(resolve => setTimeout(resolve, 1000));
		vscode.workspace.getConfiguration('webSearch').update('useDefaultSearchEnginesList', false);
		vscode.commands.executeCommand('setContext', 'demoModeOff', true);
		vscode.window.showInformationMessage(`Demo mode off. Remember to add your own search engines in settings.`);
	}));

	// Register a command to update a setting (notification levels), which is used in the extension's walkthrough:
	context.subscriptions.push(vscode.commands.registerCommand('WebSearch.changeNotifications', async () => {
		await new Promise(resolve => setTimeout(resolve, 1000));
		vscode.commands.executeCommand('workbench.action.openSettings', 'WebSearch.messageLevels');
		vscode.window.showInformationMessage(`Adjust the level of notifications you wish to see, or remove them entirely.`);
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

	// Register a command that will toggle when the extension is demoing the Command Palette (deprecated):
	context.subscriptions.push(vscode.commands.registerCommand('WebSearch.setPaletteContext', async () => {
		await new Promise(resolve => setTimeout(resolve, 1000));
		vscode.commands.executeCommand('setContext', 'searchCommandPalette', true);
		vscode.window.showInformationMessage(`Run the extension any time by typing "web search" in the command palette.`);
		performWebSearch();
	}));

	// Provide the implementation of the command with registerCommand using the commandId parameter from the command field in package.json
	context.subscriptions.push(vscode.commands.registerCommand('WebSearch.webSearchMenu', () => {
		performWebSearch();
	}));

	async function performWebSearch(demo: boolean = false) {
		//Function to perform the web search

		//Gather the user's currently selected text from the active text editor:
		const editor = vscode.window.activeTextEditor;
		let text = demo ? "eslint" : vscode.window.activeTextEditor?.document.getText(editor!.selection); //If demo is true, use the string "eslint" as the search term

		const manualSearch: boolean = vscode.workspace.getConfiguration('webSearch').get('allowManualSearch')!;
		const defaultSearch: boolean = vscode.workspace.getConfiguration('webSearch').get('useDefaultSearchEnginesList')!;

		enum messageEnum {
			"Show All" = 0,
			"Show Information Messages Only" = 1,
			"Show Warning Messages Only" = 2,
			"Hide All" = 3
		}

		const messageLevelsInt: Number = messageEnum[vscode.workspace.getConfiguration('webSearch').get('messageLevels') as messageEnum] === undefined ? 0 : messageEnum[vscode.workspace.getConfiguration('webSearch').get('messageLevels') as messageEnum] as unknown as Number;

		console.log(messageLevelsInt);

		//Display a message to the user if no text was selected:
		if ((text === undefined || text === "") && (!manualSearch)) {
			if (messageLevelsInt < 2) {
				vscode.window.showInformationMessage(`No text selected. Please select text in the editor and try again.`);
			}
			return;
		}

		//If the user has already selected text, run it through the final search function:
		else if (text !== undefined && text !== "") {
			searchText(text, demo, defaultSearch, messageLevelsInt);
		}

		//If manual search setting is enabled, prompt the user for a search term:
		else if ((text === undefined || text === "") && (manualSearch)) {
			//assign text to the user's selected quickpick item by creating a quickpick and using the quickpick's selected item:
			let input = vscode.window.createQuickPick();

			//Create a list of quickpick items:
			let quickpickItems: vscode.QuickPickItem[] = [];
			//Start the user off with a default search term to prompt them to enter a custom search term:
			quickpickItems.push({ label: " ", description: "Enter your search term here" });

			//Add the quickpick items to the quickpick:
			input.items = quickpickItems;

			const editor = vscode.window.activeTextEditor;
			if (editor !== undefined) {
				input.value = editor.document.getText(editor.selection);
				if (input.value.length > 0) {
				}
			}

			input.onDidAccept(async () => {
				//Set text to the quickpick's currently selected item:
				try {
					text = input.selectedItems[0].label;
				}
				catch (e) {
					//If we can't grab the label, we can use the entire value.
					text = input.value;

				}

				if (text === undefined || text === "") {
					if (messageLevelsInt < 2) {
						vscode.window.showInformationMessage(`No text entered. Please enter text in the prompt, or select text.`);
					}
					return;
				}
				else {
					searchText(text, demo, defaultSearch, messageLevelsInt);

				}


			});

			input.onDidChangeValue(async value => {

				quickpickItems = [];
				//Make the first item in the list the currently entered text:
				quickpickItems.push({ label: value, description: "Search for: " + value });
				//Will be adding additional items from Google Suggest / DuckDuckGo Suggest here soon...

				input.items = quickpickItems;

			}
			);


			input.title = `Search for:`;
			//input.title = `Search DuckDuckGo for:`;
			input.placeholder = 'Start typing to search';
			input.onDidHide(() => input.dispose());
			input.show();

			//await new Promise(resolve => setTimeout(resolve, 1000));
			//if (text === undefined || text === "") {
			//if (messageLevelsInt < 2) {
			//	vscode.window.showInformationMessage(`Please enter text in the prompt, or select text.`);
			//}
			//	return;
			//}

		}


	}
}


async function searchText(query: string, demo: boolean, defaultSearch: boolean, messageLevelsInt: Number) {
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
					detail: `Search ${value.sitename} for ${query ? query.length <= 60 ? query.slice(0, 60) : query.slice(0, 60).concat('…') : ""}`,
				});
			});
		});
	}

	//Convert the JSON object to string and parse the string to an object:
	var searchEngineList = JSON.parse(JSON.stringify(searchEngine));

	//Map the searchEngineList to a new array:
	var searchEngineArray = Object.keys(searchEngineList[0]).map((key) => [String(key), searchEngineList[0][key]]);

	//Define a truncated query in case the search term is long:
	let truncatedQuery: string = `${query ? query.length <= 60 ? query.slice(0, 60) : query.slice(0, 60).concat('…') : ""}`;

	//Loop through the search engines array in the configuration settings and add them to the list:
	for (let i = 0; i < searchEngineArray.length; i++) {
		items.push({
			label: searchEngineArray[i][0],
			description: searchEngineArray[i][1],
			//Display the selected text in the quick pick list. If the text exceeds 60 characters, it will be truncated with an ellipsis:
			detail: `Search ${searchEngineArray[i][0]} for ` + truncatedQuery,
		});
	}


	//Only populate the old search engine list if the user wishes to use default search engines:
	if (defaultSearch || items.length === 0) {

		//Create a quick pick list variable to handle the old search engine (defined as it is used a couple times, saving many lines of code):
		const searchEngineOldArray: vscode.QuickPickItem = {
			label: "Search Engine",
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

	//Initialize a boolean variable that, when set to true, indicates that there is only 1 search engine defined and the extension will open the URL directly:
	let directSearch = false;

	//If more than one item is in the list, display the list in a quick pick list, otherwise, just run the search in the single search engine:
	if (items.length > 1) {
		//If demo mode is enabled, display a message to the user:
		if (demo) { vscode.window.showInformationMessage(`Select the search engine to use from the list above.`); }

		//Use await to wait for the user to select an item from the list:
		selectedSearchEngine = await vscode.window.showQuickPick(items, {
			title: `Search for "` + truncatedQuery + `" on…`
		}) as vscode.QuickPickItem;
	}
	else {
		//If only one item exits in the list, use that item as the search engine (search it directly) - no need to prompt the user:
		selectedSearchEngine = items[0];
		directSearch = true;
	}

	//Create the final search url:
	let searchUrl: string = "";

	if (selectedSearchEngine === null || selectedSearchEngine === undefined) {
		//Since no search engine was selected, notify the user and end the function:
		//=0 or =2 show warnings

		if (messageLevelsInt == 0 || messageLevelsInt == 2) {
			vscode.window.showWarningMessage(`No search engine selected. Please select one from the list and try again.`);
		}
		return;
	}
	else {
		//Set the search engine to the selected Quick Pick engine:
		searchUrl = selectedSearchEngine?.description!;

	}

	//Determine if the searchURL begins with http/https as well as contains '%s', and if it does not, then display a message to the user that thir setting entry is not valid:
	if ((searchUrl.toLowerCase().startsWith("http://") || searchUrl.toLowerCase().startsWith("https://")) && (searchUrl.includes("%s"))) {

		//Perform a string replacement to replace the %s placeholder of the search engine with the $text search query:
		searchUrl = searchUrl.replace('%s', query ? query : "")!;

		//Display to the user what action is being taken and on what search engine:
		if (messageLevelsInt < 2) {
			directSearch ? vscode.window.showInformationMessage(`Only one search engine exists, so searching ${selectedSearchEngine?.label ? selectedSearchEngine?.label : "web"} directly for: ${query}. \nFeel free to add more search engines in the settings.`) : vscode.window.showInformationMessage(`Searching ${selectedSearchEngine?.label ? selectedSearchEngine?.label : "web"} for: ${query}`);
		}

		//Use built in browser if on web, otherwise use native OS browser:
		if (vscode.env.uiKind === vscode.UIKind.Web) {
			vscode.env.openExternal(vscode.Uri.parse(searchUrl!));
		}
		else {
			await open(searchUrl!);
		}
	}
	else {
		//Display to the user that their search engine setting is not valid:
		const errorMessage: string = `Search engine, *${selectedSearchEngine?.label ? selectedSearchEngine?.label : "web"}* setting is not valid. Please check your custom settings.`;

		//Log the error to the extension's output channel and the console:
		webSearchConsole.appendLine(errorMessage + "\nBe sure to include `%s` (*lower case 's'*) in the search engine URL and that it begins with `http://` or `https://`.");
		console.log(errorMessage);

		//Show button to user and offer to bring them to the settings to edit their invalid search engine:
		const messageResponse = await vscode.window.showErrorMessage(errorMessage, 'Edit Search Engine');
		if (messageResponse === "Edit Search Engine") {
			vscode.commands.executeCommand('workbench.action.openSettings', 'WebSearch.searchEngines');
			vscode.window.showInformationMessage(`Make changes to your invalid search engine, ${selectedSearchEngine?.label ? selectedSearchEngine?.label : "web"}. Make sure to add '%s' in the Value field`);
		}

	}
}

// Extension is deactivated
export function deactivate() { }