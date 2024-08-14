export interface PaginationQueryParameters<T> {
    page: string;
    perPage: string;
    ORDENAR_POR: keyof T;
}
export type FilterWithPaginationQueryParameters<T> = Partial<Record<keyof T, string>> & PaginationQueryParameters<T>;
export interface CreateWhereStringOptions<T> {
    parameters: FilterWithPaginationQueryParameters<T>;
    likeColumns: Array<keyof T>;
    dateColumns: Array<keyof T>;
    numberColumns: Array<keyof T>;
    alias?: string;
}
export declare abstract class InstancesMannager {
    abstract executeQuery<T>(clientName: string, query: string, parameters: Array<any>): Promise<{
        result: T;
    }>;
}
export type ConditionOperator = ">" | "<" | ">=" | "<=" | "<>" | "=";
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
export interface CrudProps<T> {
    tableName: string;
    primaryKey: keyof T & string;
    likeColumns?: Array<keyof T>;
    dateColumns?: Array<keyof T>;
    numberColumns?: Array<keyof T>;
    service: InstancesMannager;
    columns?: (keyof T)[];
}
export interface CrudWithJoinProps<T> extends CrudProps<T> {
    alias: string;
    joins: Join<T, any>[];
}
