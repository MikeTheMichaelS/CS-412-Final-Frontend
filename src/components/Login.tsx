import React, { useContext } from 'react';
import { Box, Button, Container, TextField, Typography } from '@mui/material';
import { axiosPost } from '../utils/axiosUtils';
import { AppContext } from '../utils/appContext';

const LOGIN_API_URL = process.env.REACT_APP_BACKEND_API_BASE + 'login/';

export default function Login() {
    const { setContextFunc } = useContext(AppContext);
    const [loginError, setLoginError] = React.useState(false);
    const [loginErrorMessage, setLoginErrorMessage] = React.useState('');

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const username = (event.target as HTMLFormElement).username.value;
        const password = (event.target as HTMLFormElement).password.value;
        axiosPost(
            LOGIN_API_URL,
            { "username": username, "password": password },
        ).then((response) => response.data)
            .then((data) => {
                if (data.success) {
                    // Handle successful login (e.g., redirect to dashboard)
                    console.log('Login successful:', data);
                    setLoginError(false);
                    setLoginErrorMessage('');
                    setContextFunc({ loggedIn: true });
                } else {
                    // Handle login failure (e.g., show error message)
                    console.error('Login failed:', data.error);
                    setLoginError(true);
                    setLoginErrorMessage(data.error);
                }
            }).catch((error) => {
                // Handle error (e.g., network error, server error)
                console.error('Error during login:', error);
                setLoginError(true);
                setLoginErrorMessage('An error occurred during login. Please try again later.');
            }
            )
    };


    return (
        <Container
            maxWidth="xs"
            sx={{ alignSelf: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column', marginLeft: 'auto', marginRight: 'auto' }}
        >
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component="h1" variant="h5">
                    Login
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        autoComplete="username"
                        autoFocus
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Login
                    </Button>
                    {loginError && (
                        <Typography color="error" variant="body2">
                            {loginErrorMessage}
                        </Typography>
                    )}
                </Box>
            </Box>
        </Container>
    );
}