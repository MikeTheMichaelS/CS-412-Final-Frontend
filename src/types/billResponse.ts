export default interface BillResponse {
    pk: number;
    name: string;
    creation_date: string; // String rep of date time
    created_by: string;
    amount: number;
    people_count: number;
};