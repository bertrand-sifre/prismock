import { Prisma } from '@prisma/client';
import { generateDelegates } from './prismock';
export function generateClient(delegates, getData, setData) {
    // eslint-disable-next-line no-console
    console.log('Deprecation notice: generatePrismock and generatePrismockSync should be replaced with PrismockClient. See https://github.com/morintd/prismock/blob/master/docs/generate-prismock-deprecated.md');
    const client = {
        $connect: () => Promise.resolve(),
        $disconnect: () => Promise.resolve(),
        $on: () => { },
        $use: () => { },
        $executeRaw: () => Promise.resolve(0),
        $executeRawUnsafe: () => Promise.resolve(0),
        $queryRaw: () => Promise.resolve([]),
        $queryRawUnsafe: () => Promise.resolve([]),
        getData,
        setData,
        ...delegates,
    };
    return {
        ...client,
        $transaction: async (args) => {
            if (Array.isArray(args)) {
                return Promise.all(args);
            }
            return args(client);
        },
    };
}
export function createPrismock(instance) {
    return class Prismock {
        constructor() {
            this.generate();
        }
        reset() {
            this.generate();
        }
        generate() {
            const { delegates, setData, getData } = generateDelegates({ models: instance.dmmf.datamodel.models });
            Object.entries({ ...delegates, setData, getData }).forEach(([key, value]) => {
                if (key in this)
                    Object.assign(this[key], value);
                else
                    Object.assign(this, { [key]: value });
            });
        }
        async $connect() {
            return Promise.resolve();
        }
        $disconnect() {
            return Promise.resolve();
        }
        $on() { }
        $use() {
            return this;
        }
        $executeRaw() {
            return Promise.resolve(0);
        }
        $executeRawUnsafe() {
            return Promise.resolve(0);
        }
        $queryRaw() {
            return Promise.resolve([]);
        }
        $queryRawUnsafe() {
            return Promise.resolve([]);
        }
        $extends() {
            return this;
        }
        async $transaction(args) {
            if (Array.isArray(args)) {
                return Promise.all(args);
            }
            return args(this);
        }
    };
}
export const PrismockClient = createPrismock(Prisma);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi9jbGllbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLE1BQU0sRUFBcUIsTUFBTSxnQkFBZ0IsQ0FBQztBQUszRCxPQUFPLEVBQW1CLGlCQUFpQixFQUFFLE1BQU0sWUFBWSxDQUFDO0FBY2hFLE1BQU0sVUFBVSxjQUFjLENBQW1CLFNBQW1DLEVBQUUsT0FBZ0IsRUFBRSxPQUFnQjtJQUN0SCxzQ0FBc0M7SUFDdEMsT0FBTyxDQUFDLEdBQUcsQ0FDVCxnTUFBZ00sQ0FDak0sQ0FBQztJQUVGLE1BQU0sTUFBTSxHQUFHO1FBQ2IsUUFBUSxFQUFFLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUU7UUFDakMsV0FBVyxFQUFFLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUU7UUFDcEMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFFLENBQUM7UUFDYixJQUFJLEVBQUUsR0FBRyxFQUFFLEdBQUUsQ0FBQztRQUNkLFdBQVcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztRQUNyQyxpQkFBaUIsRUFBRSxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztRQUMzQyxTQUFTLEVBQUUsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7UUFDcEMsZUFBZSxFQUFFLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDO1FBQzFDLE9BQU87UUFDUCxPQUFPO1FBQ1AsR0FBRyxTQUFTO0tBQ3VCLENBQUM7SUFFdEMsT0FBTztRQUNMLEdBQUcsTUFBTTtRQUNULFlBQVksRUFBRSxLQUFLLEVBQUUsSUFBd0IsRUFBRSxFQUFFO1lBQy9DLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENB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