export interface PaginatedResponse<T> {
    data: T[];
    page: {
        current: number;
        next: boolean;
        previous: boolean;
    };
}
export default function toPaginated<T>(rows: Array<T>, page: number, perPage: number): PaginatedResponse<T>;
