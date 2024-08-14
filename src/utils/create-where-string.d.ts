import { CreateWhereStringOptions } from "../types";
export default function createWhereString<T>({ parameters, likeColumns, dateColumns, numberColumns, alias }: CreateWhereStringOptions<T>): [string, Array<any>];
