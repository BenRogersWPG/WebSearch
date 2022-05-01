// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode:
import * as vscode from 'vscode';

// this method is called when the extension is activated:
export function activate(context: vscode.ExtensionContext) {

	// Notify the user that the extension has been activated successfully:
	console.log('Thank you for installing Web Search, the extension is now active! To use, right click some highlighted text in your editor or type "web search" in the command pallete.');

	// Provide the implementation of the command with registerCommand using the commandId parameter from the command field in package.json
	context.subscriptions.push(vscode.commands.registerCommand('WebSearch.webSearch', () => {
		PerformWebSearch();
	}));

	context.subscriptions.push(vscode.commands.registerCommand('WebSearch.webSearchMenu', () => {
		PerformWebSearch();
	}));

	async function PerformWebSearch() {
		//Function to perform the web search

		//Gather the user's currently selected text from the active text editor:
		const editor: any = vscode.window.activeTextEditor;
		const text = vscode.window.activeTextEditor?.document.getText(editor.selection);

		//Retrieve the extension's search engine configuration from the user settings:
		let searchEngineOld: any = vscode.workspace.getConfiguration('webSearch').get('searchEngine');//Deprecated, will be removed in future versions
		var searchEngine: string[] = new Array(vscode.workspace.getConfiguration('webSearch').get('searchEngines'));

		//Convert the JSON object to string:
		var se = JSON.stringify(searchEngine)

		//Parse the string to an object:
		var searchEngineList = JSON.parse(se);

		//Map the searchEngineList to a new array:
		var searchEngineArray = Object.keys(searchEngineList[0]).map((key) => [String(key), searchEngineList[0][key]]);

		//Now that we have an array of search engines, we need to loop through them and display them in a quick pick list
		let items: vscode.QuickPickItem[] = [];

		//Loop through the search engines array in the configuration settings and add them to the list:
		for (let i = 0; i < searchEngineArray.length; i++) {
			let searchEngineName: string = searchEngineArray[i][0];
			let searchEngineUrl: string = searchEngineArray[i][1];

			//Add the search engine to the quick pick list:
			items.push({
				label: searchEngineName,
				description: searchEngineUrl,
				detail: "Search Engine from configuration settings",
			});
		}

		//Add the old search engine to the list:
		items.push({
			label: "Old Search Engine",
			description: searchEngineOld,
			detail: "Search Engine from old settings",
		});

		//remove any duplicate items with the same description:
		items = items.filter((item, index, self) =>
			index === self.findIndex((t) => (
				t.description === item.description
			))
		);

		//Use await to wait for the user to select an item from the list:
		const selectedSearchEngine = await vscode.window.showQuickPick(items);

		//Create the final search url:
		let searchUrl: string = "";

		if (selectedSearchEngine == null) {
			//Perform a string replacement to replace the %s placeholder of the search engine with the $text search query:
			searchUrl = searchEngineOld.replace('%s', text ? text : "")!;
		}
		else {

			//Perform a string replacement to replace the %s placeholder of the search engine with the $text search query:
			searchUrl = selectedSearchEngine.description?.replace('%s', text ? text : "")!;
		}

		//Display to the user what action is being taken and on what search engine:
		vscode.window.showInformationMessage(`Searching ${selectedSearchEngine?.label ? selectedSearchEngine?.label : "web"} for, ${text} ...`);

		//Perform the web search in the default browser:
		vscode.env.openExternal(vscode.Uri.parse(searchUrl!));
	}

}

// Extension is deactivated
export function deactivate() { }
