"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureMounts = exports.fsProviderFolderUri = exports.fsProviderExtensionPrefix = void 0;
const kstatic = require("koa-static");
const kmount = require("koa-mount");
const Router = require("@koa/router");
const fs_1 = require("fs");
const path = require("path");
const mountPrefix = '/static/mount';
exports.fsProviderExtensionPrefix = '/static/extensions/fs';
exports.fsProviderFolderUri = 'vscode-test-web://mount/';
function configureMounts(config, app) {
    const folderMountPath = config.folderMountPath;
    if (folderMountPath) {
        console.log(`Serving local content ${folderMountPath} at ${mountPrefix}`);
        app.use(fileOps(mountPrefix, folderMountPath));
        app.use(kmount(mountPrefix, kstatic(folderMountPath, { hidden: true })));
        app.use(kmount(exports.fsProviderExtensionPrefix, kstatic(path.join(__dirname, '../../fs-provider'), { hidden: true })));
    }
}
exports.configureMounts = configureMounts;
function fileOps(mountPrefix, folderMountPath) {
    const router = new Router();
    router.get(`${mountPrefix}(/.*)?`, async (ctx, next) => {
        if (ctx.query.stat !== undefined) {
            const p = path.join(folderMountPath, ctx.path.substring(mountPrefix.length));
            try {
                const stats = await fs_1.promises.stat(p);
                ctx.body = {
                    type: getFileType(stats),
                    ctime: stats.ctime.getTime(),
                    mtime: stats.mtime.getTime(),
                    size: stats.size
                };
            }
            catch (e) {
                ctx.body = { error: e.code };
            }
        }
        else if (ctx.query.readdir !== undefined) {
            const p = path.join(folderMountPath, ctx.path.substring(mountPrefix.length));
            try {
                const entries = await fs_1.promises.readdir(p, { withFileTypes: true });
                ctx.body = entries.map(d => ({ name: d.name, type: getFileType(d) }));
            }
            catch (e) {
                ctx.body = { error: e.code };
            }
        }
        else {
            return next();
        }
    });
    return router.routes();
}
var FileType;
(function (FileType) {
    FileType[FileType["Unknown"] = 0] = "Unknown";
    FileType[FileType["File"] = 1] = "File";
    FileType[FileType["Directory"] = 2] = "Directory";
    FileType[FileType["SymbolicLink"] = 64] = "SymbolicLink";
})(FileType || (FileType = {}));
function getFileType(stats) {
    if (stats.isFile()) {
        return FileType.File;
    }
    else if (stats.isDirectory()) {
        return FileType.Directory;
    }
    else if (stats.isSymbolicLink()) {
        return FileType.SymbolicLink;
    }
    return FileType.Unknown;
}
