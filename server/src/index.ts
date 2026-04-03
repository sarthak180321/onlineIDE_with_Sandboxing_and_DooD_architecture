import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import authRoutes from './Routes/authRoutes';
import { WebSocketServer } from 'ws';
import { initTerminalWS } from './controllers/terminalController';
import http from 'http'

dotenv.config();
connectDB();

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json());

app.use('/api/auth', authRoutes);

export const server = http.createServer(app);

const wss = new WebSocketServer({ 
    server,
    verifyClient: (info, cb) => {
        console.log('WS connection attempt from:', info.origin)
        console.log('WS URL:', info.req.url)
        cb(true)
    }
});

initTerminalWS(wss);

const PORT = process.env.PORT || 5000;

// server.listen not app.listen
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export default app;