import { GridRowsProp } from "@mui/x-data-grid";

export default interface Bill extends GridRowsProp {
    id: number,
    pk: number,
    name: string,
    creation_date: Date,
    created_by: string,
    amount: number,
    people_count: number,
}