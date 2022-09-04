# Changelog

## [5.2.1] (2022-09-04)
#### Documentation
* Improved formatting of extension's code, Readme, and Changelog
* Re-ordered some items in the Readme
* Replaced image in the walkthrough for the search bar as it was recently redesigned

#### Code Cleanup
* Added some comments to some newer sections of the code
* Code comment cleanup
* Compressed all images using a newer algorithm, reducing size of extension package further

## [5.2.0] (2022-09-03)
#### Features
* You can now suppress information messages and/or warning messages from appearing. Check out the new setting `webSearch.messageLevels` to limit the messages! *This was my first experience using Typescript Enums, so it was a good learning experience.*
* The search engine selection screen (quick pick menu) now displays a title with the search query, making the search experience more unified
* Improved search engine URL error checking validation
* Updated error message to be more helpful when a search engine is entered with the search query wildcard being "%S" instead of "%s"

#### Documentation
* Wrote a step-by-step how-to for how to add custom search engines in the settings and also in the project Readme
* Added notification message suppression to the extension's walkthrough
* Re-ordered some items in the Readme
* Improved the formatting of some sections of the Readme

#### Code Cleanup
* Refactored the code that truncates long search queries so it can be used in multiple locations

## [5.1.4] (2022-09-03)
#### Documentation
* Improved the wording on some of the extension's walkthrough guides
* Added more ideas for future development to the Readme

#### Code Cleanup
* Compressed all images, reducing size of extension package
* Removed all unused images from the repository

## [5.1.3] (2022-09-01)
#### Code Cleanup
* Streamlined extension by reducing dependencies

#### Documentation
* Added more ideas for future development to the Readme

## [5.1.2] (2022-09-01)
#### Code Cleanup
* Greatly reduced extension package size by compressing the GIF animation which shows how extension / settings works

#### House Keeping
* Updated a few more dependencies

## [5.1.1] (2022-08-30)
#### Features
* Improved speed of picking up search terms. Now if you type a search into the search bar and quickly press <kbd>Enter</kbd>, it will run the search faster

#### Documentation
* Replaced emoji used in the demo walkthrough for selected text. It was not displaying properly on all operating systems
* Added another entry I am waiting for the VS Code API to update

#### Code Cleanup
* Completely cleaned node_modules from repo

## [5.1.0] (2022-08-28)
#### Bug Fixes
* Completed fix for VS Code for the Web to address browser opening of URLs

## [5.0.0] (2022-08-28)
#### Features
* Extension will open URLs properly in native browser and not pester users with a pop up for external websites anymore
* Completely rewrote the webpack and VS Code for the Web sections. This is to prepare for the upcoming suggest autocomplete / autofill API system I am testing *privately*

#### Behind The Scenes
* Updated how webpack is included and used
* Continued working on the autocomplete code to show search term suggestions

#### Code Cleanup
* Added gitignore to the project to compact the package size

## [4.2.10] (2022-08-27)
#### House Keeping
* Updated a few more dependencies

## [4.2.9] (2022-08-20)
#### House Keeping
* Updated a few more dependencies

## [4.2.8] (2022-08-09)
#### Features
* Completely rewrote the search bar system. This is to prepare for the upcoming suggest autocomplete / autofill API system I am testing *privately*
* Reformatted the code to work with the upcoming search bar system
* Included help text for the search bar to guide users through typing in the search bar

#### Documentation
* Updated development roadmap
* Added more ideas for future development to the Readme

#### House Keeping
* Updated a few more dependencies

## [4.2.7] (2022-08-02)
#### Features
* Improved logic of walkthrough coding. If you run the walkthrough's demo mode with only one search engine, it will not display a message to select a search engine (*as there is only one*)
* Updated last item of the walkthrough, *Command Palette*, to be simply an informational message and not a command

#### Documentation
* Removed hard-coded keyboard shortcut in the manual search setting description as the keyboard shortcut is dynamic based on the OS

#### House Keeping
* Updated a few more dependencies

## [4.2.6] (2022-08-01)
#### Behind The Scenes
* Continued working on the autocomplete code to show search term suggestions

#### Documentation
* Removed deprecated setting description from main Readme
* Replaced emoji used in the demo walkthrough for selected text. Looked a little busy on smaller screens.

#### House Keeping
* Removed some unused files from the repository
* Added dependabot checks on GitHub Actions as well (already checking npm)
* Updated a few more dependencies

