import { WebSocket,WebSocketServer } from "ws";
import { IncomingMessage } from 'http';
import jwt from 'jsonwebtoken';
import { createPtySession, killPtyProcess, resizePtyProcess } from '../services/terminalService';
import { v4 as uuidv4 } from 'uuid';

interface JWTPayload {
    userId: string;
    containerId: string;
}

interface TerminalMessage {
    type: 'input' | 'resize';
    data?: string;
    cols?: number;
    rows?: number;
}

const verifyToken = (token: string): JWTPayload | null => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET as string) as JWTPayload;
    } catch {
        return null;
    }
};

export const initTerminalWS = (wss: WebSocketServer): void => {
    wss.on('connection', (ws: WebSocket, req: IncomingMessage) => {

        // Extract token from query string: ws://localhost:5000?token=xxx
        const url = new URL(req.url as string, `http://${req.headers.host}`);
        const token = url.searchParams.get('token');

        if (!token) {
            ws.send(JSON.stringify({ type: 'error', message: 'No token provided' }));
            ws.close();
            return;
        }

        const payload = verifyToken(token);
        if (!payload) {
            ws.send(JSON.stringify({ type: 'error', message: 'Invalid token' }));
            ws.close();
            return;
        }

        const { containerId } = payload;

        // Each WS connection = one terminal tab, unique sessionId
        const sessionId = uuidv4();

        console.log(`Terminal session started: ${sessionId} for container: ${containerId}`);

        // Spawn pty process: docker exec -it containerId /bin/sh
        const ptyProcess = createPtySession(sessionId, containerId);

        // pty output -> send to frontend
        ptyProcess.onData((data: string) => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({ type: 'output', data }));
            }
        });

        // pty exits -> notify frontend
        ptyProcess.onExit(() => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({ type: 'exit', message: 'Terminal session ended' }));
                ws.close();
            }
            killPtyProcess(sessionId);
        });

        // frontend -> pty input
        ws.on('message', (raw: Buffer) => {
            try {
                const message: TerminalMessage = JSON.parse(raw.toString());

                if (message.type === 'input' && message.data) {
                    ptyProcess.write(message.data);
                }

                if (message.type === 'resize' && message.cols && message.rows) {
                    resizePtyProcess(sessionId, message.cols, message.rows);
                }
            } catch (error) {
                console.error('Error parsing terminal message:', error);
            }
        });

        // cleanup on disconnect
        ws.on('close', () => {
            console.log(`Terminal session closed: ${sessionId}`);
            killPtyProcess(sessionId);
        });

        ws.on('error', (error) => {
            console.error(`WebSocket error on session ${sessionId}:`, error);
            killPtyProcess(sessionId);
        });
    });
};



