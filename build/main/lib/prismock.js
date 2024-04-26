"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateDelegates = exports.generatePrismockSync = exports.generatePrismock = exports.getProvider = exports.fetchGenerator = exports.generateDMMF = void 0;
const path_1 = __importDefault(require("path"));
const getDmmf_1 = require("@prisma/internals/dist/engine-commands/getDmmf");
const getGenerators_1 = require("@prisma/internals/dist/get-generators/getGenerators");
const getSchema_1 = require("@prisma/internals/dist/cli/getSchema");
const operations_1 = require("./operations");
const delegate_1 = require("./delegate");
const client_1 = require("./client");
const helpers_1 = require("./helpers");
async function generateDMMF(schemaPath) {
    const pathToModule = schemaPath !== null && schemaPath !== void 0 ? schemaPath : require.resolve(path_1.default.resolve(process.cwd(), 'prisma/schema.prisma'));
    const datamodel = await (0, getSchema_1.getSchema)(pathToModule);
    return (0, getDmmf_1.getDMMF)({ datamodel });
}
exports.generateDMMF = generateDMMF;
async function fetchGenerator(schemaPath) {
    const pathToModule = schemaPath !== null && schemaPath !== void 0 ? schemaPath : require.resolve(path_1.default.resolve(process.cwd(), 'prisma/schema.prisma'));
    return (0, getGenerators_1.getGenerator)({
        schemaPath: pathToModule,
    });
}
exports.fetchGenerator = fetchGenerator;
function getProvider(generator) {
    var _a;
    return (_a = generator.options) === null || _a === void 0 ? void 0 : _a.datasources[0].activeProvider;
}
exports.getProvider = getProvider;
async function generatePrismock(options = {}) {
    const schema = await generateDMMF(options.schemaPath);
    return generatePrismockSync({ models: schema.datamodel.models });
}
exports.generatePrismock = generatePrismock;
function generatePrismockSync(options) {
    const { delegates, getData, setData } = generateDelegates(options);
    return (0, client_1.generateClient)(delegates, getData, setData);
}
exports.generatePrismockSync = generatePrismockSync;
function generateDelegates(options) {
    var _a;
    const models = (_a = options.models) !== null && _a !== void 0 ? _a : [];
    const data = {};
    const properties = {};
    const delegates = {};
    function getData() {
        return data;
    }
    function setData(d) {
        // eslint-disable-next-line no-console
        console.log('Deprecation notice: setData will be removed in a future version and should not be used anymore. Please use a mix of "reset" and create/createMany to achieve the same result');
        Object.assign(data, d);
        Object.assign(properties, Object.entries(d).reduce((accumulator, [currentKey]) => {
            const model = models.find((m) => (0, helpers_1.camelize)(m.name) === currentKey);
            return Object.assign(Object.assign({}, accumulator), { [currentKey]: {
                    increment: model.fields.reduce((propertiesAccumulator, currentField) => {
                        if ((0, operations_1.isAutoIncrement)(currentField)) {
                            return Object.assign(Object.assign({}, propertiesAccumulator), { [currentField.name]: d[currentKey].length });
                        }
                        return propertiesAccumulator;
                    }, {}),
                } });
        }, {}));
    }
    models.forEach((model) => {
        const name = (0, helpers_1.camelize)(model.name);
        data[name] = [];
        properties[name] = {
            increment: {},
        };
        Object.assign(delegates, {
            [name]: (0, delegate_1.generateDelegate)(model, data, name, properties, delegates, (items) => {
                Object.assign(data, { [name]: items });
            }),
        });
    }, {});
    const clientDelegates = Object.entries(delegates).reduce((accumulator, [delegateKey, delegateValue]) => {
        return Object.assign(Object.assign({}, accumulator), { [delegateKey]: (0, helpers_1.omit)(delegateValue, ['model', 'properties', 'getItems']) });
    }, {});
    return { delegates: clientDelegates, getData, setData };
}
exports.generateDelegates = generateDelegates;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJpc21vY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL3ByaXNtb2NrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLGdEQUF3QjtBQUl4Qiw0RUFBeUU7QUFFekUsdUZBQW1GO0FBQ25GLG9FQUFpRTtBQUVqRSw2Q0FBK0M7QUFDL0MseUNBQWtGO0FBQ2xGLHFDQUE4RDtBQUM5RCx1Q0FBMkM7QUFjcEMsS0FBSyxVQUFVLFlBQVksQ0FBQyxVQUFtQjtJQUNwRCxNQUFNLFlBQVksR0FBRyxVQUFVLGFBQVYsVUFBVSxjQUFWLFVBQVUsR0FBSSxPQUFPLENBQUMsT0FBTyxDQUFDLGNBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLHNCQUFzQixDQUFDLENBQUMsQ0FBQztJQUN4RyxNQUFNLFNBQVMsR0FBRyxNQUFNLElBQUEscUJBQVMsRUFBQyxZQUFZLENBQUMsQ0FBQztJQUNoRCxPQUFPLElBQUEsaUJBQU8sRUFBQyxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUM7QUFDaEMsQ0FBQztBQUpELG9DQUlDO0FBRU0sS0FBSyxVQUFVLGNBQWMsQ0FBQyxVQUFtQjtJQUN0RCxNQUFNLFlBQVksR0FBRyxVQUFVLGFBQVYsVUFBVSxjQUFWLFVBQVUsR0FBSSxPQUFPLENBQUMsT0FBTyxDQUFDLGNBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLHNCQUFzQixDQUFDLENBQUMsQ0FBQztJQUN4RyxPQUFPLElBQUEsNEJBQVksRUFBQztRQUNsQixVQUFVLEVBQUUsWUFBWTtLQUN6QixDQUFDLENBQUM7QUFDTCxDQUFDO0FBTEQsd0NBS0M7QUFFRCxTQUFnQixXQUFXLENBQUMsU0FBb0I7O0lBQzlDLE9BQU8sTUFBQSxTQUFTLENBQUMsT0FBTywwQ0FBRSxXQUFXLENBQUMsQ0FBQyxFQUFFLGNBQWMsQ0FBQztBQUMxRCxDQUFDO0FBRkQsa0NBRUM7QUFF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