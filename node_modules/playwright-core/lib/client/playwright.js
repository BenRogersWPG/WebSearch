"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Playwright = void 0;

var _errors = require("../common/errors");

var socks = _interopRequireWildcard(require("../common/socksProxy"));

var _android = require("./android");

var _browserType = require("./browserType");

var _channelOwner = require("./channelOwner");

var _electron = require("./electron");

var _fetch = require("./fetch");

var _localUtils = require("./localUtils");

var _selectors = require("./selectors");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/**
 * Copyright (c) Microsoft Corporation.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Playwright extends _channelOwner.ChannelOwner {
  constructor(parent, type, guid, initializer) {
    super(parent, type, guid, initializer);
    this._android = void 0;
    this._electron = void 0;
    this.chromium = void 0;
    this.firefox = void 0;
    this.webkit = void 0;
    this.devices = void 0;
    this.selectors = void 0;
    this.request = void 0;
    this.errors = void 0;
    this._utils = void 0;
    this._socksProxyHandler = void 0;
    this.request = new _fetch.APIRequest(this);
    this.chromium = _browserType.BrowserType.from(initializer.chromium);
    this.chromium._playwright = this;
    this.firefox = _browserType.BrowserType.from(initializer.firefox);
    this.firefox._playwright = this;
    this.webkit = _browserType.BrowserType.from(initializer.webkit);
    this.webkit._playwright = this;
    this._android = _android.Android.from(initializer.android);
    this._electron = _electron.Electron.from(initializer.electron);
    this.devices = {};

    for (const {
      name,
      descriptor
    } of initializer.deviceDescriptors) this.devices[name] = descriptor;

    this.selectors = new _selectors.Selectors();
    this.errors = {
      TimeoutError: _errors.TimeoutError
    };
    this._utils = _localUtils.LocalUtils.from(initializer.utils);

    const selectorsOwner = _selectors.SelectorsOwner.from(initializer.selectors);

    this.selectors._addChannel(selectorsOwner);

    this._connection.on('close', () => {
      var _this$_socksProxyHand;

      this.selectors._removeChannel(selectorsOwner);

      (_this$_socksProxyHand = this._socksProxyHandler) === null || _this$_socksProxyHand === void 0 ? void 0 : _this$_socksProxyHand.cleanup();
    });

    global._playwrightInstance = this;
  }

  async _hideHighlight() {
    await this._channel.hideHighlight();
  }

  _setSelectors(selectors) {
    const selectorsOwner = _selectors.SelectorsOwner.from(this._initializer.selectors);

    this.selectors._removeChannel(selectorsOwner);

    this.selectors = selectors;

    this.selectors._addChannel(selectorsOwner);
  } // TODO: remove this methods together with PlaywrightClient.


  _enablePortForwarding(redirectPortForTest) {
    const socksSupport = this._initializer.socksSupport;
    if (!socksSupport) return;
    const handler = new socks.SocksProxyHandler(redirectPortForTest);
    this._socksProxyHandler = handler;
    handler.on(socks.SocksProxyHandler.Events.SocksConnected, payload => socksSupport.socksConnected(payload).catch(() => {}));
    handler.on(socks.SocksProxyHandler.Events.SocksData, payload => socksSupport.socksData({
      uid: payload.uid,
      data: payload.data.toString('base64')
    }).catch(() => {}));
    handler.on(socks.SocksProxyHandler.Events.SocksError, payload => socksSupport.socksError(payload).catch(() => {}));
    handler.on(socks.SocksProxyHandler.Events.SocksFailed, payload => socksSupport.socksFailed(payload).catch(() => {}));
    handler.on(socks.SocksProxyHandler.Events.SocksEnd, payload => socksSupport.socksEnd(payload).catch(() => {}));
    socksSupport.on('socksRequested', payload => handler.socketRequested(payload));
    socksSupport.on('socksClosed', payload => handler.socketClosed(payload));
    socksSupport.on('socksData', payload => handler.sendSocketData({
      uid: payload.uid,
      data: Buffer.from(payload.data, 'base64')
    }));
  }

  static from(channel) {
    return channel._object;
  }

}

exports.Playwright = Playwright;