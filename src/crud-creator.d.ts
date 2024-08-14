import { FilterWithPaginationQueryParameters } from "./utils/create-where-string";
import { PaginatedResponse } from "./utils/to-paginated";
export declare abstract class InstancesMannager {
    abstract executeQuery<T>(clientName: string, query: string, parameters: Array<any>): Promise<{
        result: T;
    }>;
}
type ConditionOperator = ">" | "<" | ">=" | "<=" | "<>" | "=";
export interface Join<T1, T2> {
    alias: string;
    tableName: string;
    type: "LEFT" | "RIGHT" | "INNER" | "OUTER";
    condition: {
        key1: keyof T1 & string;
        operator: ConditionOperator;
        key2: keyof T2 & string;
    };
    columns?: (keyof T2)[];
}
interface CrudProps<T> {
    tableName: string;
    primaryKey: keyof T & string;
    likeColumns?: Array<keyof T>;
    dateColumns?: Array<keyof T>;
    numberColumns?: Array<keyof T>;
    service: InstancesMannager;
    columns?: (keyof T)[];
}
interface CrudWithJoinProps<T> extends CrudProps<T> {
    alias: string;
    joins: Join<T, any>[];
}
declare class Crud<T> {
    private readonly tableName;
    private readonly primaryKey;
    private readonly likeColumns;
    private readonly dateColumns;
    private readonly numberColumns;
    private readonly joins;
    private readonly service;
    private readonly alias;
    private readonly columns;
    constructor(props: CrudProps<T> | CrudWithJoinProps<T>);
    get(clientName: string, parameters: FilterWithPaginationQueryParameters<T>): Promise<PaginatedResponse<T>>;
    create<P extends Object>(clientName: string, payload: P): Promise<T>;
    update(clientName: string, id: any, payload: Partial<T>): Promise<T>;
    delete(clientName: string, id: any): Promise<void>;
}
export default Crud;
