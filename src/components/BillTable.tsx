import React, { useEffect } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Typography,
    Button
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import BillResponse from '../types/billResponse';
import { axiosGet, axiosPost } from '../utils/axiosUtils';

const API_URL = process.env.REACT_APP_BACKEND_API_BASE + 'api/my/'

export default function BillTable() {
    const [bills, setBills] = React.useState<BillResponse[]>([]);

    function billEditRedirect(pk: number) {
        // Redirect to the edit page for the bill with the given pk
        window.location.href = `/bills/${pk}`;
    };

    function billDeleteClick(pk: number) {
        // Handle the delete action for the bill with the given pk
        if (window.confirm('Are you sure you want to delete this bill?')) {
            axiosPost(`${process.env.REACT_APP_BACKEND_API_BASE}api/bill/`,
                {
                    action: "delete", billData: {
                        billPk: pk
                    }
                }).then((response) => {
                    if (response.data.success) {
                        setBills(bills.filter(bill => bill.pk !== pk));
                    } else {
                        console.error('Error deleting bill:', response.data.message);
                    }
                }).catch((error) => {
                    console.error('Error deleting bill:', error);
                }
                )
        }
    };

    useEffect(() => {
        const fetchBills = async () => {
            try {
                const response = await axiosGet(API_URL);
                if (response.data.success) {
                    setBills(response.data.data as BillResponse[]);
                } else {
                    console.error('Error fetching bills:', response.data.message);
                }
            } catch (error) {
                console.error('Error fetching bills:', error);
            }
        };
        fetchBills();
    }, []);

    return (
        <TableContainer component={Paper}>
            <Typography variant="h6" sx={{ padding: 2 }}>
                Bills List
            </Typography>
            <Button
                variant="contained"
                color="primary"
                onClick={() => window.location.href = '/bills/new'}
                sx={{ margin: 2 }}
            >
                Create New Bill
            </Button>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Created By</TableCell>
                        <TableCell>Creation Date</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>People Count</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {bills.map((bill) => (
                        <TableRow key={bill.pk}>
                            <TableCell>{bill.pk}</TableCell>
                            <TableCell>{bill.name}</TableCell>
                            <TableCell>{bill.created_by}</TableCell>
                            <TableCell>{new Date(bill.creation_date).toLocaleString()}</TableCell>
                            <TableCell>${bill.amount}</TableCell>
                            <TableCell>{bill.people_count}</TableCell>
                            <TableCell>
                                {/* Add action buttons here */}
                                <Button
                                    onClick={() => billEditRedirect(bill.pk)}
                                    color="inherit"
                                >
                                    <EditIcon />
                                </Button>
                                <Button
                                    onClick={() => billDeleteClick(bill.pk)}
                                    color="inherit"
                                >
                                    <DeleteIcon />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};