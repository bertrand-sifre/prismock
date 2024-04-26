"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureArray = exports.unique = exports.compose = exports.pipe = exports.removeUndefined = exports.uuid = exports.omit = exports.pick = exports.shallowCompare = exports.camelize = void 0;
function camelize(str) {
    return str
        .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
        return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
        .replace(/\s+/g, '');
}
exports.camelize = camelize;
function shallowCompare(a, b) {
    for (const key in b) {
        if (a[key] !== b[key])
            return false;
    }
    return true;
}
exports.shallowCompare = shallowCompare;
function pick(obj, keys) {
    return Object.entries(obj).reduce((accumulator, [currentKey, currentValue]) => {
        if (keys.includes(currentKey)) {
            accumulator = Object.assign(Object.assign({}, accumulator), { [currentKey]: currentValue });
        }
        return accumulator;
    }, {});
}
exports.pick = pick;
function omit(obj, keys) {
    return Object.entries(obj).reduce((accumulator, [currentKey, currentValue]) => {
        if (!keys.includes(currentKey)) {
            accumulator = Object.assign(Object.assign({}, accumulator), { [currentKey]: currentValue });
        }
        return accumulator;
    }, {});
}
exports.omit = omit;
function uuid() {
    let dt = new Date().getTime();
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
    return uuid;
}
exports.uuid = uuid;
function removeUndefined(o) {
    return Object.keys(o).reduce((accumulator, currentValue) => {
        if (typeof o[currentValue] !== 'undefined') {
            return Object.assign(Object.assign({}, accumulator), { [currentValue]: o[currentValue] });
        }
        return accumulator;
    }, {});
}
exports.removeUndefined = removeUndefined;
function pipe(...functions) {
    return (value) => {
        return functions.reduce((currentValue, currentFunction) => {
            return currentFunction(currentValue);
        }, value);
    };
}
exports.pipe = pipe;
function compose(...functions) {
    return (value) => {
        return functions.reduceRight((currentValue, currentFunction) => {
            return currentFunction(currentValue);
        }, value);
    };
}
exports.compose = compose;
function unique(value) {
    return Array.from(new Set(value));
}
exports.unique = unique;
function ensureArray(value) {
    return Array.isArray(value) ? value : [value];
}
exports.ensureArray = ensureArray;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVscGVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvaGVscGVycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFQSxTQUFnQixRQUFRLENBQUMsR0FBVztJQUNsQyxPQUFPLEdBQUc7U0FDUCxPQUFPLENBQUMscUJBQXFCLEVBQUUsVUFBVSxJQUFJLEVBQUUsS0FBSztRQUNuRCxPQUFPLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQy9ELENBQUMsQ0FBQztTQUNELE9BQU8sQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDekIsQ0FBQztBQU5ELDRCQU1DO0FBRUQsU0FBZ0IsY0FBYyxDQUFDLENBQU8sRUFBRSxDQUFPO0lBQzdDLEtBQUssTUFBTSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUM7UUFDcEIsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQztZQUFFLE9BQU8sS0FBSyxDQUFDO0lBQ3RDLENBQUM7SUFDRCxPQUFPLElBQUksQ0FBQztBQUNkLENBQUM7QUFMRCx3Q0FLQztBQUVELFNBQWdCLElBQUksQ0FBQyxHQUE0QixFQUFFLElBQWM7SUFDL0QsT0FBTyxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLFVBQVUsRUFBRSxZQUFZLENBQUMsRUFBRSxFQUFFO1FBQzVFLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDO1lBQzlCLFdBQVcsbUNBQVEsV0FBVyxLQUFFLENBQUMsVUFBVSxDQUFDLEVBQUUsWUFBWSxHQUFFLENBQUM7UUFDL0QsQ0FBQztRQUNELE9BQU8sV0FBVyxDQUFDO0lBQ3JCLENBQUMsRUFBRSxFQUFFLENB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