## [4.2.5] (2022-07-24)
#### Bug Fixes
* Completed fix for Linux web users (Linux users using VS Code for Web) to use the specific Linux keyboard shortcut, as it works for desktop Linux, but the web version was still showing the normal extension keybinding instead of the special one reserved just for Linux, introduced in release `4.1.13`. *I am still testing this, but I believe this version will fix it.* Now works properly when using Android phones or tablets.

#### House Keeping
* Added some information to the Readme about how to access the relatively new extension walkthrough (Getting Started)
* Re-ordered the extension's features on the main Readme page

## [4.2.4] (2022-07-23)
#### Documentation
* Updated Linux keybinding graphic to have proper transparency - now it will look great on any background
* Re-ordered some items in the Readme

#### Bug Fixes
* **[In Progress]** Worked on fix for Linux web users (Linux users using VS Code for Web) to use the specific Linux keyboard shortcut, as it works for desktop Linux, but the web version was still showing the normal extension keybinding instead of the special one reserved just for Linux, introduced in release `4.1.13`.

#### House Keeping
* Updated a few more dependencies

## [4.2.3] (2022-07-19)
#### Features
* Enforced all search engines to be valid URLs (now must begin with **http** or **https**). This will make it easier for users to add new search engines that can be used right away

#### Bug Fixes
* **[In Progress]**  Worked on fix for Linux web users (Linux users using VS Code for Web) to use the specific Linux keyboard shortcut, as it works for desktop Linux, but the web version was still showing the normal extension keybinding instead of the special one reserved just for Linux, introduced in release `4.1.13`.

#### Documentation
* Added in the extension's settings that website search engines must begin with http or https
* Elaborated on some documentation to make it easier for new users
* Improved formatting of some areas of the documentation

#### House Keeping
* Updated a few more dependencies

## [4.2.2] (2022-07-18)
#### Code Cleanup
* Started working on the autocomplete code to show search term suggestions
* Fixed a bug where the extension would show two entries for the keyboard shortcut in the Getting Started walkthrough when viewed on Linux web

#### House Keeping
* Updated a few more dependencies

## [4.2.1] (2022-07-14)
#### Code Cleanup
* Depreciated the old `searchEngine` setting. Please use `searchEngines` to add all search engines you want to use
* Skipped over 4.2.0

## [4.1.14] (2022-07-12)
#### Features
* Refined the way errors are displayed in the extension. Now, the errors are displayed in the console before an error message is displayed. Before, the error message was not displayed until the error message was clicked or dismissed. This change is to make it easier to see the error message and is much better for usability

#### Documentation
* Improved the wording of the extension's documentation surrounding the addition of additional search engines. Remember to add your own using `webSearch.searchEngines` in the extension's settings.

#### House Keeping
* Updated documentation around Stack Overflow web search. Sometimes it requires a CAPTCHA. Either log in or accept cookies to prevent this - *nothing to do with the extension*.
* Tested extension on VS Code's new Do Not Disturb feature. Works great! *Use this if you wish to suppress warnings and information messages as I get around to coding a proposed setting to suppress messages*.
* Updated a few more dependencies

