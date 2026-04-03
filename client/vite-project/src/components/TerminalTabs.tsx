import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from '../app/store'
import { addTab, removeTab, setActiveTab } from '../features/terminal/terminalSlice'
import TerminalTab from './TerminalTab'
import { v4 as uuidv4 } from 'uuid'

interface Props {
    token: string
}

function TerminalTabs({ token }: Props) {
    const dispatch = useDispatch<AppDispatch>()
    const { tabs, activeTabId } = useSelector((state: RootState) => state.terminal)

    const handleAddTab = () => {
        const id = uuidv4()
        dispatch(addTab({ id, title: `Shell ${tabs.length + 1}` }))
    }

    const handleRemoveTab = (e: React.MouseEvent, id: string) => {
        e.stopPropagation()
        dispatch(removeTab(id))
    }

    return (
        <div style={styles.wrapper}>
            {/* Tab bar */}
            <div style={styles.tabBar}>
                {tabs.map(tab => (
                    <div
                        key={tab.id}
                        onClick={() => dispatch(setActiveTab(tab.id))}
                        style={{
                            ...styles.tab,
                            ...(tab.id === activeTabId ? styles.activeTab : {}),
                        }}
                    >
                        <span>{tab.title}</span>
                        <span
                            onClick={(e) => handleRemoveTab(e, tab.id)}
                            style={styles.closeBtn}
                        >
                            ✕
                        </span>
                    </div>
                ))}
                <button onClick={handleAddTab} style={styles.addBtn}>+ New Shell</button>
            </div>

            {/* Terminal instances — all mounted, only active visible */}
            <div style={styles.terminalArea}>
                {tabs.length === 0 && (
                    <div style={styles.empty}>
                        <p>No terminal open.</p>
                        <button onClick={handleAddTab} style={styles.addBtn}>+ New Shell</button>
                    </div>
                )}
                {tabs.map(tab => (
                    <TerminalTab
                        key={tab.id}
                        tabId={tab.id}
                        token={token}
                        isActive={tab.id === activeTabId}
                    />
                ))}
            </div>
        </div>
    )
}

const styles: Record<string, React.CSSProperties> = {
    wrapper: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: '#1e1e1e',
    },
    tabBar: {
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#2d2d2d',
        padding: '4px 8px',
        gap: '4px',
        overflowX: 'auto',
        flexShrink: 0,
    },
    tab: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '4px 12px',
        borderRadius: '4px',
        cursor: 'pointer',
        color: '#aaa',
        fontSize: '13px',
        backgroundColor: '#1e1e1e',
        userSelect: 'none',
    },
    activeTab: {
        backgroundColor: '#3a3a3a',
        color: '#fff',
    },
    closeBtn: {
        fontSize: '11px',
        color: '#888',
        cursor: 'pointer',
        padding: '0 2px',
    },
    addBtn: {
        padding: '4px 10px',
        borderRadius: '4px',
        border: '1px solid #444',
        backgroundColor: 'transparent',
        color: '#aaa',
        fontSize: '12px',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
    },
    terminalArea: {
        flex: 1,
        overflow: 'hidden',
    },
    empty: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        color: '#555',
        gap: '1rem',
    },
}

export default TerminalTabs