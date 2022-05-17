# Changelog

## [3.0.1] (2022-05-16)
#### House Keeping
* Updated extension description for both the marketplace and GitHub based on new functionality
* Wrote some updated descriptions of some of the extension's settings
* Updated a few more dependencies

## [3.0.0] (2022-05-15)
#### Features
* New setting to enable manual searching if no text is selected when running the extension
* Extension will now only open the search results in a browser if a search engine is selected from the submenu
* Warnings will now be shown if the search engine is not selected or if the search query is empty

## [2.2.6] (2022-05-15)
#### House Keeping
* Updated extension icon to fit better in the bounding box
* Updated contribution instructions to add more information on ways to help this project

#### Documentation
* Added more ideas for future development to the Readme

## [2.2.5] (2022-05-14)
#### House Keeping
* Cleaned up repository folders, making way for future cleanup

#### Code Cleanup
* Made the information message more user friendly when performing a search

#### Documentation
* Added more ideas for future development to the Readme

## [2.2.4] (2022-05-14)
#### Features
* Added DuckDuckGo as a search engine in the extension settings

#### Documentation
* Added more screenshots of extension usage and settings
* Added GIF animation to show how extension / settings works

#### House Keeping
* Moved all images into `images` folder

## [2.2.3] (2022-05-13)
#### House Keeping
* Fixing a bug with desktop version of the extension, may extend into other versions.

## [2.2.2] (2022-05-13)
#### House Keeping
* Updated a few more references to the old command

## [2.2.1] (2022-05-12)
#### Code Cleanup
* Consolidated the web search commands into a single command palette entry (previously there was one just for context menu and one for command palette)

#### Documentation
* Added emoji to the Readme to lighten things up and make the sections more readable 📖

## [2.2.0] (2022-05-10)
#### Features
* Selected text will display in the search engine Quick Pick list, truncated to the first 60 characters
* Extension will warn you if you ran the extension without first selecting text
* Added Google PageSpeed Insights URL lookup as a new option in the extension settings for SEO testing
* Extension will warn you if you enter a search engine without a `%s` placeholder

#### Code Cleanup
* Performed some more code refactoring

## [2.1.0] (2022-05-08)
#### Features
* Added support for keyboard shortcut ```Alt + ` ``` to run the extension

#### Documentation
* Streamlined content of Readme

## [2.0.0] (2022-05-07)
#### Features
* Released support for VSCode for the Web [(vscode.dev)](https://vscode.dev/)

## [1.1.6] (2022-05-07)
#### House Keeping
* Updated a few more dependencies, now compatible with the latest versions of VSCode

## [1.1.5] (2022-05-04)
#### Code Cleanup
* Performed some code refactoring

#### Documentation
* Attempted to create a dynamic submenu for the right click menu, but the VSCode API is not yet capable of this
* Added many more ideas for future development to the Readme

## [1.1.4] (2022-05-03)
#### Features
* Added more default search engines to the extension settings:
  - Wikipedia, Github, and Reddit

#### House Keeping
* Updated a few more dependencies

#### Documentation
* Improved formatting of Readme and Changelog

## [1.1.3] (2022-05-01)
#### House Keeping
* Version bumped all dependencies

## [1.1.2] (2022-05-01)
#### Code Cleanup
* Commencing dependency updates

#### Documentation
* Improved formatting of Readme and Changelog

## [1.1.1] (2022-05-01)
#### Code Cleanup
* Prevented the extension from displaying nothing when the user had no search engines set
* Made minor code formatting updates
* Prepared project for dependency updates

## [1.1.0] (2022-04-30)
#### Features
* Added user setting to enable multiple search engines to be added
* Added submenu to the Command Pallete to allow the user to select the search engine to use
* Maintained backwards compatibility with the old `webSearch.searchEngine` setting

#### Documentation
* Added many more ideas for future development to the Readme

## [1.0.1] (2022-04-22)
#### Features
* Added user setting to control if the right click menu is enabled

#### Documentation
* Improved formatting of Readme and Changelog

## [1.0.0] (2022-04-22)
#### Features
* Added right click functionality (right click any selected code to search)
* Added more search engine examples to Readme
* Updated project description in Readme
* Added markdown to custom settings description, making it easier to add new search engines

#### Code Cleanup
* Moved repeated code to a function

#### Documentation
* Added tags to project for easier discoverability
* Described new added functionality to Readme
* Added more future development ideas and to-dos

## [0.1.5] (2022-04-20)
#### Documentation
* Added more future development ideas and to-dos
* Added more search engine examples to Readme
* Updated project description in Readme

#### Code Cleanup
* Cleaned up code in output folder

## [0.1.4] (2022-04-19)
#### Features
* Added software license to project
* Code comment cleanup

## [0.1.3] (2022-04-19)
#### Features
* Minor project title updates
* Added another future development idea to the project Readme

## [0.1.2] (2022-04-19)
#### Features
* Formatting updates to Readme
* Added additional properties to extension's package.json
* Added more future development ideas to the project Readme

## [0.1.1] (2022-04-19)
#### Features
* Minor formatting updates to project Readme
* Added screenshot of extension in use to Readme

## [0.1.0] (2022-04-19)
#### Features
* Added changelog to project
* Added extension icon

#### Bug Fixes
* Fixing issue where it would search for all text in document, not just selected text.

## [0.0.1] (2022-04-19)
Initial release to VSCode marketplace