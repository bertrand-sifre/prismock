import path from 'path';
import { getDMMF } from '@prisma/internals/dist/engine-commands/getDmmf';
import { getGenerator } from '@prisma/internals/dist/get-generators/getGenerators';
import { getSchema } from '@prisma/internals/dist/cli/getSchema';
import { isAutoIncrement } from './operations';
import { generateDelegate } from './delegate';
import { generateClient } from './client';
import { camelize, omit } from './helpers';
export async function generateDMMF(schemaPath) {
    const pathToModule = schemaPath ?? require.resolve(path.resolve(process.cwd(), 'prisma/schema.prisma'));
    const datamodel = await getSchema(pathToModule);
    return getDMMF({ datamodel });
}
export async function fetchGenerator(schemaPath) {
    const pathToModule = schemaPath ?? require.resolve(path.resolve(process.cwd(), 'prisma/schema.prisma'));
    return getGenerator({
        schemaPath: pathToModule,
    });
}
export function getProvider(generator) {
    return generator.options?.datasources[0].activeProvider;
}
export async function generatePrismock(options = {}) {
    const schema = await generateDMMF(options.schemaPath);
    return generatePrismockSync({ models: schema.datamodel.models });
}
export function generatePrismockSync(options) {
    const { delegates, getData, setData } = generateDelegates(options);
    return generateClient(delegates, getData, setData);
}
export function generateDelegates(options) {
    const models = options.models ?? [];
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
            const model = models.find((m) => camelize(m.name) === currentKey);
            return {
                ...accumulator,
                [currentKey]: {
                    increment: model.fields.reduce((propertiesAccumulator, currentField) => {
                        if (isAutoIncrement(currentField)) {
                            return { ...propertiesAccumulator, [currentField.name]: d[currentKey].length };
                        }
                        return propertiesAccumulator;
                    }, {}),
                },
            };
        }, {}));
    }
    models.forEach((model) => {
        const name = camelize(model.name);
        data[name] = [];
        properties[name] = {
            increment: {},
        };
        Object.assign(delegates, {
            [name]: generateDelegate(model, data, name, properties, delegates, (items) => {
                Object.assign(data, { [name]: items });
            }),
        });
    }, {});
    const clientDelegates = Object.entries(delegates).reduce((accumulator, [delegateKey, delegateValue]) => {
        return {
            ...accumulator,
            [delegateKey]: omit(delegateValue, ['model', 'properties', 'getItems']),
        };
    }, {});
    return { delegates: clientDelegates, getData, setData };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJpc21vY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL3ByaXNtb2NrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sSUFBSSxNQUFNLE1BQU0sQ0FBQztBQUl4QixPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sZ0RBQWdELENBQUM7QUFFekUsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLHFEQUFxRCxDQUFDO0FBQ25GLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxzQ0FBc0MsQ0FBQztBQUVqRSxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBQy9DLE9BQU8sRUFBZ0MsZ0JBQWdCLEVBQVEsTUFBTSxZQUFZLENBQUM7QUFDbEYsT0FBTyxFQUFFLGNBQWMsRUFBc0IsTUFBTSxVQUFVLENBQUM7QUFDOUQsT0FBTyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFjM0MsTUFBTSxDQUFDLEtBQUssVUFBVSxZQUFZLENBQUMsVUFBbUI7SUFDcEQsTUFBTSxZQUFZLEdBQUcsVUFBVSxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsc0JBQXNCLENBQUMsQ0FBQyxDQUFDO0lBQ3hHLE1BQU0sU0FBUyxHQUFHLE1BQU0sU0FBUyxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQ2hELE9BQU8sT0FBTyxDQUFDLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQztBQUNoQyxDQUFDO0FBRUQsTUFBTSxDQUFDLEtBQUssVUFBVSxjQUFjLENBQUMsVUFBbUI7SUFDdEQsTUFBTSxZQUFZLEdBQUcsVUFBVSxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsc0JBQXNCLENBQUMsQ0FBQyxDQUFDO0lBQ3hHLE9BQU8sWUFBWSxDQUFD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