## [4.1.13] (2022-07-10)
#### Features
* Updated keybindings for Linux. The keybinding <kbd>Alt</kbd>+<kbd>\`</kbd> was reserved for OS-specific functions on Linux. This version of the extension will now work on Linux as well with a special keybinding of <kbd>Alt</kbd>+<kbd>s</kbd> only for Linux users.
Mac, Windows, and web users will still have the old keybinding <kbd>Alt</kbd>+<kbd>\`</kbd>.

#### House Keeping
* Updated a few more dependencies

## [4.1.12] (2022-07-03)
#### Features
* Wrote some regular expressions to enforce proper URL pattern rules when entering in search engines. This will greatly help guide users through entering new search engines and prevent issues.

## [4.1.11] (2022-07-03)
#### Features
* Improved search engine validation system. The extension already error-checks all user-entered search engines. However, this release features some new code that ensures that any search engines that fail validation will alert the user via a notification will pop up with a button that will go right to the settings to resolve the issue. This makes sure all new search engines have the proper ``%s`` wildcard needed to perform the search.

#### Documentation
* Added social preview image to repository

#### House Keeping
* Updated a few more dependencies

#### Bug Fixes
* Updated code to log and append any potential errors to the same output channel. Before, it would log to new output channels, and wasn't as clean as I would like it.

## [4.1.10] (2022-06-28)
#### Features
* Extension will display informative message if only one custom search engine has been entered in the settings. This way users will see why searches are performed immediately, and invites them to add more search engines in the settings if desired.
* Extension is now backwards compatible all the way back to VS Code v1.55.2 (*will continue testing for more opportunities*)
* Renamed default out-of-the-box search engine (Google) in the code, as I initially had plans to remove it, but it now works great.

#### Documentation
* Removed some redundant lines from the Readme

## [4.1.9] (2022-06-26)
#### Documentation
* Updated main graphic of WebSearch in project with better arrow appearance and transparency
* Added more ideas for future development to the Readme

## [4.1.8] (2022-06-26)
#### Code Cleanup
* Moved some non project-specific settings out of the project's settings.json
* Played around with Microsoft Playwright for coding tests, but it is needing more testing before implementing into this project

## [4.1.7] (2022-06-22)
#### Features
* Made it easier to add new search engines to your settings from the walkthrough
* Added markdown links between a few settings that mention other settings, making it easier to navigate between them

#### Documentation
* Improved the formatting of some sections of the Readme
* Added more ideas for future development to the Readme

#### House Keeping
* Updated a few more dependencies

## [4.1.6] (2022-06-19)
#### House Keeping
* Updated a few more dependencies

## [4.1.5] (2022-06-18)
#### Features
* Added a better way to demo the selected text and context menu in the extension's new walkthrough
* Improved the flow of the extension's new walkthrough and made it more clear for new users

#### Code Cleanup
* Fixed walkthrough step **Turn Off Demo Mode** to work properly
* Added VSCE to dev package requirements, to ensure latest version of VSCE is used

## [4.1.4] (2022-06-17)
#### Features
* Added support for more versions of VS Code (testing older version support)

## [4.1.3] (2022-06-14)
#### Documentation
* Increased project logo size to look better on larger screens (519x519px)
* Rearranged and improved the flow of the walkthrough
* Updated some of the wording of the Readme
* Updated keyboard shortcut image (in walkthrough) to have proper transparency effects

## [4.1.2] (2022-06-13)
#### Documentation
* Added some info badges to the project page. Trying Visual Studio Marketplace download count first to see how it works.

#### House Keeping
* Updated a few more dependencies

## [4.1.1] (2022-06-13)
#### House Keeping
* Added sponsorship opportunity to the project using Visual Studio Code's latest milestone update (May 2022).

## [4.1.0] (2022-06-11)
#### Features
* Wrote a walkthrough for the extension. When first installing the extension, you will be taken to the walkthrough and it will guide you through using it and adding your own custom search engines. This is a major update to the extension's usability and will be very helpful to new users.

## [4.0.3] (2022-06-06)
#### Features
* Improved the search bar prompt functionality. The search bar will now remain open until the <kbd>Enter</kbd> key or <kbd>Esc</kbd> key is pressed, allowing you to copy text from your code even after initiating the extension.

#### Documentation
* Updated all key commands in the documentation to use proper keyboard markup tags, such as <kbd>Alt</kbd>+<kbd>`</kbd>
* Added additional description to one of the recent extension settings, `useDefaultSearchEnginesList`. When enabled, the extension runs like **Demo Mode** and when disabled it will run with your custom search engines in the `searchEngines` setting (item/value pair).

#### House Keeping
* Updated a few more dependencies

## [4.0.2] (2022-05-25)
#### House Keeping
* Updated a few more dependencies

## [4.0.1] (2022-05-22)
#### Features
* Improved warning and error message system. Errors with search engine URLs are now logged to the console with helpful messages to guide the user to fix the issue

#### Documentation
* Moved around and rewrote some of the documentation to make it easier to find what you're looking for

## [4.0.0] (2022-05-21)
#### Features
* Added logic to toggle the display of default search engines in the Quick Pick list
* Extension will automatically run the search if there is only one search engine in the settings
* Added a new setting for handling default search engines only
* Added JSON snippet for easy adding default search engines to your settings.json file (use `searchengine` as the key)
* Backwards compatibility with previous versions should work, check your settings.json file for the new JSON snippet

#### Documentation
* Added more ideas for future development to the Readme

#### House Keeping
* Updated a few more dependencies

## [3.0.2] (2022-05-17)
#### House Keeping
* Updated a few more dependencies

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
* Added support for keyboard shortcut <kbd>Alt</kbd>+<kbd>`</kbd> to run the extension

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
* Added submenu to the Command Palette to allow the user to select the search engine to use
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