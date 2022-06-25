/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.deactivate = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode:
const vscode = __webpack_require__(1);
// this method is called when the extension is activated:
function activate(context) {
    // Notify the user that the extension has been activated successfully:
    console.log('Thank you for installing Web Search, the extension is now active! To use, right click some highlighted text in your editor or type "web search" in the command palette.');
    // Register a command that will toggle when the extension is demoing searching from selected text:
    context.subscriptions.push(vscode.commands.registerCommand('WebSearch.selectedTextDemo', () => __awaiter(this, void 0, void 0, function* () {
        yield new Promise(resolve => setTimeout(resolve, 1000));
        vscode.commands.executeCommand('setContext', 'searchSelectedText', true);
        vscode.window.showInformationMessage(`Select the search engine to use using the list above.`);
        performWebSearch(true);
    })));
    // Register a command to run the extension for the first time - used in the extension's walkthrough:
    context.subscriptions.push(vscode.commands.registerCommand('WebSearch.firstRun', () => __awaiter(this, void 0, void 0, function* () {
        yield new Promise(resolve => setTimeout(resolve, 500));
        vscode.commands.executeCommand('setContext', 'firstRun', true);
        vscode.window.showInformationMessage(`Type a query in the search bar at the top of the screen & press Enter.`);
        performWebSearch();
    })));
    // Register a command to update a setting (toggling demo mode), which is used in the extension's walkthrough:
    context.subscriptions.push(vscode.commands.registerCommand('WebSearch.changeSetting', () => __awaiter(this, void 0, void 0, function* () {
        yield new Promise(resolve => setTimeout(resolve, 1000));
        vscode.workspace.getConfiguration('webSearch').update('useDefaultSearchEnginesList', false);
        vscode.commands.executeCommand('setContext', 'demoModeOff', true);
        vscode.window.showInformationMessage(`Demo mode off. Remember to add your own search engines in settings.`);
    })));
    // Register a command that will take the user to the WebSearch extension's settings page:
    context.subscriptions.push(vscode.commands.registerCommand('WebSearch.openSettings', () => {
        vscode.commands.executeCommand('workbench.action.openSettings', 'WebSearch.searchEngines');
        vscode.window.showInformationMessage(`Add your own search engines by clicking the Add Item button.`);
    }));
    // Register a command that will toggle when the extension is run after entering custom search engines:
    context.subscriptions.push(vscode.commands.registerCommand('WebSearch.setContext', () => __awaiter(this, void 0, void 0, function* () {
        yield new Promise(resolve => setTimeout(resolve, 1000));
        vscode.commands.executeCommand('setContext', 'customSearch', true);
        vscode.window.showInformationMessage(`You should now see your custom search engines in the search bar.`);
        performWebSearch();
    })));
    // Register a command that will toggle when the extension is demoing the Command Palette:
    context.subscriptions.push(vscode.commands.registerCommand('WebSearch.setPaletteContext', () => __awaiter(this, void 0, void 0, function* () {
        yield new Promise(resolve => setTimeout(resolve, 1000));
        vscode.commands.executeCommand('setContext', 'searchCommandPalette', true);
        vscode.window.showInformationMessage(`Run the extension by typing "web search" in the command palette.`);
        performWebSearch();
    })));
    // Provide the implementation of the command with registerCommand using the commandId parameter from the command field in package.json
    context.subscriptions.push(vscode.commands.registerCommand('WebSearch.webSearchMenu', () => {
        performWebSearch();
    }));
    function performWebSearch(demo = false) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            //Function to perform the web search
            //Gather the user's currently selected text from the active text editor:
            const editor = vscode.window.activeTextEditor;
            let text = demo ? "eslint" : (_a = vscode.window.activeTextEditor) === null || _a === void 0 ? void 0 : _a.document.getText(editor.selection); //If demo is true, use the string "eslint" as the search term
            const manualSearch = vscode.workspace.getConfiguration('webSearch').get('allowManualSearch');
            const defaultSearch = vscode.workspace.getConfiguration('webSearch').get('useDefaultSearchEnginesList');
            //Display a message to the user if no text was selected:
            if ((text === undefined || text === "") && (!manualSearch)) {
                vscode.window.showInformationMessage(`No text selected. Please select text in the editor and try again.`);
                return;
            }
            //If manual search setting is enabled, prompt the user for a search term:
            else if ((text === undefined || text === "") && (manualSearch)) {
                text = yield vscode.window.showInputBox({
                    placeHolder: 'Please enter the text you would like to search for.',
                    prompt: 'Please enter the text you would like to search for.',
                    ignoreFocusOut: true,
                    validateInput: (value) => {
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
            const searchEngineOld = vscode.workspace.getConfiguration('webSearch').get('searchEngine'); //Deprecated, will be removed in future versions
            //Get the user settings from the extension's settings.json file:
            const searchEngine = new Array(vscode.workspace.getConfiguration('webSearch').get('searchEngines'));
            //use this interface to ghet the default search engine list from the settings.json file:
            const defaultSearchEngines = new Array(vscode.workspace.getConfiguration('webSearch').get('defaultSearchEngines'));
            //Now that we have an array of search engines, we need to loop through them and display them in a quick pick list
            let items = [];
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
                const searchEngineOldArray = {
                    label: "Old Search Engine",
                    description: searchEngineOld,
                    detail: "Search Engine from old settings",
                };
                items.push(searchEngineOldArray);
            }
            //remove any duplicate items with the same description:
            items = items.filter((item, index, self) => index === self.findIndex((t) => (t.description === item.description)));
            //Initialize selectedSearchEngine variable as a QuickPickItem:
            let selectedSearchEngine;
            //If more than one item is in the list, display the list in a quick pick list, otherwise, just run the search in the single search engine:
            if (items.length > 1) {
                //Use await to wait for the user to select an item from the list:
                selectedSearchEngine = (yield vscode.window.showQuickPick(items));
            }
            else {
                //If only one item exits in the list, use that item as the search engine and no need to prompt the user:
                selectedSearchEngine = items[0];
            }
            //Create the final search url:
            let searchUrl = "";
            if (selectedSearchEngine === null || selectedSearchEngine === undefined) {
                //Since no search engine was selected, notify the user and end the function:
                vscode.window.showWarningMessage(`No search engine selected. Please select one from the list and try again.`);
                return;
            }
            else {
                //Set the search engine to the selected Quick Pick engine:
                searchUrl = selectedSearchEngine === null || selectedSearchEngine === void 0 ? void 0 : selectedSearchEngine.description;
            }
            //Determine if the searchURL contains '%s', and if it does not, then display a message to the user that thir setting entry is not valid:
            if (searchUrl.includes("%s")) {
                //Perform a string replacement to replace the %s placeholder of the search engine with the $text search query:
                searchUrl = searchUrl.replace('%s', text ? text : "");
                //Display to the user what action is being taken and on what search engine:
                vscode.window.showInformationMessage(`Searching ${(selectedSearchEngine === null || selectedSearchEngine === void 0 ? void 0 : selectedSearchEngine.label) ? selectedSearchEngine === null || selectedSearchEngine === void 0 ? void 0 : selectedSearchEngine.label : "web"} for: ${text}`);
                //Perform the web search in the default browser:
                vscode.env.openExternal(vscode.Uri.parse(searchUrl));
            }
            else {
                //Display to the user that their search engine setting is not valid:
                const errorMessage = `Search engine, *${(selectedSearchEngine === null || selectedSearchEngine === void 0 ? void 0 : selectedSearchEngine.label) ? selectedSearchEngine === null || selectedSearchEngine === void 0 ? void 0 : selectedSearchEngine.label : "web"}* setting is not valid. Please check your custom settings.`;
                vscode.window.showErrorMessage(errorMessage);
                console.log(errorMessage);
                //Log the error to the extension's output channel:
                let webSearchConsole = vscode.window.createOutputChannel("Web Search", "markdown");
                webSearchConsole.appendLine(errorMessage + "\nBe sure to include `%s` in the search engine URL.");
            }
        });
    }
}
exports.activate = activate;
// Extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;


/***/ }),
/* 1 */
/***/ ((module) => {

module.exports = require("vscode");

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(0);
/******/ 	var __webpack_export_target__ = exports;
/******/ 	for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
/******/ 	if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ 	
/******/ })()
;
//# sourceMappingURL=extension.js.map