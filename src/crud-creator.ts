import { ResultSetHeader } from "mysql2";
import toPaginated, { PaginatedResponse } from "./utils/to-paginated";
import { NotFoundError } from "@rgranatodutra/http-errors";
import { CrudProps, CrudWithJoinProps, FilterWithPaginationQueryParameters, InstancesMannager, Join } from "./types";
import createWhereString from "./utils/create-where-string";

class Crud<T> {
    private readonly tableName: string;
    private readonly primaryKey: keyof T & string;
    private readonly likeColumns: Array<keyof T> = [];
    private readonly dateColumns: Array<keyof T> = [];
    private readonly numberColumns: Array<keyof T> = [];
    private readonly joins: Array<Join<T, any>> = [];
    private readonly service: InstancesMannager;
    private readonly alias: string;
    private readonly columns: string;

    constructor(props: CrudProps<T> | CrudWithJoinProps<T>) {
        this.tableName = props.tableName;
        this.primaryKey = props.primaryKey;
        this.service = props.service;
        this.alias = 'alias' in props ? props.alias || "tb" : 'tb';
        this.columns = props.columns?.map(c => `${this.alias}.${c as string}`).join(", ") || `${this.alias}.*`;

        props.likeColumns && this.likeColumns.push(...props.likeColumns);
        props.dateColumns && this.dateColumns.push(...props.dateColumns);
        props.numberColumns && this.numberColumns.push(...props.numberColumns);

        if ('joins' in props) {
            this.joins = props.joins;
        }
    }

    public async get(
        clientName: string,
        parameters: FilterWithPaginationQueryParameters<T>
    ): Promise<PaginatedResponse<T>> {
        const page = Number(parameters.page || 1);
        const perPage = Number(parameters.perPage || 20);

        const [whereString, queryParameters] = createWhereString<T>({
            parameters: parameters,
            likeColumns: this.likeColumns,
            dateColumns: this.dateColumns,
            numberColumns: this.numberColumns,
            alias: this.alias
        });

        const columnsStr = [
            this.columns,
            this.joins.map((j) =>
                j.columns?.map(c => `${j.alias}.${c as string}`).join(", ") || `${j.alias}.*`
            ).filter(Boolean).join(", ")
        ].filter(Boolean).join(", ");

        const joinStr = this.joins.map(j =>
            `${j.type} JOIN ${j.tableName} ${j.alias} ON ${this.alias}.${j.condition.key1} ${j.condition.operator} ${j.alias}.${j.condition.key2}`
        ).join(" ");

        const queryString = `SELECT ${columnsStr} FROM ${this.tableName} ${this.alias} ${joinStr} ${whereString}`.trim();

        console.log(queryString);

        const queryResult = await this.service
            .executeQuery<Array<T>>(clientName, queryString, queryParameters)
            .then(data => data.result);

        return toPaginated<T>(queryResult, page, perPage);
    }

    public async create<P extends Object>(
        clientName: string,
        payload: P,
    ) {
        const fields = `(${Object.keys(payload).join(", ")})`;
        const placeholders = `(${Object.entries(payload).map(_ => "?").join(", ")})`;
        const insertQueryParams = Object.values(payload);
        const isertQueryString = `INSERT INTO ${this.tableName} ${fields} VALUES ${placeholders}`;
        const insertQueryResult = await this.service.executeQuery<ResultSetHeader>(clientName, isertQueryString, insertQueryParams)
            .then(data => data.result);

        if (Object.keys(payload).includes(this.primaryKey)) {
            const searchQueryString = `SELECT * FROM ${this.tableName} WHERE ${this.primaryKey} = ?`;
            const searchQueryResult = await this.service.executeQuery<Array<T>>(clientName, searchQueryString, [(payload as unknown as T)[this.primaryKey]])
                .then(data => data.result);

            return searchQueryResult[0];
        } else {
            const searchQueryString = `SELECT * FROM ${this.tableName} WHERE ${this.primaryKey} = ?`;
            const searchQueryResult = await this.service.executeQuery<Array<T>>(clientName, searchQueryString, [insertQueryResult.insertId])
                .then(data => data.result);

            return searchQueryResult[0];
        }
    }

    public async update(
        clientName: string,
        id: any,
        payload: Partial<T>,
    ) {
        const findQueryString = `SELECT * FROM ${this.tableName} WHERE ${this.primaryKey} = ?`;
        const findQueryResult = await this.service.executeQuery<Array<T>>(clientName, findQueryString, [id])
            .then(data => data.result);

        if (findQueryResult.length <= 0) {
            throw new NotFoundError("entity not found");
        }

        const fields = Object.keys(payload).map(key => `${key} = ?`).join(", ");
        const values = Object.values(payload);
        const updateQueryString = `UPDATE  ${this.tableName} SET ${fields} WHERE ${this.primaryKey} = ?`;
        const updateQueryParams = [...values, id];
        await this.service.executeQuery<ResultSetHeader>(clientName, updateQueryString, updateQueryParams);

        const findUpdatedQueryResult = await this.service.executeQuery<Array<T>>(clientName, findQueryString, [id])
            .then(data => data.result);

        return findUpdatedQueryResult[0];
    }

    public async delete(
        clientName: string,
        id: any
    ) {
        const findQueryString = `SELECT * FROM ${this.tableName} WHERE ${this.primaryKey} = ?`;
        const findQueryResult = await this.service.executeQuery<Array<T>>(clientName, findQueryString, [id])
            .then(data => data.result);

        if (findQueryResult.length <= 0) {
            throw new NotFoundError("entity not found");
        }

        const deleteQueryString = `DELETE FROM ${this.tableName} WHERE ${this.primaryKey} = ?`;
        await this.service.executeQuery<ResultSetHeader>(clientName, deleteQueryString, [id])
            .then(data => data.result);

        return;
    }
}

export default Crud;