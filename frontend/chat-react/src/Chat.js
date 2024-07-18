import React, {useEffect, useRef, useState} from "react";
import { TextField, Button, Container, Box, Paper, Typography, styled } from "@mui/material";

const ChatContainer = styled(Paper)(({ theme }) => ({
    marginTop: theme.spacing(3),
    display: 'flex',
    flexDirection: 'colum',
    height: '90vh',
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    overflow: 'hidden',
    position: 'relative',
}))

const ChatHistory = styled(Box)(({ theme }) => ({
    flex: 1,
    padding: theme.spacing(2),
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
}))

const ChatMessage = styled(Paper)(({ theme, role }) => ({
    marginBottom: theme.spacing(2),
    padding: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    maxWidth: '70%',
    background: role === 'user' ? '#e1ffc7' : '#f1f1f1',
    alignSelf: role === 'user' ? 'flex-end' : 'flex-start',
    boxShadow: theme.shadows[1],
}));

const ChatForm = styled('form')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(1),
    borderTop: `1px solid ${theme.palette.divider}`,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    boxSizing: 'border-box',
}));

function Chat({ token }) {
    const [message, setMessage] = useState("");
    const [chatHistory, setChatHistory] = useState([]);
    const chatHistoryRef = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const apiUrl = "/api/chat/";
        const headers = {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
        }
        console.log("Sending message with headers:", headers);

        const userMessage = {role: 'user', content: message};
        setChatHistory(prev => [...prev, userMessage]);
        setMessage("");

        try {
            const res = await fetch(apiUrl, {
                method: 'POST',
                headers,
                body: JSON.stringify({message}),
            }) ;

            if (!res.ok) {
                throw new Error('Network response not ok');
            }

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let done = false;
            let botMessage = '';

            while (!done) {
                const {value, done: readerDone} = await reader.read();
                done = readerDone;
                const chunk = decoder.decode(value, { stream: true });
                botMessage += chunk;
            }
            setChatHistory(prev => [...prev, { role: 'bot', content: botMessage }]);


        } catch (err) {
            console.error(err);
            setChatHistory(prev => [...prev, { role: 'bot', content: 'Error fetching response'}]);
        }
    };

    useEffect(() => {
        if (chatHistoryRef.current) {
            chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
        }
    }, [chatHistory]);

    return (
        <Container>
            <ChatContainer elevation={3}>
                <ChatHistory ref={chatHistoryRef}>
                    {chatHistory.map((msg, idx) => (
                        <ChatMessage key={idx} role={msg.role}>
                            <Typography variant="body1">{msg.content}</Typography>
                        </ChatMessage>
                    ))}
                </ChatHistory>

                <ChatForm onSubmit={handleSubmit}>
                    <TextField
                        label="Message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        fullWidth
                        variant="outlined"
                        margin="none"
                        sx={{ flexGrow: 1 }}
                    />

                    <Button type="submit" variant="contained" color="primary" sx={{ ml: 2 }}>Send</Button>
                </ChatForm>
            </ChatContainer>
        </Container>
    );
}

export default Chat;
