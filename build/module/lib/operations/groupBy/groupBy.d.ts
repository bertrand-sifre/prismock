import { Delegate } from '../../delegate';
import { Delegates } from '../../prismock';
import { GroupByArgs } from '../../types';
export declare function groupBy(args: GroupByArgs, current: Delegate, delegates: Delegates): {
    _avg?: Record<string, number> | undefined;
    _count?: number | Record<string, number> | undefined;
    _max?: Record<string, number> | undefined;
    _min?: Record<string, number> | undefined;
    _sum?: Record<string, number> | undefined;
}[];
