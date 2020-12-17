"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const object_1 = tslib_1.__importDefault(require("@tinkoff/utils/is/object"));
const empty_1 = tslib_1.__importDefault(require("@tinkoff/utils/is/empty"));
const capitalize_1 = tslib_1.__importDefault(require("@tinkoff/utils/string/capitalize"));
const noop_1 = tslib_1.__importDefault(require("@tinkoff/utils/function/noop"));
const map_1 = tslib_1.__importDefault(require("./map"));
const getTypeAlias_1 = tslib_1.__importDefault(require("./getTypeAlias"));
function getType({ typeDefinition, isCamelCase = true, registerSyntheticType = noop_1.default, isRequired, sourceName, }) {
    const type = typeDefinition.type || (typeDefinition.$ref && typeDefinition.$ref.split('/').pop());
    if (type === 'object' && typeDefinition.properties && sourceName) {
        const typeName = `${sourceName}Payload`;
        registerSyntheticType({
            // eslint-disable-next-line no-use-before-define
            [typeName]: exports.processingProperties({
                sourceName,
                isCamelCase,
                registerSyntheticType,
                sourceProperties: typeDefinition.properties,
            }),
        });
        return getTypeString(isRequired, typeName);
    }
    if (!empty_1.default(typeDefinition.enum)) {
        return getTypeString(isRequired, typeDefinition.enum.map((item) => `'${item}'`).join(' | '));
    }
    if (!empty_1.default(typeDefinition.oneOf)) {
        return getTypeString(isRequired, typeDefinition.oneOf
            .reduce((result, item) => {
            if (item && item.$ref) {
                result.push(item.$ref.split('/').pop());
            }
            return result;
        }, [])
            .join(' | '));
    }
    if (!type) {
        return getTypeString(isRequired, 'any');
    }
    return getTypeString(isRequired, getTypeAlias_1.default(type));
}
exports.getType = getType;
exports.allOfTypesSymbol = Symbol('allOfTypes');
exports.EnumSymbol = Symbol('enum');
exports.processingAllOf = ({ allOf }) => ({
    [exports.allOfTypesSymbol]: allOf.reduce((result, item) => {
        if (item && item.$ref) {
            result.push(item.$ref.split('/').pop());
        }
        return result;
    }, []),
});
exports.processingEnum = (values) => ({
    [exports.EnumSymbol]: values.map(x => `"${x}"`).join(' | '),
});
exports.processingProperties = ({ sourceName, sourceProperties = {}, isCamelCase = true, required = [], registerSyntheticType, }) => {
    const properties = map_1.default((propertyName, property) => {
        const isRequired = required ? required.includes(propertyName) : true;
        if (property.type === 'array') {
            const arrayType = getType({
                sourceName,
                isCamelCase,
                registerSyntheticType,
                isRequired,
                typeDefinition: property.items,
            });
            if (object_1.default(arrayType)) {
                const typeName = capitalize_1.default(`${capitalize_1.default(propertyName)}Item`);
                registerSyntheticType({
                    [typeName]: arrayType,
                });
                return `${getTypeAlias_1.default(arrayType.type)}[]`;
            }
            return `${getTypeAlias_1.default(arrayType)}[]`;
        }
        return getType({ sourceName, isCamelCase, registerSyntheticType, isRequired, typeDefinition: property });
    }, sourceProperties);
    return properties;
};
function getTypeString(isRequired, type) {
    return `${isRequired ? '' : '?'}: ${type}`;
}
//# sourceMappingURL=parse.js.map