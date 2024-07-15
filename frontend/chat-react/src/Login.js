import React, { useState } from 'react';
import axios from 'axios';
import {TextField, Button, Container, Box} from "@mui/material";
import { useNavigate } from "react-router-dom";

function Login({ setToken }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://127.0.0.1:8000/api/auth/login/", { username, password});
            setToken(response.data.token);
            navigate("/chat");
            console.log("navigate to chat page")
            console.log("Token after login:", response.data.token);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Container
            sx={{
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2, // Space between elements
                    width: '100%',
                    maxWidth: 400,
                }}
            >
                <TextField
                    label="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    fullWidth
                />
                <TextField
                    type="password"
                    label="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                />
                <Button type="submit" variant="contained" color="primary">
                    Login
                </Button>
            </Box>
        </Container>
    )
}

export default Login;
