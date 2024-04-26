import { camelize, shallowCompare } from '../../helpers';
import { getFieldRelationshipWhere } from './find';
function formatValueWithMode(baseValue, filter, info) {
    const format = 'mode' in filter
        ? (baseValue) => (typeof baseValue === 'string' ? baseValue.toLocaleLowerCase() : baseValue)
        : (v) => v;
    if (info?.type === 'DateTime' && typeof baseValue === 'string') {
        return new Date(baseValue);
    }
    if (info?.type === 'BigInt' && typeof baseValue === 'number') {
        return BigInt(baseValue);
    }
    return format(baseValue);
}
export const matchMultiple = (item, where, current, delegates) => {
    const matchAnd = (item, where) => {
        return where.filter((child) => matchMultiple(item, child, current, delegates)).length === where.length;
    };
    const matchOr = (item, where) => {
        return where.some((child) => matchMultiple(item, child, current, delegates));
    };
    const matchFnc = (where, delegate = current) => (item) => {
        if (where) {
            return matchMultiple(item, where, delegate, delegates);
        }
        return true;
    };
    function match(child, item, where) {
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
                if (info?.relationName) {
                    const childName = camelize(info.type);
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
                    const res = delegates[childName].getItems().filter(matchFnc(Object.assign(Object.assign({}, childWhere), getFieldRelationshipWhere(item, info, delegates)), delegates[childName]));
                    if (filter.every) {
                        if (res.length === 0)
                            return false;
                        const all = delegates[childName].getItems().filter(matchFnc(getFieldRelationshipWhere(item, info, delegates)));
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
                const compositeIndex = current.model.uniqueIndexes.map((index) => index.name).includes(child) || current.model.primaryKey?.name === child;
                if (compositeIndex) {
                    return matchMultiple(item, where[child], current, delegates);
                }
                const idFields = current.model.fields.map((field) => field.isId);
                if (idFields?.length > 1) {
                    if (child === idFields.join('_')) {
                        return shallowCompare(item, filter);
                    }
                }
                if (current.model.uniqueFields.length > 0) {
                    for (const uniqueField of current.model.uniqueFields) {
                        if (child === uniqueField.join('_')) {
                            return shallowCompare(item, filter);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF0Y2guanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbGliL29wZXJhdGlvbnMvZmluZC9tYXRjaC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFJQSxPQUFPLEVBQUUsUUFBUSxFQUFFLGNBQWMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUl6RCxPQUFPLEVBQUUseUJBQXlCLEVBQUUsTUFBTSxRQUFRLENBQUM7QUFFbkQsU0FBUyxtQkFBbUIsQ0FBSSxTQUFZLEVBQUUsTUFBd0MsRUFBRSxJQUF3QjtJQUM5RyxNQUFNLE1BQU0sR0FDVixNQUFNLElBQUksTUFBTTtRQUNkLENBQUMsQ0FBQyxDQUFJLFNBQVksRUFBRSxFQUFFLENBQUMsQ0FBQyxPQUFPLFNBQVMsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFFLFNBQVMsQ0FBQyxpQkFBaUIsRUFBUSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7UUFDekcsQ0FBQyxDQUFDLENBQUksQ0FBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDckIsSUFBSSxJQUFJLEVBQUUsSUFBSSxLQUFLLFVBQVUsSUFBSSxPQUFPLFNBQVMsS0FBSyxRQUFRLEVBQUUsQ0FBQztRQUMvRCxPQUFPLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFDRCxJQUFJLElBQUksRUFBRSxJQUFJLEtBQUssUUFBUSxJQUFJLE9BQU8sU0FBUyxLQUFLLFFBQVEsRUFBRSxDQUFDO1FBQzdELE9BQU8sTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzNCLENBQUM7SUFDRCxPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUMzQixDQUFDO0FBRUQsTUFBTSxDQUFDLE1BQU0sYUFBYSxHQUFHLENBQUMsSUFBVSxFQUFFLEtBQW9CLEVBQUUsT0FBaUIsRUFBRSxTQUFvQixFQUFFLEVBQUU7SUFDekcsTUFBTSxRQUFRLEdBQUcsQ0FBQyxJQUE2QixFQUFFLEtBQXNC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