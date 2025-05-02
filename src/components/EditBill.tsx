import React, { useEffect, useState } from 'react';
import {
    TextField,
    Button,
    Box,
    Typography,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Container
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { axiosGet, axiosPost } from '../utils/axiosUtils';

interface RecordType {
    pk: number;
    amount: number;
    payer: number;
    notes: string;
    created_by: string;
    belong_to: number;
}

const EditBill: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const billPk = parseInt(id || '-1', 10);

    const [loading, setLoading] = useState(true);
    const [bill, setBill] = useState<{ name: string; people_count: number }>({ name: '', people_count: 1 });
    const [records, setRecords] = useState<RecordType[]>([]);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBillAndRecords = async () => {
            try {
                const res = await axiosGet(`${process.env.REACT_APP_BACKEND_API_BASE}api/bill/?billPk=${billPk}`);
                if (res.data.success) {
                    const recordList = res.data.data;
                    setRecords(recordList);
                    if (recordList.length > 0) {
                        setBill({
                            name: recordList[0].belong_to_name || 'Unnamed Bill',
                            people_count: recordList[0].people_count || 1
                        });
                    }
                } else {
                    setError('Bill not found');
                }
            } catch (err) {
                setError('Failed to load bill');
            } finally {
                setLoading(false);
            }
        };

        if (billPk > 0) {
            fetchBillAndRecords();
        } else {
            setError('Missing or invalid bill ID');
            setLoading(false);
        }
    }, [billPk]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSuccess(null);
        setError(null);

        try {
            await axiosPost(`${process.env.REACT_APP_BACKEND_API_BASE}api/bill/`, {
                action: 'update',
                billData: {
                    billPk: billPk,
                    name: bill.name,
                    people_count: bill.people_count,
                },
            });
            setSuccess('Bill updated successfully!');
            navigate('/bills');
        } catch (err) {
            setError('Failed to update bill');
        }
    };

    const handleEditRecord = (recordPk: number) => {
        window.location.href = `/records/edit/${recordPk}`;
    };

    const handleDeleteRecord = (recordPk: number) => {
        if (window.confirm('Are you sure you want to delete this record?')) {
            axiosPost(`${process.env.REACT_APP_BACKEND_API_BASE}api/record/`, {
                action: 'delete',
                recordData: { recordPk }
            }).then((response) => {
                if (response.data.success) {
                    setRecords(records.filter(record => record.pk !== recordPk));
                } else {
                    console.error('Error deleting record:', response.data.error);
                }
            }).catch((error) => {
                console.error('Error deleting record:', error);
            });
        }
    };

    if (loading) return <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 4 }} />;

    return (
        <Container maxWidth="md">
            <Box sx={{ p: 4, bgcolor: '#fafafa', borderRadius: 2, boxShadow: 2 }}>
                <form onSubmit={handleSubmit}>
                    <Typography variant="h5" sx={{ color: "black" }} gutterBottom>Edit Bill</Typography>

                    <TextField
                        label="Bill Name"
                        value={bill.name}
                        onChange={(e) => setBill({ ...bill, name: e.target.value })}
                        fullWidth
                        required
                        sx={{ mb: 2 }}
                    />

                    <TextField
                        label="People Count"
                        type="number"
                        value={bill.people_count}
                        onChange={(e) => setBill({ ...bill, people_count: Math.max(1, parseInt(e.target.value)) })}
                        fullWidth
                        required
                        inputProps={{ min: 1 }}
                        sx={{ mb: 2 }}
                    />

                    <Button type="submit" variant="contained">Update Bill</Button>

                    {success && <Typography color="success.main" sx={{ mt: 2 }}>{success}</Typography>}
                    {error && <Typography color="error.main" sx={{ mt: 2 }}>{error}</Typography>}
                </form>

                <Typography variant="h6" sx={{ mt: 4 }}>Records</Typography>
                <TableContainer component={Paper} sx={{ mt: 2 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Amount</TableCell>
                                <TableCell>Payer</TableCell>
                                <TableCell>Notes</TableCell>
                                <TableCell>Created By</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {records.map((record) => (
                                <TableRow key={record.pk}>
                                    <TableCell>{record.pk}</TableCell>
                                    <TableCell>${record.amount.toFixed(2)}</TableCell>
                                    <TableCell>{record.payer}</TableCell>
                                    <TableCell>{record.notes}</TableCell>
                                    <TableCell>{record.created_by}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => handleEditRecord(record.pk)} color="primary">
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton onClick={() => handleDeleteRecord(record.pk)} color="secondary">
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Container>
    );
};

export default EditBill;
