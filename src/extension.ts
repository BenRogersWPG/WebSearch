// The module 'vscode' contains the VS Code extensibility API. Import the module and reference it with the alias vscode:
import * as vscode from 'vscode';
const open = require('open');

// Define a channel for the output of any potential errors:
const webSearchConsole = vscode.window.createOutputChannel("Web Search", { log: true });

// This method is called when the extension is activated:
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
		if (vscode.workspace.getConfiguration('webSearch').get('allowManualSearch') === true) {
			vscode.window.showInformationMessage(`Type a query in the search bar at the top of the screen & press Enter.`);
			performWebSearch();
		}
		else {
			const searchBarResponse = await vscode.window.showWarningMessage(`Search Bar (manual search) must be enabled for this to work properly`, 'Enable Search Bar');
			(searchBarResponse === "Enable Search Bar") ? vscode.window.showInformationMessage(`Enable the setting "Allow Manual Search" to use the search bar.`) : "";
			(searchBarResponse === "Enable Search Bar") ? vscode.commands.executeCommand('workbench.action.openSettings', 'WebSearch.allowManualSearch') : "";
		}
	}));

	// Register a command to update a setting (toggling demo mode), which is used in the extension's walkthrough:
	context.subscriptions.push(vscode.commands.registerCommand('WebSearch.changeSetting', async () => {
		await new Promise(resolve => setTimeout(resolve, 1000));
		vscode.workspace.getConfiguration('webSearch').update('useDefaultSearchEnginesList', false, true);
		vscode.commands.executeCommand('setContext', 'demoModeOff', true);
		// Check if user has entered custom search engines yet and only display the reminder part of this message if not:
		if (await checkCustomSearchEngines()) {
			vscode.window.showInformationMessage(`Demo mode off.`);
		}
		else {
			const demoResponse = await vscode.window.showInformationMessage(`Demo mode off. Remember to add your own search engines in settings.`, 'Add Some Now');
			(demoResponse === "Add Some Now") ? vscode.window.showInformationMessage(`Add your own search engines by clicking the Add Item button.`) : "";
			(demoResponse === "Add Some Now") ? vscode.commands.executeCommand('workbench.action.openSettings', 'WebSearch.searchEngines') : "";
		}
	}));

	// Register a command to update a setting (notification levels), which is used in the extension's walkthrough:
	context.subscriptions.push(vscode.commands.registerCommand('WebSearch.changeNotifications', async () => {
		await new Promise(resolve => setTimeout(resolve, 1000));
		vscode.commands.executeCommand('workbench.action.openSettings', 'WebSearch.messageLevels');
		vscode.window.showInformationMessage(`Adjust the notification level you wish to see, or remove them entirely.`);
	}));

	// Register a command that will take the user to the WebSearch extension's settings page:
	context.subscriptions.push(vscode.commands.registerCommand('WebSearch.openSettings', () => {
		vscode.commands.executeCommand('workbench.action.openSettings', 'WebSearch.searchEngines');
		vscode.window.showInformationMessage(`Add your own search engines by clicking the Add Item button.`);
	}));

	// Register a command that will take the user to the WebSearch extension's settings page to acknowledge the one search engine rule:
	context.subscriptions.push(vscode.commands.registerCommand('WebSearch.oneSearchEngine', async () => {
		vscode.commands.executeCommand('workbench.action.openSettings', 'WebSearch.searchEngines');
		const demoMode: boolean = vscode.workspace.getConfiguration('webSearch').get('useDefaultSearchEnginesList')!;
		if (await checkCustomSearchEngines(true)) {
			demoMode ? vscode.window.showInformationMessage(`Add more search engines anytime through this setting system.`) : vscode.window.showInformationMessage(`Reminder: If you reduce your custom search engine list down to one item, it will not prompt you to select from the list and will just execute the search immediately.`);
		}
		else {
			if (await checkCustomSearchEngines()) {
				demoMode ? vscode.window.showInformationMessage(`Remember, you have only one custom search engine defined. If you turn off demo mode, it will not prompt you to select from the list and will just execute the search immediately.`) : vscode.window.showInformationMessage(`Remember, you have only one custom search engine defined. You will not be prompted to select from the list and instead it will just execute the search immediately.`);
			}
			else {
				const demoResponse = demoMode ? await vscode.window.showInformationMessage(`Remember, you have no custom search engines defined. If you turn off demo mode, it will not prompt you to select from the list and will just execute the search immediately.`, 'Add Some Now') : await vscode.window.showInformationMessage(`Remember, you have no custom search engines defined. You will not be prompted to select from the list and instead it will just execute the search immediately.`, 'Add Some Now');
				(demoResponse === "Add Some Now") ? vscode.window.showInformationMessage(`Add your own search engines by clicking the Add Item button.`) : "";
				(demoResponse === "Add Some Now") ? vscode.commands.executeCommand('workbench.action.openSettings', 'WebSearch.searchEngines') : "";
			}
		}
	}));

	// Register a command that will toggle when the extension is run after entering custom search engines. If no custom search engines have been entered, invite user to add them:
	context.subscriptions.push(vscode.commands.registerCommand('WebSearch.setContext', async () => {
		await new Promise(resolve => setTimeout(resolve, 1000));
		vscode.commands.executeCommand('setContext', 'customSearch', true);
		// Check if the search bar is enabled. If it is, check how many custom search engines have been added. If not, prompt user to enable the search bar
		if (vscode.workspace.getConfiguration('webSearch').get('allowManualSearch') === true) {
			vscode.window.showInformationMessage(`Type a query in the search bar at the top of the screen & press Enter.`);
			performWebSearch();
			if (await checkCustomSearchEngines()) {
				vscode.window.showInformationMessage(`You should now see your custom search engines in the search bar.`);
			}
			else {
				const customResponse = await vscode.window.showInformationMessage(`Running default search engines. Remember to add your own search engines in settings.`, 'Add Some Now');
				(customResponse === "Add Some Now") ? vscode.window.showInformationMessage(`Add your own search engines by clicking the Add Item button.`) : ""; // TODO: This line and the line below exist 3x in the source code. Refactor into a function.
				(customResponse === "Add Some Now") ? vscode.commands.executeCommand('workbench.action.openSettings', 'WebSearch.searchEngines') : "";
			}
		}
		else {
			const searchBarResponse = await vscode.window.showWarningMessage(`Search Bar (manual search) must be enabled for this to work properly`, 'Enable Search Bar');
			(searchBarResponse === "Enable Search Bar") ? vscode.window.showInformationMessage(`Enable the setting "Allow Manual Search" to use the search bar.`) : "";
			(searchBarResponse === "Enable Search Bar") ? vscode.commands.executeCommand('workbench.action.openSettings', 'WebSearch.allowManualSearch') : "";
		}
	}));

	// Provide the implementation of the context command with registerCommand using the commandId parameter from the command field in package.json
	context.subscriptions.push(vscode.commands.registerCommand('WebSearch.webSearchMenu', () => {
		performWebSearch();
	}));

	// Provide the implementation of the default command with registerCommand using the commandId parameter from the command field in package.json
	context.subscriptions.push(vscode.commands.registerCommand('WebSearch.webSearch', () => {
		performWebSearch();
	}));
}

