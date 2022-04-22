# Web Search

This extension allows you search for the selected text and perform a web search in your favorite search engine (editable in extension settings).

![Example of Web Search being used on a code snippet, also displaying result of running the extension from Google](web-search.png)

## Features

- Extension Settings for your own customizations (choose literally any website with a search feature)
- **NEW** Available as a right click menu for easy access
- Simple and clean Command Pallete entry
- Easy to use and configure

## How To Use

To utilize the extension:

### Via Context Menu

1. Select the text in your code to search for
2. Right click and select "Web Search" from dropdown menu

### Via Command Pallete

1. Select the text in your code to search for
2. Open the Command Palette and select the "Web Search" item from the dropdown menu

## Requirements

N/A

## Extension Settings

### `webSearch.searchEngine`

Search engine to use for the Web Search extension. Replace the query with `%s`, e.g. `https://www.google.com/search?q=%s`, the same way as you would when adding additional search engines to Chrome's settings.

*Default Value:*
`https://www.google.com/search?q=%s`

#### Search Engine Examples

Want to search for the selected code on Stack Overflow?

*Set it to `https://stackoverflow.com/search?q=%s`*

Want to search for the selected code on GitHub?

*Set it to `https://github.com/search?q=%s`*

Want to search for the selected code definition on Microsoft Docs?

*Set it to `https://docs.microsoft.com/en-us/search/?terms=%s&category=Reference&scope=.NET`*

### `webSearch.enableContextMenu`

Allows the user to enable or disable the right click context menu. Set to `true` to enable, `false` to disable.

*Default Value:*
`true`

![Example of Web Search being used on a code snippet from the right click context menu](web-search-context-menu.png)


## Known Issues

N/A

## Future Development Ideas and To-dos

- Convert search engine settings to an array, allowing multiple search engines to be used
- Enable extension to run on all UI elements (currently only works on Text Editor UI)
- Add submenu to the function and allow multiple websites to be searched from
- Enable extension to run on VS Code for the web
- Show search engine name in the Command Palette
- Add GIF animation to show how extension works
- Translate the extension to other languages
- Use default query if no query is provided
- Add monitors for code dependency changes
- Add more screenshots of extension usage
- Move images to consolidated folder
- Write more tests

## Completed Tasks

- ~~Remove duplicated release notes and consolidate in Changelog~~
- ~~Add extension setting to toggle the right click menu~~
- ~~Add license to the project~~

## Release Notes

See [CHANGELOG](https://github.com/BenRogersWPG/WebSearch/blob/master/CHANGELOG.md) file.