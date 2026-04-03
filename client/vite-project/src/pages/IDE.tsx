import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import type { RootState, AppDispatch } from '../app/store'
import { logout } from '../features/auth/authSlice'
import TerminalTabs from '../components/TerminalTabs'

function IDE() {
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()
    const { token, containerId } = useSelector((state: RootState) => state.auth)

    const [iframeUrl, setIframeUrl] = useState('')
    const [inputUrl, setInputUrl] = useState('')

    const handleLogout = async () => {
        await dispatch(logout())
        navigate('/login')
    }

    const handleLoadUrl = () => {
        if (!inputUrl.trim()) return
        const cleaned = inputUrl.trim().replace(/^https?:\/\//, '')
        const url = `http://localhost:3000/${containerId}/${cleaned}`
        setIframeUrl(url)
        window.open(url, '_blank')
    }

    return (
        <div style={styles.root}>
            {/* Top bar */}
            <div style={styles.topBar}>
                <span style={styles.logo}>VimIDE</span>
                <div style={styles.urlBar}>
                    <input
                        style={styles.urlInput}
                        type="text"
                        placeholder="localhost:3000/path"
                        value={inputUrl}
                        onChange={e => setInputUrl(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleLoadUrl()}
                    />
                    <button style={styles.goBtn} onClick={handleLoadUrl}>Go</button>
                    {iframeUrl && (
                        <button style={styles.newTabBtn} onClick={() => window.open(iframeUrl, '_blank')}>
                            ↗ New Tab
                        </button>
                    )}
                </div>
                <button style={styles.logoutBtn} onClick={handleLogout}>
                    Logout & Destroy
                </button>
            </div>

            {/* Main area */}
            <div style={styles.main}>
                {/* Terminal panel - left */}
                <div style={styles.terminalPanel}>
                    <TerminalTabs token={token!} />
                </div>

                {/* Preview panel - right */}
                <div style={styles.iframePanel}>
                    {iframeUrl ? (
                        <div style={styles.iframePlaceholder}>
                            <p style={{ color: '#4ec9b0', fontSize: '16px' }}>✓ App is running</p>
                            <p style={{ fontSize: '12px', color: '#555', wordBreak: 'break-all', textAlign: 'center', padding: '0 1rem' }}>
                                {iframeUrl}
                            </p>
                            <button style={styles.goBtn} onClick={() => window.open(iframeUrl, '_blank')}>
                                ↗ Open in new tab
                            </button>
                        </div>
                    ) : (
                        <div style={styles.iframePlaceholder}>
                            <p>Enter a URL above to preview your app</p>
                            <p style={{ fontSize: '12px', color: '#555' }}>
                                e.g. localhost:3000/get_intro
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

const styles: Record<string, React.CSSProperties> = {
    root: {
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        backgroundColor: '#1e1e1e',
        overflow: 'hidden',
    },
    topBar: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '8px 16px',
        backgroundColor: '#2d2d2d',
        borderBottom: '1px solid #3a3a3a',
        flexShrink: 0,
    },
    logo: {
        color: '#4ec9b0',
        fontWeight: 'bold',
        fontSize: '16px',
        whiteSpace: 'nowrap',
    },
    urlBar: {
        display: 'flex',
        flex: 1,
        gap: '8px',
    },
    urlInput: {
        flex: 1,
        padding: '6px 10px',
        borderRadius: '4px',
        border: '1px solid #444',
        backgroundColor: '#1e1e1e',
        color: '#fff',
        fontSize: '13px',
        outline: 'none',
    },
    goBtn: {
        padding: '6px 14px',
        borderRadius: '4px',
        border: 'none',
        backgroundColor: '#0e7a0d',
        color: '#fff',
        cursor: 'pointer',
        fontSize: '13px',
    },
    newTabBtn: {
        padding: '6px 14px',
        borderRadius: '4px',
        border: '1px solid #444',
        backgroundColor: '#1e1e1e',
        color: '#4ec9b0',
        cursor: 'pointer',
        fontSize: '13px',
        whiteSpace: 'nowrap',
    },
    logoutBtn: {
        padding: '6px 14px',
        borderRadius: '4px',
        border: 'none',
        backgroundColor: '#8b0000',
        color: '#fff',
        cursor: 'pointer',
        fontSize: '13px',
        whiteSpace: 'nowrap',
    },
    main: {
        display: 'flex',
        flex: 1,
        overflow: 'hidden',
    },
    terminalPanel: {
        width: '50%',
        borderRight: '1px solid #3a3a3a',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
    },
    iframePanel: {
        width: '50%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
    },
    iframePlaceholder: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        color: '#555',
        gap: '0.5rem',
    },
}

export default IDE