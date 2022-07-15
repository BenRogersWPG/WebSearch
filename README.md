# Web Search 🔎

This extension allows you to search the web in your favorite search engines / websites (editable in extension settings), getting input either from selected text or direct entry in the extension's search bar.

![Example of Web Search being used on a code snippet, also displaying result of running the extension from Google](images/web-search.png)

## Features ✨

- Add multiple search engines in the extension settings and pick from them when performing a search
- Easy to use and configure
- Runs on Visual Studio Code for the Web (vscode.dev)
- Keyboard shortcut to perform a quick search <kbd>Alt</kbd>+<kbd>`</kbd>
- Type a search directly using the search bar (if no text is selected, it will ask for input)
- Simple and clean Command Pallete and context menu entries
- JSON snippet to help you customize your default search engines
- Great for testing SEO and web development projects
- **NEW** Walkthrough to help you get started using the extension
- Extension Settings for your own customizations (choose literally any website with a search feature)
![Add any site you wish as a search engine](images/web-search-add-any-site.gif)

## How To Use 👇

*This extension comes packaged with a walkthrough. Use it to learn how to use the extension.*

You can utilize the extension in many different ways:

### Via Context Menu 🖱️

1. Select the text in your code to search for
2. Right click and select "Web Search" from dropdown menu
3. Select the search engine you want to use (add more in the extension settings)

### Via Search Bar 🔎︎

1. Use the keyboard shortcut <kbd>Alt</kbd>+<kbd>`</kbd> or Command Palette entry of *Web Search*
2. Type in the search term you want to search for into the search bar
3. Select the search engine you want to use (add more in the extension settings)

### Via Keyboard Shortcut ⌨️

1. Select the text in your code to search for
2. Use the keyboard shortcut <kbd>Alt</kbd>+<kbd>\`</kbd> (<kbd>Alt</kbd>+<kbd>s</kbd> on Linux)
3. Select the search engine you want to use (add more in the extension settings)

### Via Command Pallete ☰

1. Select the text in your code to search for
2. Open the Command Palette and select the "Web Search" item from the dropdown menu
3. Select the search engine you want to use (add more in the extension settings)

![Web Search submenu, displaying the various options to search selected text - all of which can be edited or add your own](images/web-search-submenu.png)

## Extension Settings ⚙️

### `webSearch.searchEngines`

Search engines to use for the Web Search extension. Replace the query with `%s`, e.g. `https://www.google.com/search?q=%s`, the same way as you would when adding additional search engines to Chrome's settings.

Use the extension settings to manage the search engines easily by pressing the **Add Item** button (shown below).

