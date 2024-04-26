"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateDelegate = void 0;
const operations_1 = require("./operations");
function generateDelegate(model, data, name, properties, delegates, onChange) {
    const delegate = {};
    Object.assign(delegate, {
        delete: (args = {}) => {
            const deleted = (0, operations_1.deleteMany)(args, delegate, delegates, onChange);
            if (deleted.length === 0)
                return Promise.reject(new Error());
            return Promise.resolve(deleted[0]);
        },
        deleteMany: (args = {}) => {
            const deleted = (0, operations_1.deleteMany)(args, delegate, delegates, onChange);
            return Promise.resolve({ count: deleted.length });
        },
        update: (args) => {
            var _a;
            const updated = (0, operations_1.updateMany)(args, delegate, delegates, onChange);
            return Promise.resolve((_a = updated[0]) !== null && _a !== void 0 ? _a : null);
        },
        updateMany: (args) => {
            const updated = (0, operations_1.updateMany)(args, delegate, delegates, onChange);
            return Promise.resolve({ count: updated.length });
        },
        create: (args) => {
            const { data } = args, options = __rest(args, ["data"]);
            return Promise.resolve((0, operations_1.create)(data, options, delegate, delegates, onChange));
        },
        createMany: (args) => {
            const { data } = args, options = __rest(args, ["data"]);
            data.forEach((d) => {
                (0, operations_1.create)(d, options, delegate, delegates, onChange);
            });
            return Promise.resolve({ count: args.data.length });
        },
        upsert: (args) => {
            var _a;
            const res = (0, operations_1.findOne)(args, delegate, delegates);
            if (res) {
                const updated = (0, operations_1.updateMany)(Object.assign(Object.assign({}, args), { data: args.update }), delegate, delegates, onChange);
                return Promise.resolve((_a = updated[0]) !== null && _a !== void 0 ? _a : null);
            }
            else {
                const { create: data } = args, options = __rest(args, ["create"]);
                return Promise.resolve((0, operations_1.create)(data, options, delegate, delegates, onChange));
            }
        },
        findMany: (args = {}) => {
            return Promise.resolve((0, operations_1.findMany)(args, delegate, delegates));
        },
        findUnique: (args = {}) => {
            return Promise.resolve((0, operations_1.findOne)(args, delegate, delegates));
        },
        findFirst: (args = {}) => {
            return Promise.resolve((0, operations_1.findOne)(args, delegate, delegates));
        },
        findUniqueOrThrow: (args = {}) => {
            const found = (0, operations_1.findOne)(args, delegate, delegates);
            if (!found)
                return Promise.reject(new Error());
            return Promise.resolve(found);
        },
        findFirstOrThrow: (args = {}) => {
            const found = (0, operations_1.findOne)(args, delegate, delegates);
            if (!found)
                return Promise.reject(new Error());
            return Promise.resolve(found);
        },
        count: (args = {}) => {
            const found = (0, operations_1.findMany)(args, delegate, delegates);
            return Promise.resolve(found.length);
        },
        aggregate: (args = {}) => {
            const found = (0, operations_1.findMany)(args, delegate, delegates);
            const aggregated = (0, operations_1.aggregate)(args, found);
            return Promise.resolve(aggregated);
        },
        groupBy: (args) => {
            return Promise.resolve((0, operations_1.groupBy)(args, delegate, delegates));
        },
        model,
        getItems: () => data[name],
        getProperties: () => properties[name],
        onChange,
    });
    return delegate;
}
exports.generateDelegate = generateDelegate;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVsZWdhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL2RlbGVnYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBR0EsNkNBQTZIO0FBc0M3SCxTQUFnQixnQkFBZ0IsQ0FDOUIsS0FBaUIsRUFDakIsSUFBVSxFQUNWLElBQVksRUFDWixVQUFzQixFQUN0QixTQUFvQixFQUNwQixRQUFpQztJQUVqQyxNQUFNLFFBQVEsR0FBRyxFQUFjLENBQUM7SUFFaEMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUU7UUFDdEIsTUFBTSxFQUFFLENBQUMsT0FBbUIsRUFBRSxFQUFFLEVBQUU7WUFDaEMsTUFBTSxPQUFPLEdBQUcsSUFBQSx1QkFBVSxFQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBRWhFLElBQUksT0FBTyxDQUFDLE1BQU0sS0FBSyxDQUFDO2dCQUFFLE9BQU8sT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEtBQUssRUFBRSxDQUFDLENBQUM7WUFDN0QsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3JDLENBQUM7UUFDRCxVQUFVLEVBQUUsQ0FBQyxPQUFtQixFQUFFLEVBQUUsRUFBRTtZQUNwQyxNQUFNLE9BQU8sR0FBRyxJQUFBLHVCQUFVLEVBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDaEUsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsS0FBSyxFQUFFLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO1FBQ3BELENBQUM7UUFDRCxNQUFNLEVBQUUsQ0FBQyxJQUFnQixFQUFFLEVBQUU7O1lBQzNCLE1BQU0sT0FBTyxHQUFHLElBQUEsdUJBQVUsRUFBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxR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