"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMany = void 0;
const helpers_1 = require("../helpers");
const find_1 = require("./find");
function deleteMany(args, current, delegates, onChange) {
    const { toDelete, withoutDeleted } = current.getItems().reduce((accumulator, currentValue) => {
        const shouldDelete = (0, find_1.where)(args.where, current, delegates)(currentValue);
        const deleted = (0, helpers_1.pipe)((0, find_1.includes)(args, current, delegates), (0, find_1.select)(args.select))(currentValue);
        if (shouldDelete) {
            return {
                toDelete: [...accumulator.toDelete, deleted],
                withoutDeleted: accumulator.withoutDeleted,
            };
        }
        return {
            toDelete: accumulator.toDelete,
            withoutDeleted: [...accumulator.withoutDeleted, currentValue],
        };
    }, { toDelete: [], withoutDeleted: [] });
    onChange(withoutDeleted);
    toDelete.forEach((item) => {
        current.model.fields.forEach((field) => {
            const joinfield = (0, find_1.getJoinField)(field, delegates);
            if (!joinfield)
                return;
            const delegate = (0, find_1.getDelegateFromField)(field, delegates);
            if (joinfield.relationOnDelete === 'SetNull') {
                delegate.updateMany({
                    where: (0, find_1.getFieldFromRelationshipWhere)(item, joinfield),
                    data: {
                        [joinfield.relationFromFields[0]]: null,
                    },
                });
            }
            else if (joinfield.relationOnDelete === 'Cascade') {
                delegate.deleteMany({
                    where: (0, find_1.getFieldFromRelationshipWhere)(item, joinfield),
                });
            }
        });
    });
    return toDelete;
}
exports.deleteMany = deleteMany;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVsZXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpYi9vcGVyYXRpb25zL2RlbGV0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFHQSx3Q0FBa0M7QUFFbEMsaUNBQW9IO0FBYXBILFNBQWdCLFVBQVUsQ0FBQyxJQUFnQixFQUFFLE9BQWlCLEVBQUUsU0FBb0IsRUFBRSxRQUFpQztJQUNySCxNQUFNLEVBQUUsUUFBUSxFQUFFLGNBQWMsRUFBRSxHQUFHLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxNQUFNLENBQzVELENBQUMsV0FBd0IsRUFBRSxZQUFrQixFQUFFLEVBQUU7UUFDL0MsTUFBTSxZQUFZLEdBQUcsSUFBQSxZQUFLLEVBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDekUsTUFBTSxPQUFPLEdBQUcsSUFBQSxjQUFJLEVBQUMsSUFBQSxlQUFRLEVBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxTQUFTLENBQUMsRUFBRSxJQUFBLGFBQU0sRUFBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUU1RixJQUFJLFlBQVksRUFBRSxDQUFDO1lBQ2pCLE9BQU87Z0JBQ0wsUUFBUSxFQUFFLENBQUMsR0FBRyxXQUFXLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQztnQkFDNUMsY0FBYyxFQUFFLFdBQVcsQ0FBQyxjQUFjO2FBQzNDLENBQUM7UUFDSixDQUFDO1FBRUQsT0FBTztZQUNMLFFBQVEsRUFBRSxXQUFXLENBQUMsUUFBUTtZQUM5QixjQUFjLEVBQUUsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxjQUFjLEVBQUUsWUFBWSxDQUFDO1NBQzlELENBQUM7SUFDSixDQUFDLEVBQ0QsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLGNBQWMsRUFBRSxFQUFFLEVBQUUsQ0FDckMsQ0FBQztJQUVGLFFBQVEsQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUV6QixRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBVSxFQUFFLEVBQUU7UUFDOUIsT0FBTyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUU7WUFDckMsTUFBTSxTQUFTLEdBQUcsSUFBQSxtQkFBWSxFQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsQ0FBQztZQUNqRCxJQUFJLENBQUMsU0FBUztnQkFBRSxPQUFPO1lBRXZCLE1BQU0sUUFBUSxHQUFHLElBQUEsMkJBQW9CLEVBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBRXhELElBQUksU0FBUyxDQUFDLGdCQUFnQixLQUFLLFNBQVMsRUFBRSxDQUFDO2dCQUM3QyxRQUFRLENBQUMsVUFBVSxDQUFDO29CQUNsQixLQUFLLEVBQUUsSUFBQSxvQ0FBNkIsRUFBQyxJQUFJLEVBQUUsU0FBUyxDQUFDO29CQUNyRCxJQUFJLEVBQUU7d0JBQ0osQ0FBQyxTQUFTLENBQUMsa0JBQW1CLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJO3FCQUN6QztpQkFDRixDQUFDLENBQUM7WUFDTCxDQUFDO2lCQUFNLElBQUksU0FBUyxDQUFDLGdCQUFnQixLQUFLLFNBQVMsRUFBRSxDQUFDO2dCQUNwRCxRQUFRLENBQUMsVUFBVSxDQUFDO29CQUNsQixLQUFLLEVBQUUsSUFBQSxvQ0FBNkIsRUFBQyxJQUFJLEVBQUUsU0FBUyxDQUFDO2lCQUN0RCxDQUFDLENBQUM7WUFDTCxDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILE9BQU8sUUFBUSxDQUFDO0FBQ2xCLENBQUM7QUE5Q0QsZ0NBOENDIn0=