import { DMMF } from '@prisma/generator-helper';
import { FindArgs, GroupByFieldArg, Order, OrderedValue } from '../../types';
import { Delegate, DelegateProperties, Item } from '../../delegate';
import { Delegates } from '../../prismock';
export declare function findNextIncrement(properties: DelegateProperties, fieldName: string): number;
export declare function findOne(args: FindArgs, current: Delegate, delegates: Delegates): Record<string, unknown> | null;
export declare function where(whereArgs: import("../../types").FindWhereArgs | undefined, current: Delegate, delegates: Delegates): (item: Record<string, unknown>) => boolean;
export declare function calculateOrder(a: Item, b: Item, orderedProperties: Record<string, OrderedValue>, current: Delegate, delegates: Delegates): number;
export declare function calculateRelationOrder(a: Item, b: Item, orderedProperty: string, sortOrder: Order, current: Delegate, delegates: Delegates): number;
export declare function order(args: FindArgs, delegate: Delegate, delegates: Delegates): (items: Item[]) => Item[];
export declare function paginate(skip?: number, take?: number): (items: Item[]) => Item[];
export declare function includes(args: FindArgs, current: Delegate, delegates: Delegates): (item: Item) => Item;
export declare function select(selectArgs: FindArgs['select']): (item: Item) => Record<string, unknown>;
export declare const getJoinField: (field: DMMF.Field, delegates: Delegates) => import("@prisma/generator-helper").ReadonlyDeep<import("@prisma/generator-helper").ReadonlyDeep<{
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
}>> | undefined;
export declare const getDelegateFromField: (field: DMMF.Field, delegates: Delegates) => Delegate;
export declare const getFieldRelationshipWhere: (item: Item, field: DMMF.Field, delegates: Delegates) => Record<string, GroupByFieldArg>;
export declare const getFieldFromRelationshipWhere: (item: Item, field: DMMF.Field) => {
    [x: string]: GroupByFieldArg;
};
export declare const getFieldToRelationshipWhere: (item: Item, field: DMMF.Field) => {
    [x: string]: GroupByFieldArg;
};
export declare function findMany(args: FindArgs, current: Delegate, delegates: Delegates): Record<string, unknown>[];