![Search engine settings, modeled after Google Chrome's search engine settings, allowing you to customize your own experience by adding/removing/editing entries](images/web-search-engine-setting.png)

#### Search Engine Examples

Want to search for the selected code on Stack Overflow?

*Set it to `https://stackoverflow.com/search?q=%s`*

Want to search for the selected code on GitHub?

*Set it to `https://github.com/search?q=%s`*

Want to search for the selected code definition on Microsoft Docs?

*Set it to `https://docs.microsoft.com/en-us/search/?terms=%s&category=Reference&scope=.NET`*

Want to run the selected URL on Google's PageSpeed Insights for search engine optimization testing?

*Set it to `https://pagespeed.web.dev/report?url=%s`*

### `webSearch.enableContextMenu`

Allows the user to enable or disable the right click context menu. Set to `true` to enable, `false` to disable.

![Example of Web Search being used on a code snippet from the right click context menu](images/web-search-context-menu.png)

### `webSearch.allowManualSearch`

Enable the extension to run when no text is selected, asking the user to enter a search query manually. Set to `true` to enable, `false` to disable.

### `webSearch.defaultSearchEngines`

Default search engines to use for the Web Search extension. If you want to use your own, disable the new checkbox `webSearch.useDefaultSearchEnginesList`

### `webSearch.useDefaultSearchEnginesList`

Enable the Web Search extension to use default values. Disabling this will favor your own custom search engines list entered in `webSearch.searchEngines`.

### `webSearch.searchEngine`

**DEPRECIATED** Single search engine to use for the Web Search extension.
Replaced by `webSearch.searchEngines`, allowing you to add multiple search engines.
*Will be removed in future version some time.*

## Future Development Ideas and To-dos 📝

- If selected text is a URL, open it directly or run it through PageSpeed Insights
- Examine performance analysis of code to find potential optimizations
- Add setting to disable information messages when searching
- Investigate adding autocomplete engine to manual entry
- Remove "selected text" from command palette entry title
- Streamline extension by reducing dependancies
- Add more GIFs to demo the extension usage
- Translate the extension to other languages
- Perform additional code cleanup
- Write more tests

> ➕ Have a feature you'd like me to implement? [Submit a feature request on the Repo's Issues page](https://github.com/BenRogersWPG/WebSearch/issues)!

## Completed To-dos ✔️

- ~~Display information message when searching directly (only 1 search engine), inviting user to add more~~
- ~~Convert search engine settings to an array, allowing multiple search engines to be used~~
- ~~Enable extension to run on all UI elements (currently only works on Text Editor UI)~~
- ~~Use only one search engine (no submenu) if only one search engine is in settings~~
- ~~Add a submenu to the function and allow multiple websites to be searched from~~
- ~~Show message to user if they added a search engine that doesn't have a query~~
- ~~Phase out old webSearch.searchEngine setting (use deprecationMessage)~~
- ~~If no text selected, running the extension will prompt for text to search for~~
- ~~Use JSON pattern restriction for search engines setting to validate URLs~~
- ~~Display search query in QuickPick URL (maybe, might be too long)~~
- ~~Add screenshot of new extension settings search engine manager~~
- ~~Add setting toggle to enable/disable search if submenu dismissed~~
- ~~Rework extension settings to better allow removing/editing entries~~
- ~~Remove duplicated release notes and consolidate in Changelog~~
- ~~Allow a preferred default search engine to be set in settings~~
- ~~Ensure keybinding works properly on all operating systems~~
- ~~Edit QuickPick detail, or allow user to write their own detail~~
- ~~Consolidate commands into one command palette entry~~
- ~~Update extension icon and/or add more device sizes~~
- ~~Add extension setting to toggle the right click menu~~
- ~~Add more default search engines for the extension~~
- ~~Show search engine name in the Command Palette~~
- ~~Decide on updating brace formatting preferences~~
- ~~Add GIF animation to show how extension works~~
- ~~Enable extension to run on VS Code for the web~~
- ~~Add monitors for code dependency changes~~
- ~~If no search engine is selected, do nothing~~
- ~~Add keyboard shortcuts to perform search~~
- ~~Add more screenshots of extension usage~~
- ~~Use default query if no query is provided~~
- ~~Move images to consolidated folder~~
- ~~Add screenshots of the new settings~~
- ~~Perform more code refactoring~~
- ~~Add license to the project~~

## Waiting on API Updates ⌛

- Add dynamic sub context menu to right click menu containing all search engines
- Poll site favicons and display them on the search engine submenu

## Requirements 📦

- Visual Studio Code or Visual Studio Code for the Web running on any operating system

## Known Issues 🐛

- Searching Stack Overflow sometimes requires a CAPTCHA. Either log in or accept cookies to prevent this.

## Sponsor This Project ❤️

I spend a lot of time improving and maintaining this extension. If you'd like to sponsor this project, please visit [my GitHub Sponsor page](https://github.com/sponsors/BenRogersWPG/) to learn more.

*One of the perks of being a sponsor is that you will even show up on this very README page!*

## Release Notes 🆕

See [CHANGELOG](https://github.com/BenRogersWPG/WebSearch/blob/master/CHANGELOG.md) file.