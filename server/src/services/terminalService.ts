import * as pty from 'node-pty';

export interface PtyProcess {
    process: pty.IPty;
    containerId: string;
}

const ptySessions = new Map<string, PtyProcess>();

export const createPtySession = (sessionId: string, containerId: string): pty.IPty => {
    if (ptySessions.has(sessionId)) {
        killPtyProcess(sessionId);
    }

    const ptyProcess = pty.spawn('docker', ['exec', '-it', containerId, '/bin/bash'], {
        name: 'xterm-256color',
        cols: 80,
        rows: 24,
        cwd: process.env.HOME,
        env: {
            ...process.env as { [key: string]: string },
            TERM: 'xterm-256color',
            COLORTERM: 'truecolor',
            LANG: 'en_US.UTF-8',
            LC_ALL: 'en_US.UTF-8',
        },
    });

    ptySessions.set(sessionId, { process: ptyProcess, containerId });
    return ptyProcess;
};

export const resizePtyProcess = (sessionId: string, cols: number, rows: number): void => {
    const session = ptySessions.get(sessionId);
    if (session) {
        session.process.resize(cols, rows);
    }
};

export const killPtyProcess = (sessionId: string): void => {
    const session = ptySessions.get(sessionId);
    if (session) {
        session.process.kill();
        ptySessions.delete(sessionId);
    }
};

export const getPtyProcess = (sessionId: string): PtyProcess | undefined => {
    return ptySessions.get(sessionId);
};