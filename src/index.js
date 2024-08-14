"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crud_creator_1 = __importDefault(require("./crud-creator"));
class TestMannager {
    executeQuery(clientName, query, parameters) {
        return new Promise((_, rej) => {
            rej("forbidden");
        });
    }
}
const joinUserSector = {
    type: "LEFT",
    tableName: "w_setores",
    alias: "s",
    columns: ["WHATSAPP_NUMERO"],
    condition: {
        key1: "CODIGO",
        operator: "=",
        key2: "CODIGO"
    }
};
const testCrud = new crud_creator_1.default({
    tableName: "operadores",
    joins: [joinUserSector],
    columns: ["CODIGO", "NOME"],
    primaryKey: "CODIGO",
    service: new TestMannager(),
});
testCrud.get("teste", { ORDENAR_POR: "CODIGO", page: "1", perPage: "20" });
