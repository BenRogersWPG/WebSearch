// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "Web Search" is now active!');
	
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('WebSearch.webSearch', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		const editor = vscode.window.activeTextEditor;
		const text = vscode.window.activeTextEditor?.document.getText();

		//Retrieve the extension's search engine configuration from the user settings:
		let searchEngine:any = vscode.workspace.getConfiguration('webSearch').get('searchEngine');
		
		//Perform a string replacement to replace the %s placeholder of the search engine with the $text search query:
		const searchUrl = searchEngine.replace('%s', text);

		//Display to the user what action is being taken:
		vscode.window.showInformationMessage(`Searching web for, ${text} ...`);
		
		//Perform the web search in the default browser:
		vscode.env.openExternal(vscode.Uri.parse(searchUrl));

	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }
