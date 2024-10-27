const express = require('express');
const cors = require('cors');
const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');
const http = require('http');

const app = express();
const port = process.env.PORT || 5000;

// More specific CORS configuration
app.use(
    cors({
        origin: [process.env.REACT_APP, 'http://localhost:3000'], // Your React app's URL
        methods: ['GET', 'POST'],
        credentials: true,
    })
);

app.use(express.json());

// In-memory storage
const sessions = new Map();
const clients = new Map();

// Create HTTP server explicitly
const server = http.createServer(app);

// Configure WebSocket server with proper options
const wss = new WebSocket.Server({
    server,
    path: '/ws', // Specify a path for WebSocket connections
    verifyClient: (info) => {
        // Log connection attempts
        console.log('Connection attempt from:', info.origin);
        return true; // Accept all connections for now
    },
});

// Basic API routes
app.post('/api/sessions', (req, res) => {
    try {
        const sessionID = uuidv4();
        sessions.set(sessionID, {
            sessionID,
            users: [],
            createdAt: new Date(),
        });
        res.json({
            sessionID,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/sessions/:sessionID', (req, res) => {
    try {
        const session = sessions.get(req.params.sessionID);
        if (!session)
            return res.status(404).json({ error: 'Session not found' });
        res.json(session);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// WebSocket connection handling
wss.on('connection', (ws, req) => {
    console.log('New WebSocket connection established');

    const clientID = uuidv4();
    const params = new URL(req.url, 'http://localhost:5000').searchParams;
    const sessionID = params.get('sessionID');
    const username = params.get('username');

    console.log(
        `Client connected: ${clientID}, Session: ${sessionID}, Username: ${username}`
    );

    // Store client information
    clients.set(clientID, {
        ws,
        sessionID,
        username,
        position: { x: 0, y: 0 },
    });

    // Send immediate confirmation
    ws.send(
        JSON.stringify({
            type: 'init',
            clientID,
            sessionID,
        })
    );

    // Handle incoming messages
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            console.log(`Received message from ${clientID}:`, data.type);

            if (data.type === 'position') {
                // Update stored position
                clients.get(clientID).position = data.position;

                // Broadcast to others in same session
                clients.forEach((client, id) => {
                    if (
                        id !== clientID &&
                        client.sessionID === sessionID &&
                        client.ws.readyState === WebSocket.OPEN
                    ) {
                        client.ws.send(
                            JSON.stringify({
                                type: 'cursor',
                                clientID,
                                username,
                                position: data.position,
                            })
                        );
                    }
                });
            }
        } catch (error) {
            console.error('Error handling message:', error);
        }
    });

    // Handle disconnection
    ws.on('close', () => {
        console.log(`Client disconnected: ${clientID}`);
        clients.delete(clientID);

        // Notify others in the same session
        clients.forEach((client) => {
            if (
                client.sessionID === sessionID &&
                client.ws.readyState === WebSocket.OPEN
            ) {
                client.ws.send(
                    JSON.stringify({
                        type: 'disconnect',
                        clientID,
                    })
                );
            }
        });
    });

    // Handle errors
    ws.on('error', (error) => {
        console.error(`WebSocket error for client ${clientID}:`, error);
    });
});

// Start server
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(
        `WebSocket server is ready for connections on ws://localhost:${port}/ws`
    );
});

// Error handling for the server
server.on('error', (error) => {
    console.error('Server error:', error);
});
