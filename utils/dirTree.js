"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
function dirTree(filename) {
    const stats = fs_1.lstatSync(filename);
    const info = {
        path: filename,
        name: path_1.basename(filename),
    };
    if (stats.isDirectory()) {
        info.type = 'folder';
        info.children = fs_1.readdirSync(filename).map((child) => {
            return dirTree(`${filename}/${child}`);
        });
    }
    else {
        // Assuming it's a file. In real life it could be a symlink or
        // something else!
        info.type = 'file';
    }
    return info;
}
exports.default = dirTree;
//# sourceMappingURL=dirTree.js.map