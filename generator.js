"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path_1 = require("path");
const fs_1 = require("fs");
const mergeDeep_1 = tslib_1.__importDefault(require("@tinkoff/utils/object/mergeDeep"));
const path_2 = tslib_1.__importDefault(require("@tinkoff/utils/object/path"));
const yamljs_1 = tslib_1.__importDefault(require("yamljs"));
const superagent_1 = tslib_1.__importDefault(require("superagent"));
const debug_1 = tslib_1.__importDefault(require("debug"));
const parse_1 = require("./utils/parse");
const generate_1 = require("./utils/generate");
const map_1 = tslib_1.__importDefault(require("./utils/map"));
const getTypeAlias_1 = tslib_1.__importDefault(require("./utils/getTypeAlias"));
const log = debug_1.default('swagger_types_generator:generator:info');
function generator() {
    const [, , pathToConfig] = process.argv;
    if (!pathToConfig) {
        // tslint:disable-next-line:no-console
        console.log('Path to config required!');
        return;
    }
    const sourceConfig = require(path_1.join(process.cwd(), pathToConfig));
    const config = sourceConfig.default || sourceConfig;
    const { isActionsEnable } = config;
    getSchemas(config)
        .then(parseSchemas)
        .then(({ types, methods }) => {
        log('Generating types…');
        generate_1.generateTypes({ types, config });
        if (isActionsEnable) {
            log('Generating actions types…');
            generate_1.generatingActionsTypes({ types, methods, config });
        }
        log('Done!');
    });
}
exports.default = generator;
function getSchemas(config) {
    const { schemas, projectDir, isCachingEnable } = config;
    log(`Get schemas, total ${schemas.length}, caching: ${isCachingEnable}`);
    return Promise.all(schemas.map(({ url, namespace, fileName, format }) => {
        const cacheFilePath = path_1.join(projectDir, fileName);
        return (isCachingEnable
            ? getCachedSchema(cacheFilePath).then((schema) => ({ namespace, schema }))
            : Promise.reject()).catch(() => {
            log(`Request schema, url: ${url}`);
            return superagent_1.default
                .get(url)
                .then((response) => (format === 'yaml' ? yamljs_1.default.parse(response.text) : response.body))
                .then((schema) => {
                if (isCachingEnable) {
                    fs_1.writeFileSync(cacheFilePath, JSON.stringify(schema));
                }
                return { schema, namespace };
            });
        });
    }));
}
function getCachedSchema(path) {
    log(`Read cached schema, path: ${path}`);
    try {
        return Promise.resolve(JSON.parse(fs_1.readFileSync(path, 'utf-8')));
    }
    catch (_a) {
        return Promise.reject();
    }
}
function parseSchemas(schemas) {
    const syntheticTypes = {};
    const types = {};
    let methods = {};
    log('Parse schemas…');
    schemas.forEach(({ schema, namespace = 'default' }) => {
        syntheticTypes[namespace] = syntheticTypes[namespace] || {};
        types[namespace] = Object.assign(Object.assign({}, types[namespace]), map_1.default((sourceName, _a) => {
            var { properties: sourceProperties, required, allOf } = _a, rest = tslib_1.__rest(_a, ["properties", "required", "allOf"]);
            if (allOf) {
                return parse_1.processingAllOf({
                    allOf,
                });
            }
            if (rest.enum) {
                return parse_1.processingEnum(rest.enum);
            }
            return parse_1.processingProperties({
                sourceName,
                sourceProperties,
                required,
                isCamelCase: Boolean(schema.definitions),
                registerSyntheticType: (type) => {
                    syntheticTypes[namespace] = Object.assign(Object.assign({}, syntheticTypes[namespace]), type);
                },
            });
        }, schema.definitions || schema.components.schemas));
        methods = Object.assign(Object.assign({}, methods), map_1.default((methodName, { post, get, put, delete: deleteMethod }) => {
            const responseDescription = post || get || put || deleteMethod;
            if (!responseDescription) {
                return;
            }
            const { parameters: sourceParameters = [], responses: sourceResponses } = responseDescription;
            const result = {};
            const parameters = path_2.default(['schema'], sourceParameters.find(({ name }) => name === 'payload'));
            if (parameters) {
                const type = parameters.type || (parameters.$ref && parameters.$ref.split('/').pop());
                result.parameters = { type: getTypeAlias_1.default(type) };
            }
            const responses = path_2.default(['schema'], sourceResponses[200]);
            if (responses) {
                const type = responses.type || (responses.$ref && responses.$ref.split('/').pop());
                result.responses = { type: getTypeAlias_1.default(type) };
            }
            return result;
        }, schema.paths));
    });
    return { methods, types: mergeDeep_1.default(types, syntheticTypes) };
}
//# sourceMappingURL=generator.js.map