/**Function that executes the web search quickpick
	 * @param {boolean} [demo=false] - If this search is running with demo mode on or not (default value is false)	*/
export async function performWebSearch(demo: boolean = false) {
	// Gather the user's currently selected text from the active text editor:
	const editor = vscode.window.activeTextEditor;
	let text = demo ? "eslint" : vscode.window.activeTextEditor?.document.getText(editor!.selection); // If demo is true, use the string "eslint" as the search term
	const defaultSearch: boolean = vscode.workspace.getConfiguration('webSearch').get('useDefaultSearchEnginesList')!;
	const manualSearch: boolean = vscode.workspace.getConfiguration('webSearch').get('allowManualSearch')!;
	const allowSuggestions: boolean = vscode.workspace.getConfiguration('webSearch').get('allowSuggestions')!;
	const addToSelectedText: boolean = vscode.workspace.getConfiguration('webSearch').get('addToSelectedText')!;
	const keepSearchBarOpen: boolean = vscode.workspace.getConfiguration('webSearch').get('keepSearchBarOpen')!;

	// Prepare enum and gather setting for the user's desired notification display level:
	enum MessageEnum {
		"Show All" = 0,
		"Show Information Messages Only" = 1,
		"Show Warning Messages Only" = 2,
		"Hide All" = 3,
		"showAll" = 0,
		"showInformationMessagesOnly" = 1,
		"showWarningMessagesOnly" = 2,
		"hideAll" = 3
	}
	const messageLevelsInt: number = MessageEnum[vscode.workspace.getConfiguration('webSearch').get('messageLevels') as MessageEnum] === undefined ? 0 : MessageEnum[vscode.workspace.getConfiguration('webSearch').get('messageLevels') as MessageEnum] as unknown as number;

	// FUTURE: Temporarily update old messageLevels setting to new enum, ensuring backwards compatibility:
	//vscode.workspace.getConfiguration('webSearch').update('messageLevels', vscode.workspace.getConfiguration('webSearch').get('messageLevels').replace(/\s/g, "").charAt(0).toLowerCase() + vscode.workspace.getConfiguration('webSearch').get('messageLevels').replace(/\s/g, "").slice(1), true);

	// Display a message to the user if no text was selected:
	if ((text === undefined || text === "") && (!manualSearch)) {
		if (messageLevelsInt < 2) {
			vscode.window.showInformationMessage(`No text selected. Please select text in the editor and try again.`);
		}
		return;
	}

	// If the user is running the demo from the walkthrough:
	else if (text === 'eslint') { // TODO: Use variables over hard-coded like this way to determine if running a search from the walkthrough demo.
		searchText(text, true, defaultSearch, messageLevelsInt); // TODO: When this demo is run, should it allow custom appending at the end?
	}

	// If the user has already selected text, run it through the final search function:
	else if (text !== undefined && text !== "" && !addToSelectedText) {
		if (!addToSelectedText) {
			searchText(text, demo, defaultSearch, messageLevelsInt);
		}
	}

	// If manual search setting is enabled, prompt the user for a search term. If the user had selected text, but wishes to elaborate on the query, also prompt them to add to the search term:
	else if ((text === undefined || text === "") || addToSelectedText && (manualSearch)) { // FUTURE: (Waiting on VS Code API Update) If addToSelectedText is true, move cursor to the end of the search bar instead of selecting the text, as when a user starts typing, it will erase the selected text they wish to append to.
		// Assign text to the user's selected Quick Pick item by creating a Quick Pick and using the Quick Pick's selected item:
		let input = vscode.window.createQuickPick();

		// Will keep the search bar open (persistent) if the user has this setting enabled (added in v6.5.0)
		input.ignoreFocusOut = keepSearchBarOpen;

		// Create a list of Quick Pick items:
		let quickpickItems: vscode.QuickPickItem[] = [];
		// Start the user off with a default search term to prompt them to enter a custom search term:
		quickpickItems.push({ label: "", description: "Enter your search term here" });

		// Add the Quick Pick items to the Quick Pick:
		input.items = quickpickItems;

		const editor = vscode.window.activeTextEditor;
		if (editor !== undefined) {
			input.value = editor.document.getText(editor.selection);
		}

		// User clicked on Quick Pick entry or pressed Enter
		input.onDidAccept(async () => {
			// Set text to the Quick Pick's currently selected item:
			try {
				text = input.selectedItems[0].label;
			}
			catch (e) {
				// If we can't grab the label, we can use the entire value.
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

		// Quick Pick list has changed (typing into search bar)
		input.onDidChangeValue(async value => {

			quickpickItems = [];
			// Make the first item in the list the currently entered text:
			quickpickItems.push({ label: value, description: "Search for: " + value });
			// TODO: Add additional items from other search engines, such as DuckDuckGo (use user setting to select preferred engine)

			// Only allow suggestions if on desktop version:
			if (vscode.env.uiKind === vscode.UIKind.Desktop) {

				const getGoogleSuggestions = require('get-google-suggestions');
				if (allowSuggestions) {
					const suggestions = await getGoogleSuggestions(value);
					suggestions.forEach((array: any) => {
						quickpickItems.push({ label: array, description: "Search for: " + array });
						quickpickItems = quickpickItems.filter(item => item.label.indexOf(value) !== -1);;
					});
				}
			}
			input.items = quickpickItems;
		});

		input.title = `Search for:`; // FUTURE: If only one search engine, name it directly in this title (requires refactoring)
		input.placeholder = vscode.env.uiKind === vscode.UIKind.Desktop && allowSuggestions ? 'Start typing for autocomplete' : 'Start typing to search'; // Only display 'Start typing for autocomplete' if on VSCode desktop AND the user wants suggestions
		input.onDidHide(() => input.dispose());
		input.show();
	}
	else {
		searchText(text, demo, defaultSearch, messageLevelsInt);
	}

	// Inform user if addToSelected is true, but allowManualSearch is false, as you can't elaborate on a search using the search bar if you have the search bar disabled
	if (addToSelectedText && !manualSearch && text !== "eslint" && text !== undefined && text !== "") {
		searchText(text, demo, defaultSearch, messageLevelsInt);
		const manualSearchAnswer = await vscode.window.showInformationMessage(`You have indicated you wish to add to selected text, but that requires the search bar to be activated.`, "Enable The Search Bar");
		(manualSearchAnswer === "Enable The Search Bar") ? vscode.window.showInformationMessage(`Enable the search bar so you can start modifying your searches.`) : "";
		(manualSearchAnswer === "Enable The Search Bar") ? vscode.commands.executeCommand('workbench.action.openSettings', 'webSearch.allowManualSearch') : "";
	}
}

/**Function that executes the web search
 * @param {string} query - The search query
 * @param {boolean} demo - If this search is running with demo mode on or not
 * @param {boolean} defaultSearch - If the user wishes to use the default list of search engines
 * @param {Number} messageLevelsInt - The enum value of the user's preferred notification level*/
export async function searchText(query: string, demo: boolean, defaultSearch: boolean, messageLevelsInt: number) {
	// Retrieve the extension's search engine configuration from the user settings:
	const searchEngineOld: string = vscode.workspace.getConfiguration('webSearch').get('searchEngine')!; // Deprecated, will be removed in future versions

	// Get the user settings from the extension's settings.json file:
	const searchEngine: string[] = new Array(vscode.workspace.getConfiguration('webSearch').get('searchEngines')); // TODO: Write function to perform all getConfiguration calls by just passing the sections to it

	// Define default search engine signature:
	interface IDefaultObject { sitename: string; url: string }

	// Use this interface to get the default search engine list from the settings.json file:
	const defaultSearchEngines: IDefaultObject[] = new Array(vscode.workspace.getConfiguration('webSearch').get('defaultSearchEngines'));

	// Now that we have an array of search engines, we need to loop through them and display them in a quick pick list
	let items: vscode.QuickPickItem[] = [];

	// Only populate the default search engine list if the user wishes to use default search engines:
	if (defaultSearch) {
		// Loop through the search engines array in the configuration settings and add them to the list:
		defaultSearchEngines.forEach(site => {
			Object.entries(site).forEach(([key, value]) => {
				items.push({
					label: value.sitename,
					description: value.url,
					// Display the selected text in the quick pick list. If the text exceeds 60 characters, it will be truncated with an ellipsis. If the site is PageSpeed Insights, then change the detail to match:
					detail: `${(value.sitename === `PageSpeed Insights`) ? `Run` : 'Search'} ${value.sitename} ${(value.sitename === `PageSpeed Insights`) ? `on` : 'for'} ${query ? query.length <= 60 ? query.slice(0, 60) : query.slice(0, 60).concat('…') : ""}`, // TODO: Use a setting to do this to more, using verbs that user defines?
				});
			});
		});
	}

	// Convert the JSON object to string and parse the string to an object and map the searchEngineList to a new array:
	var searchEngineArray = Object.keys(JSON.parse(JSON.stringify(searchEngine))[0]).map((key) => [String(key), JSON.parse(JSON.stringify(searchEngine))[0][key]]);

	// Define a truncated query in case the search term is long:
	let truncatedQuery: string = `${query ? query.length <= 60 ? query.slice(0, 60) : query.slice(0, 60).concat('…') : ""}`;

	// Loop through the search engines array in the configuration settings and add them to the list:
	for (let i = 0; i < searchEngineArray.length; i++) {
		items.push({
			label: searchEngineArray[i][0],
			description: searchEngineArray[i][1],
			// Display the selected text in the quick pick list. If the text exceeds 60 characters, it will be truncated with an ellipsis:
			detail: `Search ${searchEngineArray[i][0]} for ` + truncatedQuery,
		});
	}

	// Only populate the old search engine list if the user wishes to use default search engines:
	if (defaultSearch || items.length === 0) {

		// Create a quick pick list variable to handle the old search engine (defined as it is used a couple times, saving many lines of code):
		const searchEngineOldArray: vscode.QuickPickItem = {
			label: "Search Engine",
			description: searchEngineOld,
			detail: "Search Engine from old settings",
		};

		items.push(searchEngineOldArray);
	}

	// Remove any duplicate items with the same description:
	items = items.filter((item, index, self) =>
		index === self.findIndex((t) => (
			t.description === item.description
		))
	);

	// Initialize selectedSearchEngine variable as a QuickPickItem:
	let selectedSearchEngine: vscode.QuickPickItem;

	// Initialize a boolean variable that, when set to true, indicates that there is only 1 search engine defined and the extension will open the URL directly:
	let directSearch = false;

	// If more than one item is in the list, display the list in a quick pick list, otherwise, just run the search in the single search engine:
	if (items.length > 1) {
		// If demo mode is enabled, display a message to the user:
		if (demo) { vscode.window.showInformationMessage(`Select the search engine to use from the list above.`); }

		// Use await to wait for the user to select an item from the list:
		selectedSearchEngine = await vscode.window.showQuickPick(items, {
			title: `Search for "` + truncatedQuery + `" on…`,
			// TODO: Also allow the search engine selection window to be persistent? ignoreFocusOut: true
		}) as vscode.QuickPickItem;

		// FUTURE: Try adding some tooltips (noted in VS Code v1.76):
		//selectedSearchEngine = await vscode.window.showQuickPick([
		//	{
		//		label: 'label',
		//		tooltip: 'tooltip',
		//		title: `Search for "` + truncatedQuery + `" on…`,
		//	},
		//	{
		//		label: 'label2',
		//		tooltip: new vscode.MarkdownString('tooltip2 [link](https://github.com)')
		//	}
		//],
		//	{
		//		placeHolder: 'placeholder'
		//	}
		//) as vscode.QuickPickItem;

	}
	else {
		// If only one item exits in the list, use that item as the search engine (search it directly) - no need to prompt the user:
		selectedSearchEngine = items[0];
		directSearch = true;
	}

	// Create the final search url:
	let searchUrl: string = "";

	if (selectedSearchEngine === null || selectedSearchEngine === undefined) {
		// Since no search engine was selected, notify the user and end the function:
		// =0 or =2 show warnings

		if (messageLevelsInt === 0 || messageLevelsInt === 2) {
			vscode.window.showWarningMessage(`No search engine selected. Please select one from the list and try again.`);
		}
		return;
	}
	else {
		// Set the search engine to the selected Quick Pick engine:
		searchUrl = selectedSearchEngine?.description!;

	}

	// Determine if the searchURL begins with http/https as well as contains '%s', and if it does not, then display a message to the user that their setting entry is not valid:
	if ((searchUrl.toLowerCase().startsWith("http://") || searchUrl.toLowerCase().startsWith("https://")) && (searchUrl.includes("%s"))) {

		// Perform a string replacement to replace the %s placeholder of the search engine with the $text search query:
		searchUrl = searchUrl.replace(/%s/g, query ? query : "");

		// Use built in browser if on web, otherwise use native OS browser:
		vscode.env.uiKind === vscode.UIKind.Web ? vscode.env.openExternal(vscode.Uri.parse(searchUrl!)) : await open(searchUrl!);

		// Display to the user what action is being taken and on what search engine:
		if (messageLevelsInt < 2) {
			directSearch ? vscode.window.showInformationMessage(`Only one search engine exists, so searching ${selectedSearchEngine?.label ? selectedSearchEngine?.label : "web"} directly for: ${query}. \nFeel free to add more search engines in the settings.`) : vscode.window.showInformationMessage(`Searching ${selectedSearchEngine?.label ? selectedSearchEngine?.label : "web"} for: ${query}`); // FUTURE: Add button to this information message to add more?
		}
	}
	else {
		// Display to the user that their search engine setting is not valid:
		const errorMessage: string = `Search engine, *${selectedSearchEngine?.label ? selectedSearchEngine?.label : "web"}* setting is not valid. Please check your custom settings.`;

		// Log the error to the extension's output channel and the console:
		webSearchConsole.appendLine(errorMessage + "\nBe sure to include `%s` (*lower case 's'*) in the search engine URL and that it begins with `http://` or `https://`.");
		console.log(errorMessage);

		// Show button to user and offer to bring them to the settings to edit their invalid search engine:
		const messageResponse = await vscode.window.showErrorMessage(errorMessage, 'Fix Search Engine');
		if (messageResponse === "Fix Search Engine") {
			vscode.commands.executeCommand('workbench.action.openSettings', 'WebSearch.searchEngines');
			vscode.window.showInformationMessage(`Make changes to your invalid search engine, ${selectedSearchEngine?.label ? selectedSearchEngine?.label : "web"}. Make sure to add '%s' in the Value field`);
		}

	}
}
/**Function that checks if any custom search engines have been entered by the user yet - for better, more helpful messages:
 * @param {boolean} [one=false] - If we want more than 1 (true) or more than 0 (default / false).
 * @returns {boolean} if more than 0 search engines have been added*/
export async function checkCustomSearchEngines(one: boolean = false): Promise<boolean> {
	if ((vscode.workspace.getConfiguration('webSearch').get('searchEngines') ? Object.keys(vscode.workspace.getConfiguration('webSearch').get('searchEngines') as {}).length : 0) > (one ? 1 : 0)) {
		return true;
	}
	else {
		return false;
	}
}

// Extension is deactivated
export function deactivate() { }