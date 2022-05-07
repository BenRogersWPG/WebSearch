"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.getScannedBuiltinExtensions = exports.prebuiltExtensionsLocation = exports.scanForExtensions = void 0;
const fs_1 = require("fs");
const path = require("path");
const download_1 = require("./download");
async function scanForExtensions(rootPath, serverURI) {
    const result = [];
    async function getExtension(relativePosixFolderPath) {
        try {
            const packageJSONPath = path.join(rootPath, relativePosixFolderPath, 'package.json');
            if ((await fs_1.promises.stat(packageJSONPath)).isFile()) {
                return {
                    scheme: serverURI.scheme,
                    authority: serverURI.authority,
                    path: path.posix.join(serverURI.path, relativePosixFolderPath),
                };
            }
        }
        catch {
            return undefined;
        }
    }
    async function processFolder(relativePosixFolderPath) {
        const extension = await getExtension(relativePosixFolderPath);
        if (extension) {
            result.push(extension);
        }
        else {
            const folderPath = path.join(rootPath, relativePosixFolderPath);
            const entries = await fs_1.promises.readdir(folderPath, { withFileTypes: true });
            for (const entry of entries) {
                if (entry.isDirectory() && entry.name.charAt(0) !== '.') {
                    await processFolder(path.posix.join(relativePosixFolderPath, entry.name));
                }
            }
        }
    }
    await processFolder('');
    return result;
}
exports.scanForExtensions = scanForExtensions;
exports.prebuiltExtensionsLocation = '.build/builtInExtensions';
async function getScannedBuiltinExtensions(vsCodeDevLocation) {
    // use the build utility as to not duplicate the code
    const extensionsUtil = await Promise.resolve().then(() => require(path.join(vsCodeDevLocation, 'build', 'lib', 'extensions.js')));
    const localExtensions = extensionsUtil.scanBuiltinExtensions(path.join(vsCodeDevLocation, 'extensions'));
    const prebuiltExtensions = extensionsUtil.scanBuiltinExtensions(path.join(vsCodeDevLocation, exports.prebuiltExtensionsLocation));
    for (const ext of localExtensions) {
        let browserMain = ext.packageJSON.browser;
        if (browserMain) {
            if (!browserMain.endsWith('.js')) {
                browserMain = browserMain + '.js';
            }
            const browserMainLocation = path.join(vsCodeDevLocation, 'extensions', ext.extensionPath, browserMain);
            if (!await (0, download_1.fileExists)(browserMainLocation)) {
                console.log(`${browserMainLocation} not found. Make sure all extensions are compiled (use 'yarn watch-web').`);
            }
        }
    }
    return localExtensions.concat(prebuiltExtensions);
}
exports.getScannedBuiltinExtensions = getScannedBuiltinExtensions;
