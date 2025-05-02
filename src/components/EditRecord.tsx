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
    Container
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { axiosGet, axiosPost } from '../utils/axiosUtils';

interface ShareType {
    person: number;
    share: number;
}

const EditRecord: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const recordPk = parseInt(id || '-1', 10);

    const [record, setRecord] = useState({
        amount: 0,
        payer: 1,
        notes: ''
    });
    const [shares, setShares] = useState<ShareType[]>([]);
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRecordAndShares = async () => {
            try {
                const res = await axiosGet(`${process.env.REACT_APP_BACKEND_API_BASE}api/record/?recordPk=${recordPk}`);
                if (res.data.success && res.data.data.length > 0) {
                    const sharesOnly = res.data.data.map((share: any) => ({ person: share.person, share: share.share }));
                    const recordInfo = {
                        amount: res.data.data[0].amount,
                        payer: res.data.data[0].payer,
                        notes: res.data.data[0].notes || ''
                    };
                    setShares(sharesOnly);
                    setRecord(recordInfo);
                } else {
                    setError('Record not found');
                }
            } catch (err) {
                setError('Failed to load record');
            } finally {
                setLoading(false);
            }
        };

        if (recordPk > 0) fetchRecordAndShares();
        else {
            setError('Invalid record ID');
            setLoading(false);
        }
    }, [recordPk]);

    const handleShareChange = (index: number, value: number) => {
        const updatedShares = [...shares];
        updatedShares[index].share = value;
        setShares(updatedShares);
    };

    const totalShare = shares.reduce((sum, s) => sum + s.share, 0);
    const isShareValid = Math.abs(totalShare - 1) < 0.0001; // Float tolerance check

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSuccess(null);
        setError(null);

        if (!isShareValid) {
            setError('Total share must equal 100%.');
            return;
        }

        try {
            await axiosPost(`${process.env.REACT_APP_BACKEND_API_BASE}api/record/`, {
                action: 'update',
                recordData: {
                    recordPk,
                    amount: record.amount,
                    payer: record.payer,
                    notes: record.notes,
                    shareDatas: shares
                }
            });
            setSuccess('Record updated successfully!');
            navigate(-1);
        } catch (err) {
            setError('Failed to update record');
        }
    };

    if (loading) return <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 4 }} />;

    return (
        <Container maxWidth="md" sx={{ mt: 4, marginLeft: 'auto', marginRight: 'auto' }}>
            <Box component="form" onSubmit={handleSubmit} sx={{ p: 4, bgcolor: '#fafafa', borderRadius: 2, boxShadow: 2 }}>
                <Typography variant="h5" sx={{ color: "black" }} gutterBottom>Edit Record</Typography>

                <TextField
                    label="Amount"
                    type="number"
                    value={record.amount}
                    onChange={(e) => setRecord({ ...record, amount: parseFloat(e.target.value) })}
                    fullWidth
                    required
                    sx={{ mb: 2 }}
                />

                <TextField
                    label="Payer (Person Number)"
                    type="number"
                    value={record.payer}
                    onChange={(e) => setRecord({ ...record, payer: parseInt(e.target.value) })}
                    fullWidth
                    required
                    sx={{ mb: 2 }}
                />

                <TextField
                    label="Notes"
                    value={record.notes}
                    onChange={(e) => setRecord({ ...record, notes: e.target.value })}
                    fullWidth
                    multiline
                    rows={3}
                    sx={{ mb: 2 }}
                />

                <Typography variant="h6" sx={{ mt: 4 }}>Shares</Typography>
                <TableContainer component={Paper} sx={{ mt: 2, mb: 2 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Person</TableCell>
                                <TableCell>Share (%)</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {shares.map((share, index) => (
                                <TableRow key={index}>
                                    <TableCell>{share.person}</TableCell>
                                    <TableCell>
                                        <TextField
                                            type="number"
                                            value={(share.share * 100).toFixed(2)}
                                            onChange={(e) => handleShareChange(index, parseFloat(e.target.value) / 100)}
                                            inputProps={{ min: 0, max: 100, step: 0.01 }}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Typography variant="body2" color={isShareValid ? 'success.main' : 'error.main'}>
                    Total share: {(totalShare * 100).toFixed(2)}%
                </Typography>

                <Button type="submit" variant="contained" disabled={!isShareValid} sx={{ mt: 2 }}>
                    Update Record
                </Button>

                {success && <Typography color="success.main" sx={{ mt: 2 }}>{success}</Typography>}
                {error && <Typography color="error.main" sx={{ mt: 2 }}>{error}</Typography>}
            </Box>
        </Container>
    );
};

export default EditRecord;
