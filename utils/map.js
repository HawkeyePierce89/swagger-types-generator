"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const map = (fn, x) => Object.keys(x).reduce((mem, k) => {
    mem[k] = fn(k, x[k]);
    return mem;
}, {});
exports.default = map;
//# sourceMappingURL=map.js.map