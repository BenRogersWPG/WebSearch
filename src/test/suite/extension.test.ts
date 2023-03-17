import * as assert from 'assert';
import * as sinon from 'sinon';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import * as webSearch from "../../extension";

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	let sandbox: sinon.SinonSandbox;
	let showInformationMessageStub: sinon.SinonStub;

	setup(() => {
		sandbox = sinon.createSandbox();
		showInformationMessageStub = sandbox.stub(vscode.window, 'showInformationMessage');
	});

	teardown(() => {
		sandbox.restore();
	});

	test('Sample Test', () => {
		assert.strictEqual([1, 2, 3].indexOf(5), -1);
		assert.strictEqual([1, 2, 3].indexOf(0), -1);
		assert.equal("hello!", "hello!");
	});

	test('Message Test - Demo', async () => {
		//Will test the demo message
		webSearch.performWebSearch(true);
		const message = `Select the search engine to use from the list above.`;
		sinon.assert.calledOnce(showInformationMessageStub);
		sinon.assert.calledWithExactly(showInformationMessageStub, message);
	});

	test('Custom Search Engine Count > 0', async () => {
		const customSearchEngineCount = await webSearch.checkCustomSearchEngines();
		console.log(`\tcustomSearchEngineCount: ${customSearchEngineCount}`);
		assert.ok(customSearchEngineCount);
	});

	test('Custom Search Engine Count > 1', async () => {
		const customSearchEngineCount = await webSearch.checkCustomSearchEngines(true);
		console.log(`\tcustomSearchEngineCount: ${customSearchEngineCount}`);
		assert.ok(customSearchEngineCount);
	});

	test('Message Test - Search', async () => {
		//Will test the text message
		webSearch.searchText("test", false, false, 4);
		sinon.assert.notCalled(showInformationMessageStub);
	});

	test('Message Test - Search - eslint', async () => {
		//Will test the demo
		webSearch.searchText("eslint", true, true, 1);
		const message = `Select the search engine to use from the list above.`;
		sinon.assert.calledOnce(showInformationMessageStub);
		sinon.assert.calledWithExactly(showInformationMessageStub, message);
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
