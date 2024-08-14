import { PaginatedResponse } from "./utils/to-paginated";
import { CrudProps, CrudWithJoinProps, FilterWithPaginationQueryParameters } from "./types";
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
