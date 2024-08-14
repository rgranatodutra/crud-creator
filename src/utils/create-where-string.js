"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createWhereString({ parameters, likeColumns, dateColumns, numberColumns, alias }) {
    const { ORDENAR_POR, page, perPage, ...columnFilters } = parameters;
    const columnsEntries = Object.entries(columnFilters);
    let whereString = "";
    const queryParameters = [];
    for (const entry of columnsEntries) {
        const [key, value] = entry;
        const keyWithAlias = alias ? `${alias}.${key}` : key;
        const whereOrAnd = whereString.includes("WHERE") ? "AND" : "WHERE";
        const isDateColumn = dateColumns.includes(key);
        if (isDateColumn) {
            const dates = value.split("_");
            const [initialDate, endDate] = [dates[0] ? new Date(dates[0]) : null, dates[1] ? new Date(dates[1]) : null];
            if (initialDate && endDate) {
                whereString += `${whereOrAnd} ${String(keyWithAlias)} BETWEEN ? AND ?\n`;
                queryParameters.push(initialDate);
                queryParameters.push(endDate);
            }
            else if (initialDate) {
                whereString += `${whereOrAnd} ${String(keyWithAlias)} > ?\n`;
                queryParameters.push(initialDate);
            }
            else if (endDate) {
                whereString += `${whereOrAnd} ${String(keyWithAlias)} < ?\n`;
                queryParameters.push(endDate);
            }
        }
        else {
            const isStrictEqualColumn = !likeColumns.includes(key) || typeof value !== "string";
            const isNumberColumn = numberColumns.includes(key);
            const querySymbol = isStrictEqualColumn ? "=" : "LIKE";
            const queryValue = isNumberColumn ? Number(value) : (isStrictEqualColumn ? value : `%${value}%`);
            whereString += `${whereOrAnd} ${String(keyWithAlias)} ${querySymbol} ?`;
            queryParameters.push(queryValue);
        }
    }
    if (ORDENAR_POR) {
        whereString += ` ORDER BY ${alias}.${String(ORDENAR_POR)} ASC`;
    }
    const limit = Number(perPage) || 50;
    const offset = page ? (Number(page) - 1) * limit : 0;
    whereString += ` LIMIT ${limit + 1} OFFSET ${offset}`;
    return [whereString, queryParameters];
}
exports.default = createWhereString;
