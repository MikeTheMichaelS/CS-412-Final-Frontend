export default interface BillPost {
    action: "create" | "update" | "delete";
    billData: {
        billPk?: number; // For update and delete actions
        name?: string;
        people_count?: number;
        people_names?: string[];
    } // For create action
}

export interface BillPostResponse {
    success: boolean;
    error?: string;
    data?: {
        billPk: number;
    };
}