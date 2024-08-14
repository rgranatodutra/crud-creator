"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function toPaginated(rows, page, perPage) {
    const data = (rows.length > perPage ? rows.slice(0, perPage) : rows);
    const paginatedResponse = {
        data,
        page: {
            current: page,
            next: rows.length > perPage,
            previous: page > 1
        }
    };
    return paginatedResponse;
}
exports.default = toPaginated;
