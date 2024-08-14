"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toPaginated = exports.createWhereString = void 0;
const create_where_string_1 = __importDefault(require("./create-where-string"));
exports.createWhereString = create_where_string_1.default;
const to_paginated_1 = __importDefault(require("./to-paginated"));
exports.toPaginated = to_paginated_1.default;
