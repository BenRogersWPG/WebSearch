"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.runServer = void 0;
const app_1 = require("./app");
async function runServer(host, port, config) {
    const app = await (0, app_1.default)(config);
    const server = app.listen(port, host);
    console.log(`Listening on http://${host}:${port}`);
    return server;
}
exports.runServer = runServer;
