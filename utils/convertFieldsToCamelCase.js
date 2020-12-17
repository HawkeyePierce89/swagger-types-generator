"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const object_1 = tslib_1.__importDefault(require("@tinkoff/utils/is/object"));
const array_1 = tslib_1.__importDefault(require("@tinkoff/utils/is/array"));
const toCamelCase = (string) => string.replace(/([_][a-z])/gi, (part) => part.toUpperCase().replace('_', ''));
function convertFieldsToCamelCase(source) {
    if (array_1.default(source)) {
        return source.map((item) => {
            return convertFieldsToCamelCase(item);
        });
    }
    if (object_1.default(source)) {
        const converted = {};
        Object.keys(source).forEach((key) => {
            converted[toCamelCase(key)] = convertFieldsToCamelCase(source[key]);
        });
        return converted;
    }
    return source;
}
exports.default = convertFieldsToCamelCase;
//# sourceMappingURL=convertFieldsToCamelCase.js.map