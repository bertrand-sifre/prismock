"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchMultiple = void 0;
const helpers_1 = require("../../helpers");
const find_1 = require("./find");
function formatValueWithMode(baseValue, filter, info) {
    const format = 'mode' in filter
        ? (baseValue) => (typeof baseValue === 'string' ? baseValue.toLocaleLowerCase() : baseValue)
        : (v) => v;
    if ((info === null || info === void 0 ? void 0 : info.type) === 'DateTime' && typeof baseValue === 'string') {
        return new Date(baseValue);
    }
    if ((info === null || info === void 0 ? void 0 : info.type) === 'BigInt' && typeof baseValue === 'number') {
        return BigInt(baseValue);
    }
    return format(baseValue);
}
const matchMultiple = (item, where, current, delegates) => {
    const matchAnd = (item, where) => {
        return where.filter((child) => (0, exports.matchMultiple)(item, child, current, delegates)).length === where.length;
    };
    const matchOr = (item, where) => {
        return where.some((child) => (0, exports.matchMultiple)(item, child, current, delegates));
    };
    const matchFnc = (where, delegate = current) => (item) => {
        if (where) {
            return (0, exports.matchMultiple)(item, where, delegate, delegates);
        }
        return true;
    };
    function match(child, item, where) {
        var _a;
        let val = item[child];
        const filter = where[child];
        if (child === 'OR')
            return matchOr(item, filter);
        if (child === 'AND')
            return matchAnd(item, filter);
        if (child === 'NOT')
            return !matchOr(item, filter instanceof Array ? filter : [filter]);
        if (child === 'is') {
            if (typeof filter === 'object') {
                return matchFnc(filter)(item);
            }
            return false;
        }
        if (filter == null || filter === undefined) {
            if (filter === null)
                return val === null || val === undefined;
            return true;
        }
        // Support querying fields with bigint in query.
        if (typeof filter === 'bigint') {
            if (filter === BigInt(val)) {
                return true;
            }
        }
        if (filter instanceof Date) {
            if (val === undefined) {
                return false;
            }
            if (!(val instanceof Date) || val.getTime() !== filter.getTime()) {
                return false;
            }
        }
        else {
            if (typeof filter === 'object') {
                const info = current.model.fields.find((field) => field.name === child);
                val = formatValueWithMode(val, filter, info);
                if (info === null || info === void 0 ? void 0 : info.relationName) {
                    const childName = (0, helpers_1.camelize)(info.type);
                    let childWhere = {};
                    if (filter.every) {
                        childWhere = filter.every;
                    }
                    else if (filter.some) {
                        childWhere = filter.some;
                    }
                    else if (filter.none) {
                        childWhere = filter.none;
                    }
                    else {
                        childWhere = filter;
                    }
                    const res = delegates[childName].getItems().filter(matchFnc(Object.assign(Object.assign({}, childWhere), (0, find_1.getFieldRelationshipWhere)(item, info, delegates)), delegates[childName]));
                    if (filter.every) {
                        if (res.length === 0)
                            return false;
                        const all = delegates[childName].getItems().filter(matchFnc((0, find_1.getFieldRelationshipWhere)(item, info, delegates)));
                        return res.length === all.length;
                    }
                    else if (filter.some) {
                        return res.length > 0;
                    }
                    else if (filter.is === null) {
                        return res.length === 0;
                    }
                    else if (filter.none) {
                        return res.length === 0;
                    }
                    return res.length > 0;
                }
                const compositeIndex = current.model.uniqueIndexes.map((index) => index.name).includes(child) || ((_a = current.model.primaryKey) === null || _a === void 0 ? void 0 : _a.name) === child;
                if (compositeIndex) {
                    return (0, exports.matchMultiple)(item, where[child], current, delegates);
                }
                const idFields = current.model.fields.map((field) => field.isId);
                if ((idFields === null || idFields === void 0 ? void 0 : idFields.length) > 1) {
                    if (child === idFields.join('_')) {
                        return (0, helpers_1.shallowCompare)(item, filter);
                    }
                }
                if (current.model.uniqueFields.length > 0) {
                    for (const uniqueField of current.model.uniqueFields) {
                        if (child === uniqueField.join('_')) {
                            return (0, helpers_1.shallowCompare)(item, filter);
                        }
                    }
                }
                if (val === undefined)
                    return false;
                let match = true;
                if ('equals' in filter && match) {
                    match = formatValueWithMode(filter.equals, filter, info) === val;
                }
                if ('startsWith' in filter && match) {
                    match = val.indexOf(formatValueWithMode(filter.startsWith, filter, info)) === 0;
                }
                if ('endsWith' in filter && match) {
                    match =
                        val.indexOf(formatValueWithMode(filter.endsWith, filter, info)) === val.length - filter.endsWith.length;
                }
                if ('contains' in filter && match) {
                    match = val.indexOf(formatValueWithMode(filter.contains, filter, info)) > -1;
                }
                if ('gt' in filter && match) {
                    match = val > formatValueWithMode(filter.gt, filter, info);
                }
                if ('gte' in filter && match) {
                    match = val >= formatValueWithMode(filter.gte, filter, info);
                }
                if ('lt' in filter && match) {
                    match = val !== null && val < formatValueWithMode(filter.lt, filter, info);
                }
                if ('lte' in filter && match) {
                    match = val !== null && val <= formatValueWithMode(filter.lte, filter, info);
                }
                if ('in' in filter && match) {
                    match = filter.in.map((inEntry) => formatValueWithMode(inEntry, filter, info)).includes(val);
                }
                if ('not' in filter && match) {
                    match = val !== formatValueWithMode(filter.not, filter);
                }
                if ('notIn' in filter && match) {
                    match = !filter.notIn.map((notInEntry) => formatValueWithMode(notInEntry, filter, info)).includes(val);
                }
                if (!match)
                    return false;
            }
            else if (val !== filter) {
                return false;
            }
        }
        return true;
    }
    for (const child in where) {
        if (!match(child, item, where)) {
            return false;
        }
    }
    return true;
};
exports.matchMultiple = matchMultiple;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF0Y2guanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbGliL29wZXJhdGlvbnMvZmluZC9tYXRjaC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFJQSwyQ0FBeUQ7QUFJekQsaUNBQW1EO0FBRW5ELFNBQVMsbUJBQW1CLENBQUksU0FBWSxFQUFFLE1BQXdDLEVBQUUsSUFBd0I7SUFDOUcsTUFBTSxNQUFNLEdBQ1YsTUFBTSxJQUFJLE1BQU07UUFDZCxDQUFDLENBQUMsQ0FBSSxTQUFZLEVBQUUsRUFBRSxDQUFDLENBQUMsT0FBTyxTQUFTLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBRSxTQUFTLENBQUMsaUJBQWlCLEVBQVEsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO1FBQ3pHLENBQUMsQ0FBQyxDQUFJLENBQUksRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ3JCLElBQUksQ0FBQSxJQUFJLGFBQUosSUFBSSx1QkFBSixJQUFJLENBQUUsSUFBSSxNQUFLLFVBQVUsSUFBSSxPQUFPLFNBQVMsS0FBSyxRQUFRLEVBQUUsQ0FBQztRQUMvRCxPQUFPLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFDRCxJQUFJLENBQUEsSUFBSSxhQUFKLElBQUksdUJBQUosSUFBSSxDQUFFLElBQUksTUFBSyxRQUFRLElBQUksT0FBTyxTQUFTLEtBQUssUUFBUSxFQUFFLENBQUM7UUFDN0QsT0FBTyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDM0IsQ0FBQztJQUNELE9BQU8sTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQzNCLENBQUM7QUFFTSxNQUFNLGFBQWEsR0FBRyxDQUFDLElBQVUsRUFBRSxLQUFvQixFQUFFLE9BQWlCLEVBQUUsU0FBb0IsRUFBRSxFQUFFO0lBQ3pHLE1BQU0sUUFBUSxHQUFHLENBQUMsSUFBNkIsRUFBRSxLQUFzQixFQUFFLEVBQUU7UUFDekUsT0FBTyxL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