"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function typeAlias(type) {
    switch (type) {
        case 'integer':
            return 'number';
        case 'array':
        case 'file':
        case 'object':
            return 'any';
        default:
            return type;
    }
}
exports.default = typeAlias;
//# sourceMappingURL=getTypeAlias.js.map