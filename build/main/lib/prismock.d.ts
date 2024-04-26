import { PrismaClient } from '@prisma/client';
import { DMMF } from '@prisma/generator-helper';
import { Generator } from '@prisma/internals/dist/Generator';
import { Delegate, DelegateProperties, Item } from './delegate';
import { PrismockClientType } from './client';
type Options = {
    schemaPath?: string;
};
type OptionsSync = {
    models: DMMF.Model[];
};
export type Data = Record<string, Item[]>;
export type Properties = Record<string, DelegateProperties>;
export type Delegates = Record<string, Delegate>;
export declare function generateDMMF(schemaPath?: string): Promise<import("@prisma/generator-helper").ReadonlyDeep<{
    datamodel: import("@prisma/generator-helper").ReadonlyDeep<{
        models: import("@prisma/generator-helper").ReadonlyDeep<{
            name: string;
            dbName: string | null;
            fields: import("@prisma/generator-helper").ReadonlyDeep<{
                kind: DMMF.FieldKind;
                name: string;
                isRequired: boolean;
                isList: boolean;
                isUnique: boolean;
                isId: boolean;
                isReadOnly: boolean;
                isGenerated?: boolean | undefined;
                isUpdatedAt?: boolean | undefined;
                type: string;
                dbName?: string | null | undefined;
                hasDefaultValue: boolean;
                default?: import("@prisma/generator-helper").ReadonlyDeep<{
                    name: string;
                    args: any[];
                }> | DMMF.FieldDefaultScalar | DMMF.FieldDefaultScalar[] | undefined;
                relationFromFields?: string[] | undefined;
                relationToFields?: string[] | undefined;
                relationOnDelete?: string | undefined;
                relationName?: string | undefined;
                documentation?: string | undefined;
            }>[];
            uniqueFields: string[][];
            uniqueIndexes: import("@prisma/generator-helper").ReadonlyDeep<{
                name: string;
                fields: string[];
            }>[];
            documentation?: string | undefined;
            primaryKey: import("@prisma/generator-helper").ReadonlyDeep<{
                name: string | null;
                fields: string[];
            }> | null;
            isGenerated?: boolean | undefined;
        }>[];
        enums: import("@prisma/generator-helper").ReadonlyDeep<{
            name: string;
            values: import("@prisma/generator-helper").ReadonlyDeep<{
                name: string;
                dbName: string | null;
            }>[];
            dbName?: string | null | undefined;
            documentation?: string | undefined;
        }>[];
        types: import("@prisma/generator-helper").ReadonlyDeep<{
            name: string;
            dbName: string | null;
            fields: import("@prisma/generator-helper").ReadonlyDeep<{
                kind: DMMF.FieldKind;
                name: string;
                isRequired: boolean;
                isList: boolean;
                isUnique: boolean;
                isId: boolean;
                isReadOnly: boolean;
                isGenerated?: boolean | undefined;
                isUpdatedAt?: boolean | undefined;
                type: string;
                dbName?: string | null | undefined;
                hasDefaultValue: boolean;
                default?: import("@prisma/generator-helper").ReadonlyDeep<{
                    name: string;
                    args: any[];
                }> | DMMF.FieldDefaultScalar | DMMF.FieldDefaultScalar[] | undefined;
                relationFromFields?: string[] | undefined;
                relationToFields?: string[] | undefined;
                relationOnDelete?: string | undefined;
                relationName?: string | undefined;
                documentation?: string | undefined;
            }>[];
            uniqueFields: string[][];
            uniqueIndexes: import("@prisma/generator-helper").ReadonlyDeep<{
                name: string;
                fields: string[];
            }>[];
            documentation?: string | undefined;
            primaryKey: import("@prisma/generator-helper").ReadonlyDeep<{
                name: string | null;
                fields: string[];
            }> | null;
            isGenerated?: boolean | undefined;
        }>[];
    }>;
    schema: import("@prisma/generator-helper").ReadonlyDeep<{
        rootQueryType?: string | undefined;
        rootMutationType?: string | undefined;
        inputObjectTypes: {
            model?: import("@prisma/generator-helper").ReadonlyDeep<{
                name: string;
                constraints: {
                    maxNumFields: number | null;
                    minNumFields: number | null;
                    fields?: string[] | undefined;
                };
                meta?: {
                    source?: string | undefined;
                } | undefined;
                fields: import("@prisma/generator-helper").ReadonlyDeep<{
                    name: string;
                    comment?: string | undefined;
                    isNullable: boolean;
                    isRequired: boolean;
                    inputTypes: DMMF.InputTypeRef[];
                    deprecation?: import("@prisma/generator-helper").ReadonlyDeep<{
                        sinceVersion: string;
                        reason: string;
                        plannedRemovalVersion?: string | undefined;
                    }> | undefined;
                }>[];
            }>[] | undefined;
            prisma: import("@prisma/generator-helper").ReadonlyDeep<{
                name: string;
                constraints: {
                    maxNumFields: number | null;
                    minNumFields: number | null;
                    fields?: string[] | undefined;
                };
                meta?: {
                    source?: string | undefined;
                } | undefined;
                fields: import("@prisma/generator-helper").ReadonlyDeep<{
                    name: string;
                    comment?: string | undefined;
                    isNullable: boolean;
                    isRequired: boolean;
                    inputTypes: DMMF.InputTypeRef[];
                    deprecation?: import("@prisma/generator-helper").ReadonlyDeep<{
                        sinceVersion: string;
                        reason: string;
                        plannedRemovalVersion?: string | undefined;
                    }> | undefined;
                }>[];
            }>[];
        };
        outputObjectTypes: {
            model: import("@prisma/generator-helper").ReadonlyDeep<{
                name: string;
                fields: import("@prisma/generator-helper").ReadonlyDeep<{
                    name: string;
                    isNullable?: boolean | undefined;
                    outputType: DMMF.OutputTypeRef;
                    args: import("@prisma/generator-helper").ReadonlyDeep<{
                        name: string;
                        comment?: string | undefined;
                        isNullable: boolean;
                        isRequired: boolean;
                        inputTypes: DMMF.InputTypeRef[];
                        deprecation?: import("@prisma/generator-helper").ReadonlyDeep<{
                            sinceVersion: string;
                            reason: string;
                            plannedRemovalVersion?: string | undefined;
                        }> | undefined;
                    }>[];
                    deprecation?: import("@prisma/generator-helper").ReadonlyDeep<{
                        sinceVersion: string;
                        reason: string;
                        plannedRemovalVersion?: string | undefined;
                    }> | undefined;
                    documentation?: string | undefined;
                }>[];
            }>[];
            prisma: import("@prisma/generator-helper").ReadonlyDeep<{
                name: string;
                fields: import("@prisma/generator-helper").ReadonlyDeep<{
                    name: string;
                    isNullable?: boolean | undefined;
                    outputType: DMMF.OutputTypeRef;
                    args: import("@prisma/generator-helper").ReadonlyDeep<{
                        name: string;
                        comment?: string | undefined;
                        isNullable: boolean;
                        isRequired: boolean;
                        inputTypes: DMMF.InputTypeRef[];
                        deprecation?: import("@prisma/generator-helper").ReadonlyDeep<{
                            sinceVersion: string;
                            reason: string;
                            plannedRemovalVersion?: string | undefined;
                        }> | undefined;
                    }>[];
                    deprecation?: import("@prisma/generator-helper").ReadonlyDeep<{
                        sinceVersion: string;
                        reason: string;
                        plannedRemovalVersion?: string | undefined;
                    }> | undefined;
                    documentation?: string | undefined;
                }>[];
            }>[];
        };
        enumTypes: {
            model?: import("@prisma/generator-helper").ReadonlyDeep<{
                name: string;
                values: string[];
            }>[] | undefined;
            prisma: import("@prisma/generator-helper").ReadonlyDeep<{
                name: string;
                values: string[];
            }>[];
        };
        fieldRefTypes: {
            prisma?: import("@prisma/generator-helper").ReadonlyDeep<{
                name: string;
                allowTypes: DMMF.FieldRefAllowType[];
                fields: import("@prisma/generator-helper").ReadonlyDeep<{
                    name: string;
                    comment?: string | undefined;
                    isNullable: boolean;
                    isRequired: boolean;
                    inputTypes: DMMF.InputTypeRef[];
                    deprecation?: import("@prisma/generator-helper").ReadonlyDeep<{
                        sinceVersion: string;
                        reason: string;
                        plannedRemovalVersion?: string | undefined;
                    }> | undefined;
                }>[];
            }>[] | undefined;
        };
    }>;
    mappings: import("@prisma/generator-helper").ReadonlyDeep<{
        modelOperations: import("@prisma/generator-helper").ReadonlyDeep<{
            model: string;
            plural: string;
            findUnique?: string | null | undefined;
            findUniqueOrThrow?: string | null | undefined;
            findFirst?: string | null | undefined;
            findFirstOrThrow?: string | null | undefined;
            findMany?: string | null | undefined;
            create?: string | null | undefined;
            createMany?: string | null | undefined;
            update?: string | null | undefined;
            updateMany?: string | null | undefined;
            upsert?: string | null | undefined;
            delete?: string | null | undefined;
            deleteMany?: string | null | undefined;
            aggregate?: string | null | undefined;
            groupBy?: string | null | undefined;
            count?: string | null | undefined;
            findRaw?: string | null | undefined;
            aggregateRaw?: string | null | undefined;
        }>[];
        otherOperations: {
            read: string[];
            write: string[];
        };
    }>;
}>>;
export declare function fetchGenerator(schemaPath?: string): Promise<Generator>;
export declare function getProvider(generator: Generator): import("@prisma/generator-helper").ConnectorType | undefined;
export declare function generatePrismock<T = PrismaClient>(options?: Options): Promise<PrismockClientType<T>>;
export declare function generatePrismockSync<T = PrismockClientType>(options: OptionsSync): PrismockClientType<T>;
export declare function generateDelegates(options: OptionsSync): {
    delegates: Delegates;
    getData: () => Data;
    setData: (d: Data) => void;
};
export {};
