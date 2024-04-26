"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMany = void 0;
const helpers_1 = require("../helpers");
const create_1 = require("./create");
const find_1 = require("./find");
const update = (args, isCreating, item, current, delegates) => {
    const { data } = args;
    current.model.fields.forEach((field) => {
        var _a, _b, _c;
        if (data[field.name]) {
            const fieldData = data[field.name];
            if (field.kind === 'object') {
                if (fieldData.connect) {
                    const connected = data[field.name];
                    delete data[field.name];
                    const delegate = delegates[(0, helpers_1.camelize)(field.type)];
                    const joinfield = (0, find_1.getJoinField)(field, delegates);
                    const joinValue = connected.connect[joinfield.relationToFields[0]];
                    // @TODO: what's happening if we try to udate on an Item that doesn't exist?
                    if (!joinfield.isList) {
                        const joined = (0, find_1.findOne)({ where: args.where }, (0, find_1.getDelegateFromField)(joinfield, delegates), delegates);
                        delegate.updateMany({
                            where: { [joinfield.relationToFields[0]]: joinValue },
                            data: (0, find_1.getFieldFromRelationshipWhere)(joined, joinfield),
                        });
                    }
                    else {
                        const joined = (0, find_1.findOne)({ where: connected.connect }, (0, find_1.getDelegateFromField)(field, delegates), delegates);
                        Object.assign(data, (0, find_1.getFieldFromRelationshipWhere)(joined, field));
                    }
                }
                if (fieldData.connectOrCreate) {
                    delete data[field.name];
                    const delegate = (0, find_1.getDelegateFromField)(field, delegates);
                    (0, create_1.connectOrCreate)(current, delegates)({ [(0, helpers_1.camelize)(field.name)]: fieldData });
                    const joined = (0, find_1.findOne)({ where: fieldData.connectOrCreate.where }, delegate, delegates);
                    Object.assign(data, (0, find_1.getFieldFromRelationshipWhere)(joined, field));
                }
                if (fieldData.create || fieldData.createMany) {
                    const toCreate = data[field.name];
                    delete data[field.name];
                    const delegate = (0, find_1.getDelegateFromField)(field, delegates);
                    const joinfield = (0, find_1.getJoinField)(field, delegates);
                    if ((_a = field.relationFromFields) === null || _a === void 0 ? void 0 : _a[0]) {
                        delegate.create(data[field.name].create);
                        Object.assign(data, (0, find_1.getFieldFromRelationshipWhere)(item, field));
                    }
                    else {
                        const formatCreatedItem = (val) => {
                            return Object.assign(Object.assign({}, val), { [joinfield.name]: {
                                    connect: joinfield.relationToFields.reduce((prev, cur) => {
                                        var _a;
                                        let val = data[cur];
                                        if (!isCreating && !val) {
                                            val = (_a = (0, find_1.findOne)(args, delegates[(0, helpers_1.camelize)(joinfield.type)], delegates)) === null || _a === void 0 ? void 0 : _a[cur];
                                        }
                                        return Object.assign(Object.assign({}, prev), { [cur]: val });
                                    }, {}),
                                } });
                        };
                        if (fieldData.createMany) {
                            fieldData.createMany.data
                                .map(formatCreatedItem)
                                .forEach((createSingle) => delegate.create({ data: createSingle }));
                        }
                        else {
                            if (Array.isArray(fieldData.create)) {
                                fieldData.createMany
                                    .map(formatCreatedItem)
                                    .forEach((createSingle) => delegate.create({ data: createSingle }));
                            }
                            else {
                                const createData = Object.assign({}, toCreate.create);
                                const mapped = formatCreatedItem(toCreate.create)[joinfield.name].connect;
                                if (joinfield) {
                                    Object.assign(createData, (0, find_1.getFieldFromRelationshipWhere)(mapped, joinfield));
                                }
                                delegate.create({ data: createData });
                            }
                        }
                    }
                }
                if (fieldData.update || fieldData.updateMany) {
                    const joinfield = (0, find_1.getJoinField)(field, delegates);
                    const where = {};
                    if (joinfield) {
                        Object.assign(where, (0, find_1.getFieldFromRelationshipWhere)(args.where, joinfield));
                    }
                    delete data[field.name];
                    const delegate = delegates[(0, helpers_1.camelize)(field.type)];
                    if (fieldData.updateMany) {
                        Object.assign(where, fieldData.updateMany.where);
                        if (Array.isArray(fieldData.updateMany)) {
                            fieldData.updateMany.forEach((toUpdateMany) => {
                                var _a;
                                delegate.updateMany({ where, data: (_a = toUpdateMany.data) !== null && _a !== void 0 ? _a : toUpdateMany });
                            });
                        }
                        else {
                            delegate.updateMany({ where, data: (_b = fieldData.updateMany.data) !== null && _b !== void 0 ? _b : fieldData.updateMany });
                        }
                    }
                    else {
                        const joinfield = (0, find_1.getJoinField)(field, delegates);
                        Object.assign(where, fieldData.update.where);
                        if (Array.isArray(fieldData.update)) {
                            fieldData.update.forEach((toUpdate) => {
                                var _a;
                                delegate.updateMany({ where, data: (_a = toUpdate.data) !== null && _a !== void 0 ? _a : toUpdate });
                            });
                        }
                        else {
                            const item = (0, find_1.findOne)(args, delegates[(0, helpers_1.camelize)(joinfield.type)], delegates);
                            delegate.updateMany({
                                where: (0, find_1.getFieldRelationshipWhere)(item, field, delegates),
                                data: (_c = fieldData.update.data) !== null && _c !== void 0 ? _c : fieldData.update,
                            });
                        }
                    }
                }
                if (fieldData.upsert) {
                    const upsert = fieldData.upsert;
                    delete data[field.name];
                    const subDelegate = delegates[(0, helpers_1.camelize)(field.type)];
                    const item = (0, find_1.findOne)({ where: args.where }, current, delegates);
                    if (item) {
                        const joinWhere = (0, find_1.getFieldRelationshipWhere)(item, field, delegates);
                        const joined = Object.values(joinWhere)[0] ? (0, find_1.findOne)({ where: joinWhere }, subDelegate, delegates) : null;
                        if (joined) {
                            updateMany({ where: joinWhere, data: upsert.update }, subDelegate, delegates, subDelegate.onChange);
                        }
                        else {
                            const created = (0, create_1.create)(upsert.create, {}, subDelegate, delegates, subDelegate.onChange);
                            Object.assign(data, (0, find_1.getFieldFromRelationshipWhere)(created, field));
                        }
                    }
                }
            }
            if (fieldData.increment) {
                Object.assign(data, { [field.name]: item[field.name] + fieldData.increment });
            }
            if (fieldData.decrement) {
                Object.assign(data, { [field.name]: item[field.name] - fieldData.decrement });
            }
            if (fieldData.multiply) {
                Object.assign(data, { [field.name]: item[field.name] * fieldData.multiply });
            }
            if (fieldData.divide) {
                Object.assign(data, { [field.name]: item[field.name] / fieldData.divide });
            }
            if (fieldData.set) {
                Object.assign(data, { [field.name]: fieldData.set });
            }
        }
        if ((isCreating || data[field.name] === null) && (data[field.name] === null || data[field.name] === undefined)) {
            if (field.hasDefaultValue) {
                const defaultValue = (0, create_1.calculateDefaultFieldValue)(field, current.getProperties());
                if (defaultValue !== undefined && !data[field.name])
                    Object.assign(data, { [field.name]: defaultValue });
            }
            else if (field.kind !== 'object')
                Object.assign(data, Object.assign(data, { [field.name]: null }));
        }
    });
    return data;
};
function updateMany(args, current, delegates, onChange) {
    const { toUpdate, updated } = current.getItems().reduce((accumulator, currentValue) => {
        const shouldUpdate = (0, find_1.where)(args.where, current, delegates)(currentValue);
        if (shouldUpdate) {
            const baseValue = Object.assign(Object.assign({}, currentValue), (0, helpers_1.removeUndefined)(update(args, false, currentValue, current, delegates)));
            const updated = (0, helpers_1.pipe)((0, find_1.includes)(args, current, delegates), (0, find_1.select)(args.select))(baseValue);
            return {
                toUpdate: [...accumulator.toUpdate, updated],
                updated: [...accumulator.updated, baseValue],
            };
        }
        return {
            toUpdate: accumulator.toUpdate,
            updated: [...accumulator.updated, currentValue],
        };
    }, { toUpdate: [], updated: [] });
    onChange(updated);
    return toUpdate;
}
exports.updateMany = updateMany;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBkYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpYi9vcGVyYXRpb25zL3VwZGF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSx3Q0FBNkQ7QUFJN0QscUNBQStFO0FBQy9FLGlDQVNnQjtBQWNoQixNQUFNLE1BQU0sR0FBRyxDQUFDLElBQWdCLEVBQUUsVUFBbUIsRUFBRSxJQUFVLEVBQUUsT0FBaUIsRUFBRSxTQUFvQixFQUFFLEVBQUU7SUFDNUcsTUFBTSxFQUFFLElBQUksRUFBRSxHQUFRLElBQUksQ0FBQztJQUUzQixPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRTs7UUFDckMsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7WUFDckIsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUVuQyxJQUFJLEtBQUssQ0FBQyxJQUFJLEtBQUssUUFBUSxFQUFFLENBQUM7Z0JBQzVCLElBQUksU0FBUyxDQUFDLE9BQU8sRUFBRSxDQUFDO29CQUN0QixNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUNuQyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBRXhCLE1BQU0sUUFBUSxHQUFHLFNBQVMsQ0FBQyxJQUFBLGtCQUFRLEVBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7b0JBQ2pELE1BQU0sU0FBUyxHQUFHLElBQUEsbUJBQVksRUFBQyxLQUFLLEVBQUUsU0FBUyxDQUFFLENBQUM7b0JBQ2xELE1BQU0sU0FBUyxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLGdCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBRXBFLDRFQUE0RTtvQkFDNUUs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