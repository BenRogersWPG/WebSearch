const isSafari=navigator.vendor&&navigator.vendor.indexOf("Apple")>-1&&navigator.userAgent&&navigator.userAgent.indexOf("CriOS")===-1&&navigator.userAgent.indexOf("FxiOS")===-1,isFirefox=navigator.userAgent&&navigator.userAgent.indexOf("Firefox")>=0,searchParams=new URL(location.toString()).searchParams,ID=searchParams.get("id"),onElectron=searchParams.get("platform")==="electron",expectedWorkerVersion=parseInt(searchParams.get("swVersion")),trackFocus=({onFocus:e,onBlur:o})=>{const r=250;let t=document.hasFocus();setInterval(()=>{const n=document.hasFocus();n!==t&&(t=n,n?e():o())},r)},getActiveFrame=()=>document.getElementById("active-frame"),getPendingFrame=()=>document.getElementById("pending-frame");function assertIsDefined(e){if(typeof e=="undefined"||e===null)throw new Error("Found unexpected null");return e}const vscodePostMessageFuncName="__vscode_post_message__",defaultStyles=document.createElement("style");defaultStyles.id="_defaultStyles",defaultStyles.textContent=`
	html {
		scrollbar-color: var(--vscode-scrollbarSlider-background) var(--vscode-editor-background);
	}

	body {
		background-color: transparent;
		color: var(--vscode-editor-foreground);
		font-family: var(--vscode-font-family);
		font-weight: var(--vscode-font-weight);
		font-size: var(--vscode-font-size);
		margin: 0;
		padding: 0 20px;
	}

	img {
		max-width: 100%;
		max-height: 100%;
	}

	a, a code {
		color: var(--vscode-textLink-foreground);
	}

	a:hover {
		color: var(--vscode-textLink-activeForeground);
	}

	a:focus,
	input:focus,
	select:focus,
	textarea:focus {
		outline: 1px solid -webkit-focus-ring-color;
		outline-offset: -1px;
	}

	code {
		color: var(--vscode-textPreformat-foreground);
	}

	blockquote {
		background: var(--vscode-textBlockQuote-background);
		border-color: var(--vscode-textBlockQuote-border);
	}

	kbd {
		color: var(--vscode-editor-foreground);
		border-radius: 3px;
		vertical-align: middle;
		padding: 1px 3px;

		background-color: hsla(0,0%,50%,.17);
		border: 1px solid rgba(71,71,71,.4);
		border-bottom-color: rgba(88,88,88,.4);
		box-shadow: inset 0 -1px 0 rgba(88,88,88,.4);
	}
	.vscode-light kbd {
		background-color: hsla(0,0%,87%,.5);
		border: 1px solid hsla(0,0%,80%,.7);
		border-bottom-color: hsla(0,0%,73%,.7);
		box-shadow: inset 0 -1px 0 hsla(0,0%,73%,.7);
	}

	::-webkit-scrollbar {
		width: 10px;
		height: 10px;
	}

	::-webkit-scrollbar-corner {
		background-color: var(--vscode-editor-background);
	}

	::-webkit-scrollbar-thumb {
		background-color: var(--vscode-scrollbarSlider-background);
	}
	::-webkit-scrollbar-thumb:hover {
		background-color: var(--vscode-scrollbarSlider-hoverBackground);
	}
	::-webkit-scrollbar-thumb:active {
		background-color: var(--vscode-scrollbarSlider-activeBackground);
	}
	::highlight(find-highlight) {
		background-color: var(--vscode-editor-findMatchHighlightBackground);
	}
	::highlight(current-find-highlight) {
		background-color: var(--vscode-editor-findMatchBackground);
	}`;function getVsCodeApiScript(e,o){const r=o?encodeURIComponent(o):void 0;return`
			globalThis.acquireVsCodeApi = (function() {
				const originalPostMessage = window.parent['${vscodePostMessageFuncName}'].bind(window.parent);
				const doPostMessage = (channel, data, transfer) => {
					originalPostMessage(channel, data, transfer);
				};

				let acquired = false;

				let state = ${o?`JSON.parse(decodeURIComponent("${r}"))`:void 0};

				return () => {
					if (acquired && !${e}) {
						throw new Error('An instance of the VS Code API has already been acquired');
					}
					acquired = true;
					return Object.freeze({
						postMessage: function(message, transfer) {
							doPostMessage('onmessage', { message, transfer }, transfer);
						},
						setState: function(newState) {
							state = newState;
							doPostMessage('do-update-state', JSON.stringify(newState));
							return newState;
						},
						getState: function() {
							return state;
						}
					});
				};
			})();
			delete window.parent;
			delete window.top;
			delete window.frameElement;
		`}const workerReady=new Promise((e,o)=>{if(!areServiceWorkersEnabled())return o(new Error("Service Workers are not enabled. Webviews will not work. Try disabling private/incognito mode."));const r=`service-worker.js?v=${expectedWorkerVersion}&vscode-resource-base-authority=${searchParams.get("vscode-resource-base-authority")}&remoteAuthority=${searchParams.get("remoteAuthority")??""}`;navigator.serviceWorker.register(r).then(()=>navigator.serviceWorker.ready).then(async t=>{const n=async u=>{if(u.data.channel==="version")return navigator.serviceWorker.removeEventListener("message",n),u.data.version===expectedWorkerVersion?e():(console.log(`Found unexpected service worker version. Found: ${u.data.version}. Expected: ${expectedWorkerVersion}`),console.log("Attempting to reload service worker"),t.unregister().then(()=>navigator.serviceWorker.register(r)).then(()=>navigator.serviceWorker.ready).finally(()=>{e()}))};navigator.serviceWorker.addEventListener("message",n);const s=u=>{u.postMessage({channel:"version"})},a=navigator.serviceWorker.controller;if(a?.scriptURL.endsWith(r))s(a);else{const u=()=>{navigator.serviceWorker.removeEventListener("controllerchange",u),s(navigator.serviceWorker.controller)};navigator.serviceWorker.addEventListener("controllerchange",u)}}).catch(t=>{o(new Error(`Could not register service workers: ${t}.`))})}),hostMessaging=new class{constructor(){this.channel=new MessageChannel,this.handlers=new Map,this.channel.port1.onmessage=o=>{const r=o.data.channel,t=this.handlers.get(r);if(t)for(const n of t)n(o,o.data.args);else console.log("no handler for ",o)}}postMessage(o,r,t){this.channel.port1.postMessage({channel:o,data:r},t)}onMessage(o,r){let t=this.handlers.get(o);t||(t=[],this.handlers.set(o,t)),t.push(r)}async signalReady(){const o=a=>{window.parent.postMessage({target:ID,channel:"webview-ready",data:{}},a,[this.channel.port2])},r=searchParams.get("parentOrigin"),t=searchParams.get("id"),n=location.hostname;if(!crypto.subtle)throw new Error("Cannot validate in current context!");let s;try{const a=JSON.stringify({parentOrigin:r,salt:t}),f=new TextEncoder().encode(a),m=await crypto.subtle.digest("sha-256",f),g=Array.from(new Uint8Array(m)).map(l=>l.toString(16).padStart(2,"0")).join("");s=BigInt(`0x${g}`).toString(32).padStart(52,"0")}catch(a){throw a instanceof Error?a:new Error(String(a))}if(n===s||n.startsWith(s+"."))return o(r);throw new Error(`Expected '${s}' as hostname or subdomain!`)}},unloadMonitor=new class{constructor(){this.confirmBeforeClose="keyboardOnly",this.isModifierKeyDown=!1,hostMessaging.onMessage("set-confirm-before-close",(e,o)=>{this.confirmBeforeClose=o}),hostMessaging.onMessage("content",(e,o)=>{this.confirmBeforeClose=o.confirmBeforeClose}),window.addEventListener("beforeunload",e=>{if(!onElectron)switch(this.confirmBeforeClose){case"always":return e.preventDefault(),e.returnValue="","";case"never":break;case"keyboardOnly":default:{if(this.isModifierKeyDown)return e.preventDefault(),e.returnValue="","";break}}})}onIframeLoaded(e){e.contentWindow.addEventListener("keydown",o=>{this.isModifierKeyDown=o.metaKey||o.ctrlKey||o.altKey}),e.contentWindow.addEventListener("keyup",()=>{this.isModifierKeyDown=!1})}};let firstLoad=!0,loadTimeout,styleVersion=0,pendingMessages=[];const initData={initialScrollProgress:void 0,styles:void 0,activeTheme:void 0,themeName:void 0,screenReader:!1,reduceMotion:!1};hostMessaging.onMessage("did-load-resource",(e,o)=>{navigator.serviceWorker.ready.then(r=>{assertIsDefined(r.active).postMessage({channel:"did-load-resource",data:o},o.data?.buffer?[o.data.buffer]:[])})}),hostMessaging.onMessage("did-load-localhost",(e,o)=>{navigator.serviceWorker.ready.then(r=>{assertIsDefined(r.active).postMessage({channel:"did-load-localhost",data:o})})}),navigator.serviceWorker.addEventListener("message",e=>{switch(e.data.channel){case"load-resource":case"load-localhost":hostMessaging.postMessage(e.data.channel,e.data);return}});const applyStyles=(e,o)=>{if(!!e&&(o&&(o.classList.remove("vscode-light","vscode-dark","vscode-high-contrast","vscode-reduce-motion","vscode-using-screen-reader"),initData.activeTheme&&o.classList.add(initData.activeTheme),initData.reduceMotion&&o.classList.add("vscode-reduce-motion"),initData.screenReader&&o.classList.add("vscode-using-screen-reader"),o.dataset.vscodeThemeKind=initData.activeTheme,o.dataset.vscodeThemeName=initData.themeName||""),initData.styles)){const r=e.documentElement.style;for(let t=r.length-1;t>=0;t--){const n=r[t];n&&n.startsWith("--vscode-")&&r.removeProperty(n)}for(const t of Object.keys(initData.styles))r.setProperty(`--${t}`,initData.styles[t])}},handleInnerClick=e=>{if(!e?.view?.document)return;const o=e.view.document.querySelector("base");for(const r of e.composedPath()){const t=r;if(t.tagName&&t.tagName.toLowerCase()==="a"&&t.href){if(t.getAttribute("href")==="#")e.view.scrollTo(0,0);else if(t.hash&&(t.getAttribute("href")===t.hash||o&&t.href===o.href+t.hash)){const n=t.hash.slice(1);(e.view.document.getElementById(n)??e.view.document.getElementById(decodeURIComponent(n)))?.scrollIntoView()}else hostMessaging.postMessage("did-click-link",t.href.baseVal||t.href);e.preventDefault();return}}},handleAuxClick=e=>{if(!!e?.view?.document&&e.button===1)for(const o of e.composedPath()){const r=o;if(r.tagName&&r.tagName.toLowerCase()==="a"&&r.href){e.preventDefault();return}}},handleInnerKeydown=e=>{if(isUndoRedo(e)||isPrint(e)||isFindEvent(e))e.preventDefault();else if(isCopyPasteOrCut(e))if(onElectron)e.preventDefault();else return;hostMessaging.postMessage("did-keydown",{key:e.key,keyCode:e.keyCode,code:e.code,shiftKey:e.shiftKey,altKey:e.altKey,ctrlKey:e.ctrlKey,metaKey:e.metaKey,repeat:e.repeat})},handleInnerUp=e=>{hostMessaging.postMessage("did-keyup",{key:e.key,keyCode:e.keyCode,code:e.code,shiftKey:e.shiftKey,altKey:e.altKey,ctrlKey:e.ctrlKey,metaKey:e.metaKey,repeat:e.repeat})};function isCopyPasteOrCut(e){const o=e.ctrlKey||e.metaKey,r=e.shiftKey&&e.key.toLowerCase()==="insert";return o&&["c","v","x"].includes(e.key.toLowerCase())||r}function isUndoRedo(e){return(e.ctrlKey||e.metaKey)&&["z","y"].includes(e.key.toLowerCase())}function isPrint(e){return(e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="p"}function isFindEvent(e){return(e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="f"}let isHandlingScroll=!1;const handleWheel=e=>{isHandlingScroll||hostMessaging.postMessage("did-scroll-wheel",{deltaMode:e.deltaMode,deltaX:e.deltaX,deltaY:e.deltaY,deltaZ:e.deltaZ,detail:e.detail,type:e.type})},handleInnerScroll=e=>{if(isHandlingScroll)return;const o=e.target,r=e.currentTarget;if(!r||!o?.body)return;const t=r.scrollY/o.body.clientHeight;isNaN(t)||(isHandlingScroll=!0,window.requestAnimationFrame(()=>{try{hostMessaging.postMessage("did-scroll",t)}catch{}isHandlingScroll=!1}))};function handleInnerDragStartEvent(e){e.defaultPrevented||!e.dataTransfer||e.shiftKey||e.dataTransfer.items.length&&Array.prototype.every.call(e.dataTransfer.items,o=>o.kind==="file")&&hostMessaging.postMessage("drag-start")}function onDomReady(e){document.readyState==="interactive"||document.readyState==="complete"?e():document.addEventListener("DOMContentLoaded",e)}function areServiceWorkersEnabled(){try{return!!navigator.serviceWorker}catch{return!1}}function toContentHtml(e){const o=e.options,r=e.contents,t=new DOMParser().parseFromString(r,"text/html");if(t.querySelectorAll("a").forEach(s=>{if(!s.title){const a=s.getAttribute("href");typeof a=="string"&&(s.title=a)}}),t.body.hasAttribute("role")||t.body.setAttribute("role","document"),o.allowScripts){const s=t.createElement("script");s.id="_vscodeApiScript",s.textContent=getVsCodeApiScript(o.allowMultipleAPIAcquire,e.state),t.head.prepend(s)}t.head.prepend(defaultStyles.cloneNode(!0)),applyStyles(t,t.body);for(const s of Array.from(t.querySelectorAll("meta"))){const a=s.getAttribute("http-equiv");a&&!/^(content-security-policy|default-style|content-type)$/i.test(a)&&(console.warn(`Removing unsupported meta http-equiv: ${a}`),s.remove())}const n=t.querySelector('meta[http-equiv="Content-Security-Policy"]');if(!n)hostMessaging.postMessage("no-csp-found");else try{const s=n.getAttribute("content");if(s){const a=s.replace(/(vscode-webview-resource|vscode-resource):(?=(\s|;|$))/g,e.cspSource);n.setAttribute("content",a)}}catch(s){console.error(`Could not rewrite csp: ${s}`)}return`<!DOCTYPE html>
`+t.documentElement.outerHTML}onDomReady(()=>{if(!document.body)return;hostMessaging.onMessage("styles",(r,t)=>{++styleVersion,initData.styles=t.styles,initData.activeTheme=t.activeTheme,initData.themeName=t.themeName,initData.reduceMotion=t.reduceMotion,initData.screenReader=t.screenReader;const n=getActiveFrame();!n||n.contentDocument&&applyStyles(n.contentDocument,n.contentDocument.body)}),hostMessaging.onMessage("focus",()=>{const r=getActiveFrame();if(!r||!r.contentWindow){window.focus();return}document.activeElement!==r&&r.contentWindow.focus()});let e=0;hostMessaging.onMessage("content",async(r,t)=>{const n=++e;try{await workerReady}catch(i){console.error(`Webview fatal error: ${i}`),hostMessaging.postMessage("fatal-error",{message:i+""});return}if(n!==e)return;const s=t.options,a=toContentHtml(t),u=styleVersion,f=getActiveFrame(),m=firstLoad;let h;if(firstLoad)firstLoad=!1,h=(i,c)=>{typeof initData.initialScrollProgress=="number"&&!isNaN(initData.initialScrollProgress)&&c.scrollY===0&&c.scroll(0,i.clientHeight*initData.initialScrollProgress)};else{const i=f&&f.contentDocument&&f.contentDocument.body?assertIsDefined(f.contentWindow).scrollY:0;h=(c,d)=>{d.scrollY===0&&d.scroll(0,i)}}const g=getPendingFrame();g&&(g.setAttribute("id",""),document.body.removeChild(g)),m||(pendingMessages=[]);const l=document.createElement("iframe");l.setAttribute("id","pending-frame"),l.setAttribute("frameborder","0");const v=new Set(["allow-same-origin","allow-pointer-lock"]);s.allowScripts&&(v.add("allow-scripts"),v.add("allow-downloads")),s.allowForms&&v.add("allow-forms"),l.setAttribute("sandbox",Array.from(v).join(" ")),isFirefox||l.setAttribute("allow",s.allowScripts?"clipboard-read; clipboard-write;":""),l.src=`./fake.html?id=${ID}`,l.style.cssText="display: block; margin: 0; overflow: hidden; position: absolute; width: 100%; height: 100%; visibility: hidden",document.body.appendChild(l);function y(i){setTimeout(()=>{i.open(),i.write(a),i.close(),M(l),u!==styleVersion&&applyStyles(i,i.body)},0)}if(!s.allowScripts&&isSafari){const i=setInterval(()=>{if(!l.parentElement){clearInterval(i);return}const c=assertIsDefined(l.contentDocument);c.location.pathname.endsWith("/fake.html")&&c.readyState!=="loading"&&(clearInterval(i),y(c))},10)}else assertIsDefined(l.contentWindow).addEventListener("DOMContentLoaded",i=>{const c=i.target?i.target:void 0;y(assertIsDefined(c))});const w=(i,c)=>{i&&i.body&&h(i.body,c);const d=getPendingFrame();if(d&&d.contentDocument&&d.contentDocument===i){const p=document.hasFocus(),b=getActiveFrame();b&&document.body.removeChild(b),u!==styleVersion&&applyStyles(d.contentDocument,d.contentDocument.body),d.setAttribute("id","active-frame"),d.style.visibility="visible",c.addEventListener("scroll",handleInnerScroll),c.addEventListener("wheel",handleWheel),p&&c.focus(),pendingMessages.forEach(k=>{c.postMessage(k.message,window.origin,k.transfer)}),pendingMessages=[]}};function M(i){clearTimeout(loadTimeout),loadTimeout=void 0,loadTimeout=setTimeout(()=>{clearTimeout(loadTimeout),loadTimeout=void 0,w(assertIsDefined(i.contentDocument),assertIsDefined(i.contentWindow))},200);const c=assertIsDefined(i.contentWindow);c.addEventListener("load",function(d){const p=d.target;loadTimeout&&(clearTimeout(loadTimeout),loadTimeout=void 0,w(p,this))}),c.addEventListener("click",handleInnerClick),c.addEventListener("auxclick",handleAuxClick),c.addEventListener("keydown",handleInnerKeydown),c.addEventListener("keyup",handleInnerUp),c.addEventListener("contextmenu",d=>{d.defaultPrevented||(d.preventDefault(),hostMessaging.postMessage("did-context-menu",{clientX:d.clientX,clientY:d.clientY}))}),c.addEventListener("dragenter",handleInnerDragStartEvent),c.addEventListener("dragover",handleInnerDragStartEvent),unloadMonitor.onIframeLoaded(i)}}),hostMessaging.onMessage("message",(r,t)=>{if(!getPendingFrame()){const s=getActiveFrame();if(s){assertIsDefined(s.contentWindow).postMessage(t.message,window.origin,t.transfer);return}}pendingMessages.push(t)}),hostMessaging.onMessage("initial-scroll-position",(r,t)=>{initData.initialScrollProgress=t}),hostMessaging.onMessage("execCommand",(r,t)=>{const n=getActiveFrame();!n||assertIsDefined(n.contentDocument).execCommand(t)});let o;hostMessaging.onMessage("find",(r,t)=>{const n=getActiveFrame();if(!n)return;if(!t.previous&&o!==t.value){const a=n.contentWindow.getSelection();a.collapse(a.anchorNode)}o=t.value;const s=n.contentWindow.find(t.value,!1,t.previous,!0,!1,!1,!1);hostMessaging.postMessage("did-find",s)}),hostMessaging.onMessage("find-stop",(r,t)=>{const n=getActiveFrame();if(!!n&&(o=void 0,!t.clearSelection)){const s=n.contentWindow.getSelection();for(let a=0;a<s.rangeCount;a++)s.removeRange(s.getRangeAt(a))}}),trackFocus({onFocus:()=>hostMessaging.postMessage("did-focus"),onBlur:()=>hostMessaging.postMessage("did-blur")}),window[vscodePostMessageFuncName]=(r,t)=>{switch(r){case"onmessage":case"do-update-state":hostMessaging.postMessage(r,t);break}},window.addEventListener("keydown",handleInnerKeydown),window.addEventListener("dragenter",handleInnerDragStartEvent),window.addEventListener("dragover",handleInnerDragStartEvent),hostMessaging.signalReady()});

//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/9c29becfad5f68270b9b23efeafb147722c5feba/core/vs/workbench/contrib/webview/browser/pre/main.js.map
