import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
// import * as myExtension from '../../extension'; //TODO: Try importing the extension this way too

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('Sample Test', () => {
		assert.strictEqual([1, 2, 3].indexOf(5), -1);
		assert.strictEqual([1, 2, 3].indexOf(0), -1);
		assert.equal("hello!", "hello!");
	});

	test('Context Menu', () => {
		const enableContextMenu: boolean = vscode.workspace.getConfiguration('webSearch').get('enableContextMenu')!;
		console.log(`\tenableContextMenu: ${enableContextMenu}`);
		assert.strictEqual(enableContextMenu, true);
	});
	test('Manual Search', () => {
		const allowManualSearch: boolean = vscode.workspace.getConfiguration('webSearch').get('allowManualSearch')!;
		console.log(`\tallowManualSearch: ${allowManualSearch}`);
		assert.strictEqual(allowManualSearch, true);
	});
	test('Default Search Engines', () => {
		interface SearchEngine {
			sitename: string;
			url: string;
		}
		const defaultSearchEngines: SearchEngine[] = vscode.workspace.getConfiguration('webSearch').get('defaultSearchEngines')!;
		console.log(`\tdefaultSearchEngines: ${defaultSearchEngines}`);
		assert.strictEqual(defaultSearchEngines.length, 7);
		assert.strictEqual(defaultSearchEngines[0].sitename, "Google");
		assert.strictEqual(defaultSearchEngines[0].url, "https://www.google.com/search?q=%s");
		assert.strictEqual(defaultSearchEngines[1].sitename, "Stack Overflow");
		assert.strictEqual(defaultSearchEngines[1].url, "https://stackoverflow.com/search?q=%s");
		assert.strictEqual(defaultSearchEngines[2].sitename, "Wikipedia");
		assert.strictEqual(defaultSearchEngines[2].url, "https://en.wikipedia.org/wiki/Special:Search?search=%s");
		assert.strictEqual(defaultSearchEngines[3].sitename, "GitHub");
		assert.strictEqual(defaultSearchEngines[3].url, "https://github.com/search?q=%s");
		assert.strictEqual(defaultSearchEngines[4].sitename, "Reddit");
		assert.strictEqual(defaultSearchEngines[4].url, "https://www.reddit.com/search?q=%s");
		assert.strictEqual(defaultSearchEngines[5].sitename, "PageSpeed Insights");
		assert.strictEqual(defaultSearchEngines[5].url, "https://pagespeed.web.dev/report?url=%s");
		assert.strictEqual(defaultSearchEngines[6].sitename, "DuckDuckGo");
		assert.strictEqual(defaultSearchEngines[6].url, "https://duckduckgo.com/?q=%s");
	});
	test('Add To Selected Text', () => {
		const addToSelectedText: boolean = vscode.workspace.getConfiguration('webSearch').get('addToSelectedText')!;
		console.log(`\taddToSelectedText: ${addToSelectedText}`);
		assert.strictEqual(addToSelectedText, true);
	});
	test('Keep Search Bar Open', () => {
		const keepSearchBarOpen: boolean = vscode.workspace.getConfiguration('webSearch').get('keepSearchBarOpen')!;
		console.log(`\tkeepSearchBarOpen: ${keepSearchBarOpen}`);
		assert.strictEqual(keepSearchBarOpen, true);
	});
	test('Message Levels', () => {
		const messageLevels: object = vscode.workspace.getConfiguration('webSearch').get('messageLevels')!;
		console.log(`\tmessageLevels: ${messageLevels}`);
		assert.strictEqual(messageLevels, "showAll");
	});
	test('Allow Suggestions', () => {
		const allowSuggestions: boolean = vscode.workspace.getConfiguration('webSearch').get('allowSuggestions')!;
		console.log(`\tallowSuggestions: ${allowSuggestions}`);
		assert.strictEqual(allowSuggestions, true);
	});
	test('Demo Mode', () => {
		const useDefaultSearchEnginesList: boolean = vscode.workspace.getConfiguration('webSearch').get('useDefaultSearchEnginesList')!;
		console.log(`\tuseDefaultSearchEnginesList: ${useDefaultSearchEnginesList}`);
		assert.strictEqual(useDefaultSearchEnginesList, false);
	});
});
