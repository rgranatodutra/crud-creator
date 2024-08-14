import Crud, { InstancesMannager, Join } from "./crud-creator";

type User = {
    CODIGO: number;
    NOME: string;
}

type Setor = {
    CODIGO: number;
    WHATSAPP_NUMERO: string;
}

class TestMannager implements InstancesMannager {
    public executeQuery<T>(clientName: string, query: string, parameters: Array<any>): Promise<{ result: T; }> {
        return new Promise((_, rej) => {
            rej("forbidden");
        })
    }
}

const joinUserSector: Join<User, Setor> = {
    type: "LEFT",
    tableName: "w_setores",
    alias: "s",
    columns: ["WHATSAPP_NUMERO"],
    condition: {
        key1: "CODIGO",
        operator: "=",
        key2: "CODIGO"
    }
}

const testCrud = new Crud<User>({
    tableName: "operadores",
    joins: [joinUserSector],
    columns: ["CODIGO", "NOME"],
    primaryKey: "CODIGO",
    service: new TestMannager(),
});

testCrud.get("teste", { ORDENAR_POR: "CODIGO", page: "1", perPage: "20" });