interface GetTypeArguments {
    typeDefinition: {
        type?: string;
        $ref?: string;
        properties?: any;
        enum?: string[];
        oneOf?: any;
    };
    sourceName?: string;
    isCamelCase?: boolean;
    isRequired?: boolean;
    registerSyntheticType?(payload: any): any;
}
export declare function getType({ typeDefinition, isCamelCase, registerSyntheticType, isRequired, sourceName, }: GetTypeArguments): string;
interface ProcessingPropertiesArguments {
    sourceName: string;
    sourceProperties: any;
    registerSyntheticType(payload: any): any;
    required?: any;
    isCamelCase?: boolean;
}
interface ProcessingAllOfPropertiesArguments {
    allOf: {
        $ref: string;
    }[];
}
export declare const allOfTypesSymbol: unique symbol;
export declare const EnumSymbol: unique symbol;
export declare const processingAllOf: ({ allOf }: ProcessingAllOfPropertiesArguments) => {
    [allOfTypesSymbol]: any[];
};
export declare const processingEnum: (values: string[]) => {
    [EnumSymbol]: string;
};
export declare const processingProperties: ({ sourceName, sourceProperties, isCamelCase, required, registerSyntheticType, }: ProcessingPropertiesArguments) => {};
export {};
