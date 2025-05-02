import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
    const navigate = useNavigate();

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    mt: 10,
                    p: 4,
                    bgcolor: '#f5f5f5',
                    borderRadius: 2,
                    boxShadow: 3,
                    textAlign: 'center'
                }}
            >
                <Typography variant="h4" sx={{ color: "black" }} gutterBottom>
                    Welcome to Bill Manager
                </Typography>
                <Typography variant="body1" sx={{ mb: 3, color: "gray" }}>
                    Create, edit, and track bills with shared records and contributions.
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ mr: 2 }}
                    onClick={() => navigate('/bills')}
                >
                    View Bills
                </Button>
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => navigate('/bills/new')}
                >
                    Create New Bill
                </Button>
            </Box>
        </Container>
    );
};

export default Home;
