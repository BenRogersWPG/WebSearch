"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode:
const vscode = require("vscode");
// this method is called when the extension is activated:
function activate(context) {
    // Notify the user that the extension has been activated successfully:
    console.log('Thank you for installing Web Search, the extension is now active! To use, right click some highlighted text in your editor or type "web search" in the command pallete.');
    // Provide the implementation of the command with registerCommand using the commandId parameter from the command field in package.json
    context.subscriptions.push(vscode.commands.registerCommand('WebSearch.webSearch', () => {
        performWebSearch();
    }));
    context.subscriptions.push(vscode.commands.registerCommand('WebSearch.webSearchMenu', () => {
        performWebSearch();
    }));
    async function performWebSearch() {
        //Function to perform the web search
        //Gather the user's currently selected text from the active text editor:
        const editor = vscode.window.activeTextEditor;
        const text = vscode.window.activeTextEditor?.document.getText(editor.selection);
        //Retrieve the extension's search engine configuration from the user settings:
        let searchEngineOld = vscode.workspace.getConfiguration('webSearch').get('searchEngine'); //Deprecated, will be removed in future versions
        var searchEngine = new Array(vscode.workspace.getConfiguration('webSearch').get('searchEngines'));
        //Convert the JSON object to string and parse the string to an object:
        var searchEngineList = JSON.parse(JSON.stringify(searchEngine));
        //Map the searchEngineList to a new array:
        var searchEngineArray = Object.keys(searchEngineList[0]).map((key) => [String(key), searchEngineList[0][key]]);
        //Now that we have an array of search engines, we need to loop through them and display them in a quick pick list
        let items = [];
        //Loop through the search engines array in the configuration settings and add them to the list:
        for (let i = 0; i < searchEngineArray.length; i++) {
            items.push({
                label: searchEngineArray[i][0],
                description: searchEngineArray[i][1],
                detail: "Search Engine from configuration settings",
            });
        }
        //Create a quick pick list variable to handle the old search engine (defined as it is used a couple times, saving many lines of code):
        const searchEngineOldArray = {
            label: "Old Search Engine",
            description: searchEngineOld,
            detail: "Search Engine from old settings",
        };
        items.push(searchEngineOldArray);
        //remove any duplicate items with the same description:
        items = items.filter((item, index, self) => index === self.findIndex((t) => (t.description === item.description)));
        //Use await to wait for the user to select an item from the list:
        let selectedSearchEngine = await vscode.window.showQuickPick(items);
        //Create the final search url:
        let searchUrl = "";
        if (selectedSearchEngine === null || selectedSearchEngine === undefined) {
            //Perform a string replacement to replace the %s placeholder of the search engine with the $text search query:
            searchUrl = searchEngineOld.replace('%s', text ? text : "");
            //Set the search engine to the default search engine if one is not selected:
            selectedSearchEngine = searchEngineOldArray;
        }
        else {
            //Perform a string replacement to replace the %s placeholder of the search engine with the $text search query:
            searchUrl = selectedSearchEngine?.description?.replace('%s', text ? text : "");
        }
        //Display to the user what action is being taken and on what search engine:
        vscode.window.showInformationMessage(`Searching ${selectedSearchEngine?.label ? selectedSearchEngine?.label : "web"} for, ${text} ...`);
        //Perform the web search in the default browser:
        vscode.env.openExternal(vscode.Uri.parse(searchUrl));
    }
}
exports.activate = activate;
// Extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map