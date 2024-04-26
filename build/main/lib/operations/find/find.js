"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findMany = exports.getFieldToRelationshipWhere = exports.getFieldFromRelationshipWhere = exports.getFieldRelationshipWhere = exports.getDelegateFromField = exports.getJoinField = exports.select = exports.includes = exports.paginate = exports.order = exports.calculateRelationOrder = exports.calculateOrder = exports.where = exports.findOne = exports.findNextIncrement = void 0;
const helpers_1 = require("../../helpers");
const match_1 = require("./match");
function findNextIncrement(properties, fieldName) {
    const current = properties.increment[fieldName];
    const increment = (current !== null && current !== void 0 ? current : 0) + 1;
    Object.assign(properties.increment, { [fieldName]: increment });
    return increment;
}
exports.findNextIncrement = findNextIncrement;
function findOne(args, current, delegates) {
    const found = (0, helpers_1.pipe)((items) => items.filter((item) => where(args.where, current, delegates)(item)), order(args, current, delegates), connect(args, current, delegates), paginate(args.skip, args.take))(current.getItems()).at(0);
    if (!found)
        return null;
    return structuredClone((0, helpers_1.pipe)(includes(args, current, delegates), select(args.select))(found));
}
exports.findOne = findOne;
function where(whereArgs = {}, current, delegates) {
    return (item) => (0, match_1.matchMultiple)(item, whereArgs, current, delegates);
}
exports.where = where;
function getOrderedValue(orderedValue) {
    var _a;
    if (typeof orderedValue === 'object') {
        return {
            sortOrder: orderedValue.sort,
            nullOrder: (_a = orderedValue.nulls) !== null && _a !== void 0 ? _a : 'last',
        };
    }
    return {
        sortOrder: orderedValue,
        nullOrder: 'last',
    };
}
function isOrderByRelation(orderedProperties) {
    const orderedProperty = Object.keys(orderedProperties)[0];
    return Object.keys(orderedProperties[orderedProperty]).includes('_count');
}
function calculateOrder(a, b, orderedProperties, current, delegates) {
    for (const orderedProperty in orderedProperties) {
        if (isOrderByRelation(orderedProperties)) {
            const sortOrder = Object.values(orderedProperties[orderedProperty])[0];
            return calculateRelationOrder(a, b, orderedProperty, sortOrder, current, delegates);
        }
        const { nullOrder, sortOrder } = getOrderedValue(orderedProperties[orderedProperty]);
        let weight = 0;
        const weightMultiplier = sortOrder === 'desc' ? -1 : 1;
        const values = [a[orderedProperty], b[orderedProperty]];
        if (values.every((value) => value === null)) {
            return 0;
        }
        else if (values.some((value) => value === null)) {
            if (values[0] === null)
                weight = -1;
            if (values[1] === null)
                weight = 1;
            if (nullOrder === 'last')
                return weight * -1;
            else
                return weight;
        }
        if (typeof values[0] === 'number' && typeof values[1] === 'number') {
            weight = values[0] - values[1];
        }
        if (typeof values[0] === 'string' && typeof values[1] === 'string') {
            weight = values[0].localeCompare(values[1]);
        }
        if (weight !== 0)
            return weight * weightMultiplier;
    }
    return 0;
}
exports.calculateOrder = calculateOrder;
function calculateRelationOrder(a, b, orderedProperty, sortOrder, current, delegates) {
    const schema = current.model.fields.find((field) => field.name === orderedProperty);
    if (!(schema === null || schema === void 0 ? void 0 : schema.relationName))
        return 0;
    const delegate = (0, exports.getDelegateFromField)(schema, delegates);
    const field = (0, exports.getJoinField)(schema, delegates);
    const counts = {
        a: findMany({
            where: (0, exports.getFieldFromRelationshipWhere)(a, field),
        }, delegate, delegates).length,
        b: findMany({
            where: (0, exports.getFieldFromRelationshipWhere)(b, field),
        }, delegate, delegates).length,
    };
    const weightMultiplier = sortOrder === 'desc' ? -1 : 1;
    const weight = counts.a - counts.b;
    if (weight !== 0)
        return weight * weightMultiplier;
    return 0;
}
exports.calculateRelationOrder = calculateRelationOrder;
function order(args, delegate, delegates) {
    return (items) => {
        if (!args.orderBy)
            return items;
        const propertiesToOrderBy = Array.isArray(args.orderBy) ? args.orderBy : [args.orderBy];
        const o = propertiesToOrderBy.reduceRight((accumulator, currentValue) => {
            const acc = accumulator.sort((a, b) => calculateOrder(a, b, currentValue, delegate, delegates));
            return acc;
        }, items);
        return o;
    };
}
exports.order = order;
function paginate(skip, take) {
    return (items) => {
        if (!skip && !take)
            return items;
        return items.slice(skip !== null && skip !== void 0 ? skip : 0, take === undefined ? undefined : take + (skip !== null && skip !== void 0 ? skip : 0));
    };
}
exports.paginate = paginate;
function includes(args, current, delegates) {
    return (item) => {
        var _a;
        if ((!(args === null || args === void 0 ? void 0 : args.include) && !(args === null || args === void 0 ? void 0 : args.select)) || !item)
            return item;
        const newItem = Object.assign({}, item);
        const obj = (_a = args === null || args === void 0 ? void 0 : args.select) !== null && _a !== void 0 ? _a : args.include;
        Object.keys(obj).forEach((key) => {
            const schema = current.model.fields.find((field) => field.name === key);
            if (!(schema === null || schema === void 0 ? void 0 : schema.relationName))
                return;
            const delegate = (0, exports.getDelegateFromField)(schema, delegates);
            let subArgs = obj[key] === true ? {} : obj[key];
            subArgs = Object.assign(Object.assign({}, subArgs), {
                where: Object.assign(Object.assign({}, subArgs.where), (0, exports.getFieldRelationshipWhere)(item, schema, delegates)),
            });
            if (schema.isList) {
                Object.assign(newItem, { [key]: findMany(subArgs, delegate, delegates) });
            }
            else {
                Object.assign(newItem, { [key]: findOne(subArgs, delegate, delegates) });
            }
        });
        return newItem;
    };
}
exports.includes = includes;
function select(selectArgs) {
    return (item) => {
        if (!selectArgs)
            return item;
        return Object.entries(item).reduce((accumulator, [key, value]) => {
            if (selectArgs[key]) {
                accumulator[key] = value;
            }
            return accumulator;
        }, {});
    };
}
exports.select = select;
const getJoinField = (field, delegates) => {
    const joinDelegate = Object.values(delegates).find((delegate) => {
        return delegate.model.name === field.type;
    });
    const joinfield = joinDelegate === null || joinDelegate === void 0 ? void 0 : joinDelegate.model.fields.find((f) => {
        return f.relationName === field.relationName;
    });
    return joinfield;
};
exports.getJoinField = getJoinField;
const getDelegateFromField = (field, delegates) => {
    const delegateName = (0, helpers_1.camelize)(field.type);
    return delegates[delegateName];
};
exports.getDelegateFromField = getDelegateFromField;
const getFieldRelationshipWhere = (item, field, delegates) => {
    var _a;
    if (((_a = field.relationToFields) === null || _a === void 0 ? void 0 : _a.length) === 0) {
        field = (0, exports.getJoinField)(field, delegates);
        return {
            [field.relationFromFields[0]]: item[field.relationToFields[0]],
        };
    }
    return {
        [field.relationToFields[0]]: item[field.relationFromFields[0]],
    };
};
exports.getFieldRelationshipWhere = getFieldRelationshipWhere;
const getFieldFromRelationshipWhere = (item, field) => {
    return {
        [field.relationFromFields[0]]: item[field.relationToFields[0]],
    };
};
exports.getFieldFromRelationshipWhere = getFieldFromRelationshipWhere;
const getFieldToRelationshipWhere = (item, field) => {
    return {
        [field.relationToFields[0]]: item[field.relationFromFields[0]],
    };
};
exports.getFieldToRelationshipWhere = getFieldToRelationshipWhere;
function connect(args, current, delegates) {
    return (items) => {
        return items.reduce((accumulator, currentValue) => {
            const item = (0, helpers_1.pipe)(includes(args, current, delegates), select(args.select))(currentValue);
            return [...accumulator, item];
        }, []);
    };
}
function findMany(args, current, delegates) {
    const found = (0, helpers_1.pipe)((items) => items.filter((item) => where(args.where, current, delegates)(item)), order(args, current, delegates), connect(args, current, delegates), paginate(args.skip, args.take))(current.getItems());
    if (args === null || args === void 0 ? void 0 : args.distinct) {
        const values = {};
        return found.filter((item) => {
            let shouldInclude = true;
            args.distinct.forEach((key) => {
                const vals = values[key] || [];
                if (vals.includes(item[key])) {
                    shouldInclude = false;
                }
                else {
                    vals.push(item[key]);
                    values[key] = vals;
                }
            });
            return shouldInclude;
        });
    }
    return structuredClone(found);
}
exports.findMany = findMany;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmluZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9saWIvb3BlcmF0aW9ucy9maW5kL2ZpbmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBSUEsMkNBQStDO0FBRy9DLG1DQUF3QztBQUV4QyxTQUFnQixpQkFBaUIsQ0FBQyxVQUE4QixFQUFFLFNBQWlCO0lBQ2pGLE1BQU0sT0FBTyxHQUFHLFVBQVUsQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDaEQsTUFBTSxTQUFTLEdBQUcsQ0FBQyxPQUFPLGFBQVAsT0FBTyxjQUFQLE9BQU8sR0FBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7SUFFckMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsU0FBUyxFQUFFLEVBQUUsQ0FBQyxTQUFTLENBQUMsRUFBRSxTQUFTLEVBQUUsQ0FBQyxDQUFDO0lBRWhFLE9BQU8sU0FBUyxDQUFDO0FBQ25CLENBQUM7QUFQRCw4Q0FPQztBQUVELFNBQWdCLE9BQU8sQ0FBQyxJQUFjLEVBQUUsT0FBaUIsRUFBRSxTQUFvQjtJQUM3RSxNQUFNLEtBQUssR0FBRyxJQUFBLGNBQUksRUFDaEIsQ0FBQyxLQUFhLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUN0RixLQUFLLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxTQUFTLENBQUMsRUFDL0IsT0FBTyxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsU0FBUyxDQUFDLEVBQ2pDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FDL0IsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxD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