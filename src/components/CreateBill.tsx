import React, { useState } from 'react';
import {
    TextField,
    Button,
    Box,
    Typography
} from '@mui/material';
import { axiosPost } from '../utils/axiosUtils';

const CreateBillForm: React.FC = () => {
    const [name, setName] = useState('');
    const [peopleCount, setPeopleCount] = useState(1);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [amount, setAmount] = useState(0);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setSuccess(null);
        setError(null);

        const payload = {
            action: 'create',
            billData: {
                name,
                people_count: peopleCount,
                amount: amount,
            }
        };

        try {
            const response = await axiosPost(`${process.env.REACT_APP_BACKEND_API_BASE}api/bill/`, payload);
            setSuccess('Bill created successfully!');
            setName('');
            setPeopleCount(1);
        } catch (err: any) {
            setError('Failed to create bill.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 500, mx: 'auto', p: 3 }}>
            <Typography variant="h5" gutterBottom>Create a New Bill</Typography>

            <TextField
                label="Bill Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                required
                sx={{ mb: 2 }}
            />

            <TextField
                label="People Count"
                type="number"
                value={peopleCount}
                onChange={(e) => setPeopleCount(Math.max(1, parseInt(e.target.value)))}
                fullWidth
                required
                sx={{ mb: 2 }}
                inputProps={{ min: 1 }}
            />

            <TextField
                label="Amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                fullWidth
                required
                sx={{ mb: 2 }}
                inputProps={{ min: 1 }}
            />

            <Button type="submit" variant="contained" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Create Bill'}
            </Button>

            {success && <Typography color="success.main" sx={{ mt: 2 }}>{success}</Typography>}
            {error && <Typography color="error.main" sx={{ mt: 2 }}>{error}</Typography>}
        </Box>
    );
};

export default CreateBillForm;
