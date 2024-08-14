"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstancesMannager = void 0;
const create_where_string_1 = __importDefault(require("./utils/create-where-string"));
const to_paginated_1 = __importDefault(require("./utils/to-paginated"));
const http_errors_1 = require("@rgranatodutra/http-errors");
class InstancesMannager {
}
exports.InstancesMannager = InstancesMannager;
class Crud {
    tableName;
    primaryKey;
    likeColumns = [];
    dateColumns = [];
    numberColumns = [];
    joins = [];
    service;
    alias;
    columns;
    constructor(props) {
        this.tableName = props.tableName;
        this.primaryKey = props.primaryKey;
        this.service = props.service;
        this.alias = 'alias' in props ? props.alias || "tb" : 'tb';
        this.columns = props.columns?.map(c => `${this.alias}.${c}`).join(", ") || `${this.alias}.*`;
        props.likeColumns && this.likeColumns.push(...props.likeColumns);
        props.dateColumns && this.dateColumns.push(...props.dateColumns);
        props.numberColumns && this.numberColumns.push(...props.numberColumns);
        if ('joins' in props) {
            this.joins = props.joins;
        }
    }
    async get(clientName, parameters) {
        const page = Number(parameters.page || 1);
        const perPage = Number(parameters.perPage || 20);
        const [whereString, queryParameters] = (0, create_where_string_1.default)({
            parameters: parameters,
            likeColumns: this.likeColumns,
            dateColumns: this.dateColumns,
            numberColumns: this.numberColumns,
            alias: this.alias
        });
        const columnsStr = [
            this.columns,
            this.joins.map((j) => j.columns?.map(c => `${j.alias}.${c}`).join(", ") || `${j.alias}.*`).filter(Boolean).join(", ")
        ].filter(Boolean).join(", ");
        const joinStr = this.joins.map(j => `${j.type} JOIN ${j.tableName} ${j.alias} ON ${this.alias}.${j.condition.key1} ${j.condition.operator} ${j.alias}.${j.condition.key2}`).join(" ");
        const queryString = `SELECT ${columnsStr} FROM ${this.tableName} ${this.alias} ${joinStr} ${whereString}`.trim();
        console.log(queryString);
        const queryResult = await this.service
            .executeQuery(clientName, queryString, queryParameters)
            .then(data => data.result);
        return (0, to_paginated_1.default)(queryResult, page, perPage);
    }
    async create(clientName, payload) {
        const fields = `(${Object.keys(payload).join(", ")})`;
        const placeholders = `(${Object.entries(payload).map(_ => "?").join(", ")})`;
        const insertQueryParams = Object.values(payload);
        const isertQueryString = `INSERT INTO ${this.tableName} ${fields} VALUES ${placeholders}`;
        const insertQueryResult = await this.service.executeQuery(clientName, isertQueryString, insertQueryParams)
            .then(data => data.result);
        if (Object.keys(payload).includes(this.primaryKey)) {
            const searchQueryString = `SELECT * FROM ${this.tableName} WHERE ${this.primaryKey} = ?`;
            const searchQueryResult = await this.service.executeQuery(clientName, searchQueryString, [payload[this.primaryKey]])
                .then(data => data.result);
            return searchQueryResult[0];
        }
        else {
            const searchQueryString = `SELECT * FROM ${this.tableName} WHERE ${this.primaryKey} = ?`;
            const searchQueryResult = await this.service.executeQuery(clientName, searchQueryString, [insertQueryResult.insertId])
                .then(data => data.result);
            return searchQueryResult[0];
        }
    }
    async update(clientName, id, payload) {
        const findQueryString = `SELECT * FROM ${this.tableName} WHERE ${this.primaryKey} = ?`;
        const findQueryResult = await this.service.executeQuery(clientName, findQueryString, [id])
            .then(data => data.result);
        if (findQueryResult.length <= 0) {
            throw new http_errors_1.NotFoundError("entity not found");
        }
        const fields = Object.keys(payload).map(key => `${key} = ?`).join(", ");
        const values = Object.values(payload);
        const updateQueryString = `UPDATE  ${this.tableName} SET ${fields} WHERE ${this.primaryKey} = ?`;
        const updateQueryParams = [...values, id];
        await this.service.executeQuery(clientName, updateQueryString, updateQueryParams);
        const findUpdatedQueryResult = await this.service.executeQuery(clientName, findQueryString, [id])
            .then(data => data.result);
        return findUpdatedQueryResult[0];
    }
    async delete(clientName, id) {
        const findQueryString = `SELECT * FROM ${this.tableName} WHERE ${this.primaryKey} = ?`;
        const findQueryResult = await this.service.executeQuery(clientName, findQueryString, [id])
            .then(data => data.result);
        if (findQueryResult.length <= 0) {
            throw new http_errors_1.NotFoundError("entity not found");
        }
        const deleteQueryString = `DELETE FROM ${this.tableName} WHERE ${this.primaryKey} = ?`;
        await this.service.executeQuery(clientName, deleteQueryString, [id])
            .then(data => data.result);
        return;
    }
}
exports.default = Crud;
