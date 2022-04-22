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

	function PerformWebSearch() {
		//Function to perform the web search

		//Gather the user's currently selected text from the active text editor:
		const editor: any = vscode.window.activeTextEditor;
		const text = vscode.window.activeTextEditor?.document.getText(editor.selection);

		//Retrieve the extension's search engine configuration from the user settings:
		let searchEngine: any = vscode.workspace.getConfiguration('webSearch').get('searchEngine');

		//Perform a string replacement to replace the %s placeholder of the search engine with the $text search query:
		const searchUrl = searchEngine.replace('%s', text);

		//Display to the user what action is being taken:
		vscode.window.showInformationMessage(`Searching web for, ${text} ...`);

		//Perform the web search in the default browser:
		vscode.env.openExternal(vscode.Uri.parse(searchUrl));
	}

}

// Extension is deactivated
export function deactivate() { }
