"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismockClient = exports.createPrismock = exports.generateClient = void 0;
const client_1 = require("@prisma/client");
const prismock_1 = require("./prismock");
function generateClient(delegates, getData, setData) {
    // eslint-disable-next-line no-console
    console.log('Deprecation notice: generatePrismock and generatePrismockSync should be replaced with PrismockClient. See https://github.com/morintd/prismock/blob/master/docs/generate-prismock-deprecated.md');
    const client = Object.assign({ $connect: () => Promise.resolve(), $disconnect: () => Promise.resolve(), $on: () => { }, $use: () => { }, $executeRaw: () => Promise.resolve(0), $executeRawUnsafe: () => Promise.resolve(0), $queryRaw: () => Promise.resolve([]), $queryRawUnsafe: () => Promise.resolve([]), getData,
        setData }, delegates);
    return Object.assign(Object.assign({}, client), { $transaction: async (args) => {
            if (Array.isArray(args)) {
                return Promise.all(args);
            }
            return args(client);
        } });
}
exports.generateClient = generateClient;
function createPrismock(instance) {
    return class Prismock {
        constructor() {
            this.generate();
        }
        reset() {
            this.generate();
        }
        generate() {
            const { delegates, setData, getData } = (0, prismock_1.generateDelegates)({ models: instance.dmmf.datamodel.models });
            Object.entries(Object.assign(Object.assign({}, delegates), { setData, getData })).forEach(([key, value]) => {
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
exports.createPrismock = createPrismock;
exports.PrismockClient = createPrismock(client_1.Prisma);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi9jbGllbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsMkNBQTJEO0FBSzNELHlDQUFnRTtBQWNoRSxTQUFnQixjQUFjLENBQW1CLFNBQW1DLEVBQUUsT0FBZ0IsRUFBRSxPQUFnQjtJQUN0SCxzQ0FBc0M7SUFDdEMsT0FBTyxDQUFDLEdBQUcsQ0FDVCxnTUFBZ00sQ0FDak0sQ0FBQztJQUVGLE1BQU0sTUFBTSxHQUFHLGdCQUNiLFFBQVEsRUFBRSxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLEVBQ2pDLFdBQVcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLEVBQ3BDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRSxDQUFDLEVBQ2IsSUFBSSxFQUFFLEdBQUcsRUFBRSxHQUFFLENBQUMsRUFDZCxXQUFXLEVBQUUsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFDckMsaUJBQWlCLEVBQUUsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFDM0MsU0FBUyxFQUFFLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLEVBQ3BDLGVBQWUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxFQUMxQyxPQUFPO1FBQ1AsT0FBTyxJQUNKLFNBQVMsQ0FDdUIsQ0FBQztJQUV0QyxPQUFPLGdDQUNGLE1BQU0sS0FDVCxZQUFZLEVBQUUsS0FBSyxFQUFFLElBQXdCLEVBQUUsRUFBRTtZQUMvQyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztnQkFDeEIsT0FBTyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzNCLENBQUM7WUFFRCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN0QixDQUFDLEdBQ2tDLENBQUM7QUFDeEMsQ0FBQztBQTlCRCx3Q0E4QkM7QUFNRCxTQUFnQixjQUFjLENBQUMsUUFBc0I7SUFDbkQsT0FBTyxNQUFNLFFBQVE7UUFDbkI7WUFDRSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDbEIsQ0FBQztRQUVELEtBQUs7WUFDSCxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDbEIsQ0FBQztRQUVPLFFBQVE7WUFDZCxNQUFNLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsR0FBRyxJQUFBLDRCQUFpQixFQUFDLEVBQUUsTUFBTSxFQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQXNCLEVBQUUsQ0FBQyxDQUFDO1lBRXRILE1BQU0sQ0FBQyxPQUFPLGlDQUFNLFNBQVMsS0FBRSxPQUFPLEVBQUUsT0FBTyxJQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLEVBQUUsRUFBRTtnQkFDMUUsSUFBSSxHQUFHLElBQUksSUFBSTtvQkFBRSxNQUFNLENBQUMsTUFBTSxDQUFFLElBQTZCLENBQUMsR0FBRyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7O29CQUN0RSxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztZQUM3QyxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUM7UUFFRCxLQUFLLENBQUMsUUFBUTtZQUNaLE9BQU8sT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQzNCLENBQUM7UUFFRCxXQUFXO1lBQ1QsT0FBTyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDM0IsQ0FBQztRQUVELEdBQUcsS0FBSSxDQUFDO1FBRVIsSUFBSTtZQUNGLE9BQU8sSUFBSSxDQUFDO1FBQ2QsQ0FBQztRQUVELFdBQVc7WUFDVCxPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDNUIsQ0FBQztRQUVELGlCQUFpQjtZQUNmLE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM1QixDQUFDO1FBRUQsU0FBUztZQUNQLE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUM3QixDQUFDO1FBRUQsZUFBZTtZQUNiLE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUM3QixDQUFDO1FBRUQsUUFBUTtZQUNOLE9BQU8sSUFBSSxDQUFDO1FBQ2QsQ0FBQztRQUVELEtBQUssQ0FBQyxZQUFZLENBQUMsSUFBUztZQUMxQixJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztnQkFDeEIsT0FBTyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzNCLENBQUM7WUFFRCxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNwQixDQUFDO0tBQytDLENBQUM7QUFDckQsQ0FBQztBQTdERCx3Q0E2REM7QUFFWSxRQUFBLGNBQWMsR0FBRyxjQUFjLENBQUMsZUFBTSxDQUFDLENBQUMifQ==