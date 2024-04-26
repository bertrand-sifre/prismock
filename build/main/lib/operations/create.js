"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = exports.nestedCreate = exports.connectOrCreate = exports.createDefaultValues = exports.calculateDefaultFieldValue = exports.isAutoIncrement = void 0;
const library_1 = require("@prisma/client/runtime/library");
const bson_1 = require("bson");
const cuid2_1 = require("@paralleldrive/cuid2");
const helpers_1 = require("../helpers");
const find_1 = require("./find");
const isAutoIncrement = (field) => {
    var _a;
    return ((_a = field.default) === null || _a === void 0 ? void 0 : _a.name) === 'autoincrement';
};
exports.isAutoIncrement = isAutoIncrement;
const defaultFieldhandlers = [
    [
        exports.isAutoIncrement,
        (properties, field) => {
            return (0, find_1.findNextIncrement)(properties, field.name);
        },
    ],
    [
        (field) => { var _a; return ((_a = field.default) === null || _a === void 0 ? void 0 : _a.name) === 'now'; },
        () => {
            return new Date();
        },
    ],
    [
        (field) => { var _a; return ((_a = field.default) === null || _a === void 0 ? void 0 : _a.name) === 'uuid'; },
        () => {
            return (0, helpers_1.uuid)();
        },
    ],
    [
        (field) => { var _a; return ((_a = field.default) === null || _a === void 0 ? void 0 : _a.name) === 'auto'; },
        () => {
            return new bson_1.ObjectId().toString();
        },
    ],
    [
        (field) => { var _a; return ((_a = field.default) === null || _a === void 0 ? void 0 : _a.name) === 'cuid'; },
        () => {
            return (0, cuid2_1.createId)();
        },
    ],
];
function calculateDefaultFieldValue(field, properties) {
    if (typeof field.default === 'object') {
        const handler = defaultFieldhandlers.find(([check]) => check(field));
        if (handler)
            return handler[1](properties, field);
    }
    if (field.type === 'BigInt' && typeof field.default === 'string')
        return BigInt(field.default);
    if (field.type === 'Json' && typeof field.default === 'string')
        return JSON.parse(field.default);
    if (field.type === 'Decimal' && typeof field.default === 'number')
        return new library_1.Decimal(field.default);
    if (['string', 'number', 'boolean'].includes(typeof field.default))
        return field.default;
    return undefined;
}
exports.calculateDefaultFieldValue = calculateDefaultFieldValue;
function createDefaultValues(fields, properties) {
    return fields.reduce((defaultValues, currentField) => {
        if (currentField.hasDefaultValue === true) {
            const defaultValue = calculateDefaultFieldValue(currentField, properties);
            if (defaultValue !== undefined)
                defaultValues[currentField.name] = defaultValue;
        }
        else if (currentField.kind !== 'object') {
            defaultValues[currentField.name] = null;
        }
        return defaultValues;
    }, {});
}
exports.createDefaultValues = createDefaultValues;
function connectOrCreate(delegate, delegates) {
    return (item) => {
        return Object.entries(item).reduce((accumulator, [key, value]) => {
            if (typeof value === 'object' && (value === null || value === void 0 ? void 0 : value.connectOrCreate)) {
                const connectOrCreate = value.connectOrCreate;
                const field = delegate.model.fields.find((field) => field.name === key);
                const subDelegate = (0, find_1.getDelegateFromField)(field, delegates);
                let connected = (0, find_1.findOne)({ where: connectOrCreate.where }, subDelegate, delegates);
                if (!connected)
                    connected = create(connectOrCreate.create, {}, subDelegate, delegates, subDelegate.onChange);
                return Object.assign(Object.assign({}, accumulator), (0, find_1.getFieldFromRelationshipWhere)(connected, field));
            }
            if (typeof value === 'object' && (value === null || value === void 0 ? void 0 : value.connect)) {
                const connect = value.connect;
                const field = delegate.model.fields.find((field) => field.name === key);
                const joinField = (0, find_1.getJoinField)(field, delegates);
                const subDelegate = (0, find_1.getDelegateFromField)(field, delegates);
                if (Array.isArray(connect)) {
                    connect.forEach((c) => {
                        subDelegate.update({
                            where: c,
                            data: (0, find_1.getFieldFromRelationshipWhere)(accumulator, joinField),
                        });
                    });
                }
                else {
                    if (field.relationFromFields.length > 0) {
                        const connected = (0, find_1.findOne)({ where: connect }, subDelegate, delegates);
                        if (connected) {
                            return Object.assign(Object.assign({}, accumulator), (0, find_1.getFieldFromRelationshipWhere)(connected, field));
                        }
                    }
                    else {
                        subDelegate.update({
                            where: connect,
                            data: Object.assign({}, (0, find_1.getFieldFromRelationshipWhere)(accumulator, joinField)),
                        });
                    }
                }
                return accumulator;
            }
            return Object.assign(Object.assign({}, accumulator), { [key]: value });
        }, {});
    };
}
exports.connectOrCreate = connectOrCreate;
function nestedCreate(current, delegates) {
    return (item) => {
        const created = Object.assign(Object.assign({}, createDefaultValues(current.model.fields, current.getProperties())), (0, helpers_1.removeUndefined)(item));
        current.model.fields.forEach((field) => {
            const value = created[field.name];
            if (value) {
                const joinfield = (0, find_1.getJoinField)(field, delegates);
                if (joinfield) {
                    const delegate = (0, find_1.getDelegateFromField)(field, delegates);
                    const connect = (0, find_1.getFieldFromRelationshipWhere)(created, joinfield);
                    if (value.create) {
                        delete created[field.name];
                        const data = value.create;
                        if (Array.isArray(data)) {
                            data.forEach((item) => {
                                create(Object.assign(Object.assign({}, item), connect), {}, delegate, delegates, delegate.onChange);
                            });
                        }
                        else {
                            const nestedCreated = create(Object.assign(Object.assign({}, data), connect), {}, delegate, delegates, delegate.onChange);
                            Object.assign(created, (0, find_1.getFieldFromRelationshipWhere)(nestedCreated, field));
                        }
                    }
                    if (value.createMany) {
                        delete created[field.name];
                        const { data } = value.createMany;
                        data.forEach((d) => {
                            create(Object.assign(Object.assign({}, d), connect), {}, delegate, delegates, delegate.onChange);
                        });
                    }
                }
            }
        });
        return created;
    };
}
exports.nestedCreate = nestedCreate;
function create(item, options, delegate, delegates, onChange) {
    const formated = (0, helpers_1.pipe)(nestedCreate(delegate, delegates), connectOrCreate(delegate, delegates))(item);
    const created = (0, helpers_1.pipe)((0, find_1.includes)(options, delegate, delegates), (0, find_1.select)(options.select))(formated);
    onChange([...delegate.getItems(), formated]);
    return created;
}
exports.create = create;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpYi9vcGVyYXRpb25zL2NyZWF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw0REFBeUQ7QUFFekQsK0JBQWdDO0FBQ2hDLGdEQUE4RDtBQUc5RCx3Q0FBeUQ7QUFJekQsaUNBUWdCO0FBRVQsTUFBTSxlQUFlLEdBQUcsQ0FBQyxLQUFpQixFQUFFLEVBQUU7O0lBQ25ELE9BQU8sQ0FBQSxNQUFDLEtBQUssQ0FBQyxPQUE2QiwwQ0FBRSxJQUFJLE1BQUssZUFBZSxDQUFDO0FBQ3hFLENBQUMsQ0FBQztBQUZXLFFBQUEsZUFBZSxtQkFFMUI7QUFFRixNQUFNLG9CQUFvQixHQUdwQjtJQUNKO1FBQ0UsdUJBQWU7UUFDZixDQUFDLFVBQThCLEVBQUUsS0FBaUIsRUFBRSxFQUFFO1lBQ3BELE9BQU8sSUFBQSx3QkFBaUIsRUFBQyxVQUFVLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ25ELENBQUM7S0FDRjtJQUNEO1FBQ0UsQ0FBQyxLQUFpQixFQUFFLEVBQUUsV0FBQyxPQUFBLENBQUEsTUFBQyxLQUFLLENBQUMsT0FBNkIsMENBQUUsSUFBSSxNQUFLLEtBQUssQ0FBQSxFQUFBO1FBQzNFLEdBQUcsRUFBRTtZQUNILE9BQU8sSUFBSSxJQUFJLEVBQUUsQ0FBQztRQUNwQixDQUFDO0tBQ0Y7SUFDRDtRQUNFLENBQUMsS0FBaUIsRUFBRSxFQUFFLFdBQUMsT0FBQSxDQUFBLE1BQUMsS0FBSyxDQUFDLE9BQTZCLDBDQUFFLElBQUksTUFBSyxNQUFNLENBQUEsRUFBQTtRQUM1RSxHQUFHLEVBQUU7WUFDSCxPQUFPLElBQUEsY0FBSSxHQUFFLENBQUM7UUFDaEIsQ0FBQztLQUNGO0lBQ0Q7UUFDRSxDQUFDLEtBQWlCLEVBQUUsRUFBRSxXQUFDLE9BQUEsQ0FBQSxNQUFDLEtBQUssQ0FBQyxPQUE2QiwwQ0FBRSxJQUFJLE1BQUssTUFBTSxD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