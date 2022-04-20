# Web Search

This extension allows you search for the selected text and perform a web search in your favorite search engine (editable in extension settings).

![Example of Web Search being used on a code snippet, also displaying result of running the extension from Google](web-search.png)

## Features

- Extension Settings for your own customizations
- Simple and clean Command Pallete entry
- Easy to use and configure

## How To Use

To utilize the extension:

1. Select the text in your code to search for
2. Open the Command Palette and select the "Web Search" item from the dropdown menu

## Requirements

N/A

## Extension Settings

**webSearch.searchEngine**:

Search engine to use for the Web Search extension. Replace the query with `%s`, e.g. 'https://www.google.com/search?q=%s', the same way as you would when adding additional search engines to Chrome's settings.

*Default Value:*
`https://www.google.com/search?q=%s`

### Search Engine Examples

Want to search for the selected code on Stack Overflow?
*Set it to `https://stackoverflow.com/search?q=%s`*
Want to search for the selected code on GitHub?
*Set it to `https://github.com/search?q=%s`*
Want to search for the selected code definition on Microsoft Docs?
*Set it to `https://docs.microsoft.com/en-us/search/?terms=%s&category=Reference&scope=.NET`*

## Known Issues

N/A

## Future Development Ideas and To-dos

- Convert search engine settings to an array, allowing multiple search engines to be used
- Enable extension to run on all UI elements (currently only works on Text Editor UI)
- Add submenu to the function and allow multiple websites to be searched from
- Make extension function from the right click menu
- Enable extension to run on VS Code for the web
- Show search engine name in the Command Palette
- Translate the extension to other languages
- Add more screenshots of extension usage
- Move images to consolidated folder
- Write more tests

## Release Notes

### 1.0.5

Added more future development ideas and to-dos, code cleanup in output folder, updated project description in Readme

### 1.0.4

Added software license to project

### 1.0.3

Minor project title updates, added another future development idea to the project Readme

### 1.0.2

Formatting updates to Readme, added additional properties to extension's package.json, added more future development ideas to the project Readme

### 1.0.1

Formatting updates to Readme, including new screenshots

### 1.0.0

Bug fixes and minor improvements

### 0.0.1

Initial release of Web Search

---
