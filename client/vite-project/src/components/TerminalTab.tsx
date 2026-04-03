import { useEffect, useRef } from 'react'
import { Terminal } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'
import { ClipboardAddon } from '@xterm/addon-clipboard'
import '@xterm/xterm/css/xterm.css'

interface Props {
    tabId: string
    token: string
    isActive: boolean
}

function TerminalTab({ tabId, token, isActive }: Props) {
    console.log(`Rendering TerminalTab ${tabId}, active: ${isActive}`) // Debug log
    const terminalRef = useRef<HTMLDivElement>(null)
    const xtermRef = useRef<Terminal | null>(null)
    const wsRef = useRef<WebSocket | null>(null)
    const fitAddonRef = useRef<FitAddon | null>(null)

    useEffect(() => {
        const terminal = new Terminal({
            cursorBlink: true,
            cursorStyle: 'block',
            fontSize: 14,
            fontFamily: '"Courier New", monospace',
            theme: {
                background: '#1e1e1e',
                foreground: '#ffffff',
                cursor: '#ffffff',
            },
            scrollback: 1000,
            convertEol: true,
            allowProposedApi: true,
            macOptionIsMeta: true,
        })

        const fitAddon = new FitAddon()
        const clipboardAddon = new ClipboardAddon()
        terminal.loadAddon(fitAddon)
        terminal.loadAddon(clipboardAddon)
        terminal.open(terminalRef.current!)
        fitAddon.fit()

        xtermRef.current = terminal
        fitAddonRef.current = fitAddon

        const ws = new WebSocket(`ws://localhost:5000/?token=${token}`)
        wsRef.current = ws

        ws.onopen = () => {
            terminal.write('\r\n\x1b[32mConnected to container shell\x1b[0m\r\n')
        }

        ws.onmessage = (event) => {
            const message = JSON.parse(event.data)
            if (message.type === 'output') {
                terminal.write(message.data)
            }
            if (message.type === 'exit') {
                terminal.write('\r\n\x1b[31mSession ended\x1b[0m\r\n')
            }
            if (message.type === 'error') {
                terminal.write(`\r\n\x1b[31m${message.message}\x1b[0m\r\n`)
            }
        }

        ws.onerror = () => {
            terminal.write('\r\n\x1b[31mWebSocket error\x1b[0m\r\n')
        }

        ws.onclose = () => {
            terminal.write('\r\n\x1b[33mDisconnected\x1b[0m\r\n')
        }

        // Terminal input -> WebSocket
        terminal.onData((data: string) => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({ type: 'input', data }))
            }
        })

        // Let browser handle paste natively
        terminal.attachCustomKeyEventHandler((e: KeyboardEvent) => {
            if (e.ctrlKey && e.key === 'v') {
                return false
            }
            return true
        })

        // Paste event -> send to pty
        terminalRef.current?.addEventListener('paste', (e: ClipboardEvent) => {
            const text = e.clipboardData?.getData('text') || ''
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({ type: 'input', data: text }))
            }
        })

        // Resize
        const handleResize = () => {
            fitAddon.fit()
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({
                    type: 'resize',
                    cols: terminal.cols,
                    rows: terminal.rows,
                }))
            }
        }
        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
            ws.close()
            terminal.dispose()
        }
    }, [token])

    useEffect(() => {
        if (isActive && fitAddonRef.current) {
            setTimeout(() => fitAddonRef.current?.fit(), 50)
        }
    }, [isActive])

    return (
        <div
            ref={terminalRef}
            style={{
                width: '100%',
                height: '100%',
                display: isActive ? 'block' : 'none',
            }}
        />
    )
}

export default TerminalTab