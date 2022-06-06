(()=>{"use strict";var e={236:function(e,t,n){var o=this&&this.__awaiter||function(e,t,n,o){return new(n||(n=Promise))((function(i,r){function a(e){try{c(o.next(e))}catch(e){r(e)}}function s(e){try{c(o.throw(e))}catch(e){r(e)}}function c(e){var t;e.done?i(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(a,s)}c((o=o.apply(e,t||[])).next())}))};Object.defineProperty(t,"__esModule",{value:!0}),t.deactivate=t.activate=void 0;const i=n(496);t.activate=function(e){console.log('Thank you for installing Web Search, the extension is now active! To use, right click some highlighted text in your editor or type "web search" in the command pallete.'),e.subscriptions.push(i.commands.registerCommand("WebSearch.webSearchMenu",(()=>{!function(){var e;o(this,void 0,void 0,(function*(){const t=i.window.activeTextEditor;let n=null===(e=i.window.activeTextEditor)||void 0===e?void 0:e.document.getText(t.selection);const o=i.workspace.getConfiguration("webSearch").get("allowManualSearch"),r=i.workspace.getConfiguration("webSearch").get("useDefaultSearchEnginesList");if(!(void 0!==n&&""!==n||o))return void i.window.showInformationMessage("No text selected. Please select text in the editor and try again.");if((void 0===n||""===n)&&o&&(n=yield i.window.showInputBox({placeHolder:"Please enter the text you would like to search for.",prompt:"Please enter the text you would like to search for.",ignoreFocusOut:!0,validateInput:e=>""===e?"Please enter a search term.":null}),void 0===n||""===n))return void i.window.showInformationMessage("No text entered. Please enter text in the prompt, or select text.");const a=i.workspace.getConfiguration("webSearch").get("searchEngine"),s=new Array(i.workspace.getConfiguration("webSearch").get("searchEngines")),c=new Array(i.workspace.getConfiguration("webSearch").get("defaultSearchEngines"));let l=[];r&&c.forEach((e=>{Object.entries(e).forEach((([e,t])=>{l.push({label:t.sitename,description:t.url,detail:`Search ${t.sitename} for ${n?n.length<=60?n.slice(0,60):n.slice(0,60).concat("…"):""}`})}))}));var d=JSON.parse(JSON.stringify(s)),u=Object.keys(d[0]).map((e=>[String(e),d[0][e]]));for(let e=0;e<u.length;e++)l.push({label:u[e][0],description:u[e][1],detail:`Search ${u[e][0]} for ${n?n.length<=60?n.slice(0,60):n.slice(0,60).concat("…"):""}`});if(r||0===l.length){const e={label:"Old Search Engine",description:a,detail:"Search Engine from old settings"};l.push(e)}let h;l=l.filter(((e,t,n)=>t===n.findIndex((t=>t.description===e.description)))),h=l.length>1?yield i.window.showQuickPick(l):l[0];let g="";if(null!=h)if(g=null==h?void 0:h.description,g.includes("%s"))g=g.replace("%s",n||""),i.window.showInformationMessage(`Searching ${(null==h?void 0:h.label)?null==h?void 0:h.label:"web"} for: ${n}`),i.env.openExternal(i.Uri.parse(g));else{const e=`Search engine, *${(null==h?void 0:h.label)?null==h?void 0:h.label:"web"}* setting is not valid. Please check your custom settings.`;i.window.showErrorMessage(e),console.log(e),i.window.createOutputChannel("Web Search","markdown").appendLine(e+"\nBe sure to include `%s` in the search engine URL.")}else i.window.showWarningMessage("No search engine selected. Please select one from the list and try again.")}))}()})))},t.deactivate=function(){}},496:e=>{e.exports=require("vscode")}},t={},n=function n(o){var i=t[o];if(void 0!==i)return i.exports;var r=t[o]={exports:{}};return e[o].call(r.exports,r,r.exports,n),r.exports}(236),o=exports;for(var i in n)o[i]=n[i];n.__esModule&&Object.defineProperty(o,"__esModule",{value:!0})})();