import { camelize, pipe, removeUndefined } from '../helpers';
import { calculateDefaultFieldValue, connectOrCreate, create } from './create';
import { findOne, getDelegateFromField, getFieldFromRelationshipWhere, getFieldRelationshipWhere, getJoinField, includes, select, where, } from './find';
const update = (args, isCreating, item, current, delegates) => {
    const { data } = args;
    current.model.fields.forEach((field) => {
        if (data[field.name]) {
            const fieldData = data[field.name];
            if (field.kind === 'object') {
                if (fieldData.connect) {
                    const connected = data[field.name];
                    delete data[field.name];
                    const delegate = delegates[camelize(field.type)];
                    const joinfield = getJoinField(field, delegates);
                    const joinValue = connected.connect[joinfield.relationToFields[0]];
                    // @TODO: what's happening if we try to udate on an Item that doesn't exist?
                    if (!joinfield.isList) {
                        const joined = findOne({ where: args.where }, getDelegateFromField(joinfield, delegates), delegates);
                        delegate.updateMany({
                            where: { [joinfield.relationToFields[0]]: joinValue },
                            data: getFieldFromRelationshipWhere(joined, joinfield),
                        });
                    }
                    else {
                        const joined = findOne({ where: connected.connect }, getDelegateFromField(field, delegates), delegates);
                        Object.assign(data, getFieldFromRelationshipWhere(joined, field));
                    }
                }
                if (fieldData.connectOrCreate) {
                    delete data[field.name];
                    const delegate = getDelegateFromField(field, delegates);
                    connectOrCreate(current, delegates)({ [camelize(field.name)]: fieldData });
                    const joined = findOne({ where: fieldData.connectOrCreate.where }, delegate, delegates);
                    Object.assign(data, getFieldFromRelationshipWhere(joined, field));
                }
                if (fieldData.create || fieldData.createMany) {
                    const toCreate = data[field.name];
                    delete data[field.name];
                    const delegate = getDelegateFromField(field, delegates);
                    const joinfield = getJoinField(field, delegates);
                    if (field.relationFromFields?.[0]) {
                        delegate.create(data[field.name].create);
                        Object.assign(data, getFieldFromRelationshipWhere(item, field));
                    }
                    else {
                        const formatCreatedItem = (val) => {
                            return {
                                ...val,
                                [joinfield.name]: {
                                    connect: joinfield.relationToFields.reduce((prev, cur) => {
                                        let val = data[cur];
                                        if (!isCreating && !val) {
                                            val = findOne(args, delegates[camelize(joinfield.type)], delegates)?.[cur];
                                        }
                                        return { ...prev, [cur]: val };
                                    }, {}),
                                },
                            };
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
                                const createData = { ...toCreate.create };
                                const mapped = formatCreatedItem(toCreate.create)[joinfield.name].connect;
                                if (joinfield) {
                                    Object.assign(createData, getFieldFromRelationshipWhere(mapped, joinfield));
                                }
                                delegate.create({ data: createData });
                            }
                        }
                    }
                }
                if (fieldData.update || fieldData.updateMany) {
                    const joinfield = getJoinField(field, delegates);
                    const where = {};
                    if (joinfield) {
                        Object.assign(where, getFieldFromRelationshipWhere(args.where, joinfield));
                    }
                    delete data[field.name];
                    const delegate = delegates[camelize(field.type)];
                    if (fieldData.updateMany) {
                        Object.assign(where, fieldData.updateMany.where);
                        if (Array.isArray(fieldData.updateMany)) {
                            fieldData.updateMany.forEach((toUpdateMany) => {
                                delegate.updateMany({ where, data: toUpdateMany.data ?? toUpdateMany });
                            });
                        }
                        else {
                            delegate.updateMany({ where, data: fieldData.updateMany.data ?? fieldData.updateMany });
                        }
                    }
                    else {
                        const joinfield = getJoinField(field, delegates);
                        Object.assign(where, fieldData.update.where);
                        if (Array.isArray(fieldData.update)) {
                            fieldData.update.forEach((toUpdate) => {
                                delegate.updateMany({ where, data: toUpdate.data ?? toUpdate });
                            });
                        }
                        else {
                            const item = findOne(args, delegates[camelize(joinfield.type)], delegates);
                            delegate.updateMany({
                                where: getFieldRelationshipWhere(item, field, delegates),
                                data: fieldData.update.data ?? fieldData.update,
                            });
                        }
                    }
                }
                if (fieldData.upsert) {
                    const upsert = fieldData.upsert;
                    delete data[field.name];
                    const subDelegate = delegates[camelize(field.type)];
                    const item = findOne({ where: args.where }, current, delegates);
                    if (item) {
                        const joinWhere = getFieldRelationshipWhere(item, field, delegates);
                        const joined = Object.values(joinWhere)[0] ? findOne({ where: joinWhere }, subDelegate, delegates) : null;
                        if (joined) {
                            updateMany({ where: joinWhere, data: upsert.update }, subDelegate, delegates, subDelegate.onChange);
                        }
                        else {
                            const created = create(upsert.create, {}, subDelegate, delegates, subDelegate.onChange);
                            Object.assign(data, getFieldFromRelationshipWhere(created, field));
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
                const defaultValue = calculateDefaultFieldValue(field, current.getProperties());
                if (defaultValue !== undefined && !data[field.name])
                    Object.assign(data, { [field.name]: defaultValue });
            }
            else if (field.kind !== 'object')
                Object.assign(data, Object.assign(data, { [field.name]: null }));
        }
    });
    return data;
};
export function updateMany(args, current, delegates, onChange) {
    const { toUpdate, updated } = current.getItems().reduce((accumulator, currentValue) => {
        const shouldUpdate = where(args.where, current, delegates)(currentValue);
        if (shouldUpdate) {
            const baseValue = {
                ...currentValue,
                ...removeUndefined(update(args, false, currentValue, current, delegates)),
            };
            const updated = pipe(includes(args, current, delegates), select(args.select))(baseValue);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBkYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpYi9vcGVyYXRpb25zL3VwZGF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxlQUFlLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFJN0QsT0FBTyxFQUFFLDBCQUEwQixFQUFFLGVBQWUsRUFBRSxNQUFNLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFDL0UsT0FBTyxFQUNMLE9BQU8sRUFDUCxvQkFBb0IsRUFDcEIsNkJBQTZCLEVBQzdCLHlCQUF5QixFQUN6QixZQUFZLEVBQ1osUUFBUSxFQUNSLE1BQU0sRUFDTixLQUFLLEdBQ04sTUFBTSxRQUFRLENBQUM7QUFjaEIsTUFBTSxNQUFNLEdBQUcsQ0FBQyxJQUFnQixFQUFFLFVBQW1CLEVBQUUsSUFBVSxFQUFFLE9BQWlCLEVBQUUsU0FBb0IsRUFBRSxFQUFFO0lBQzVHLE1BQU0sRUFBRSxJQUFJLEVBQUUsR0FBUSxJQUFJLENBQUM7SUFFM0IsT0FBTyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUU7UUFDckMsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7WUFDckIsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUVuQyxJQUFJLEtBQUssQ0FBQyxJQUFJLEtBQUssUUFBUSxFQUFFLENBQUM7Z0JBQzVCLElBQUksU0FBUyxDQUFDLE9BQU8sRUFBRSxDQUFDO29CQUN0QixNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUNuQyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBRXhCLE1BQU0sUUFBUSxHQUFHLFNBQVMsQ0FBQyxRQUFRLENBQUMsS0FB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