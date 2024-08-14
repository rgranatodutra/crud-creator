type PaginationQueryParameters<T> = {
    page: string;
    perPage: string;
    ORDENAR_POR: keyof T;
};
export type FilterWithPaginationQueryParameters<T> = Partial<Record<keyof T, string>> & PaginationQueryParameters<T>;
interface CreateWhereStringOptions<T> {
    parameters: FilterWithPaginationQueryParameters<T>;
    likeColumns: Array<keyof T>;
    dateColumns: Array<keyof T>;
    numberColumns: Array<keyof T>;
    alias?: string;
}
export default function createWhereString<T>({ parameters, likeColumns, dateColumns, numberColumns, alias }: CreateWhereStringOptions<T>): [string, Array<any>];
export {};
