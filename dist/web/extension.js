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
    console.log('Thank you for installing Web Search, the extension is now active! To use, right click some highlighted text in your editor or type "web search" in the command pallete.');
    // Provide the implementation of the command with registerCommand using the commandId parameter from the command field in package.json
    context.subscriptions.push(vscode.commands.registerCommand('WebSearch.webSearch', () => {
        performWebSearch();
    }));
    context.subscriptions.push(vscode.commands.registerCommand('WebSearch.webSearchMenu', () => {
        performWebSearch();
    }));
    function performWebSearch() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            //Function to perform the web search
            //Gather the user's currently selected text from the active text editor:
            const editor = vscode.window.activeTextEditor;
            const text = (_a = vscode.window.activeTextEditor) === null || _a === void 0 ? void 0 : _a.document.getText(editor.selection);
            //Display a message to the user if no text was selected:
            if (text === undefined || text === "") {
                vscode.window.showInformationMessage(`No text selected. Please select text in the editor and try again.`);
                return;
            }
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
                    //Display the selected text in the quick pick list. If the text exceeds 60 characters, it will be truncated with an ellipsis:
                    detail: `Search ${searchEngineArray[i][0]} for ${text ? text.length <= 60 ? text.slice(0, 60) : text.slice(0, 60).concat('…') : ""}`,
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
            let selectedSearchEngine = yield vscode.window.showQuickPick(items);
            //Create the final search url:
            let searchUrl = "";
            if (selectedSearchEngine === null || selectedSearchEngine === undefined) {
                //Set the search engine to the default search engine if one is not selected:
                searchUrl = searchEngineOld;
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
                vscode.window.showInformationMessage(`Searching ${(selectedSearchEngine === null || selectedSearchEngine === void 0 ? void 0 : selectedSearchEngine.label) ? selectedSearchEngine === null || selectedSearchEngine === void 0 ? void 0 : selectedSearchEngine.label : "web"} for, ${text} ...`);
                //Perform the web search in the default browser:
                vscode.env.openExternal(vscode.Uri.parse(searchUrl));
            }
            else {
                //Display to the user that their search engine setting is not valid:
                vscode.window.showErrorMessage(`Search engine, ${(selectedSearchEngine === null || selectedSearchEngine === void 0 ? void 0 : selectedSearchEngine.label) ? selectedSearchEngine === null || selectedSearchEngine === void 0 ? void 0 : selectedSearchEngine.label : "web"} setting is not valid. Please check your custom settings.`);
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