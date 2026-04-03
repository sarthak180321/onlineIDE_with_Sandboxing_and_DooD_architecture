import { useState, type FormEvent } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { register } from '../features/auth/authSlice'
import type { AppDispatch, RootState } from '../app/store'

function Register() {
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()
    const { loading, error } = useSelector((state: RootState) => state.auth)

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        const result = await dispatch(register({ email, password }))
        if (register.fulfilled.match(result)) {
            navigate('/ide')
        }
    }

    return (
        <div style={styles.container}>
            <div style={styles.box}>
                <h2 style={styles.title}>Register</h2>
                {error && <p style={styles.error}>{error}</p>}
                <form onSubmit={handleSubmit} style={styles.form}>
                    <input
                        style={styles.input}
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                    <input
                        style={styles.input}
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                    <button style={styles.button} type="submit" disabled={loading}>
                        {loading ? 'Creating account...' : 'Register'}
                    </button>
                </form>
                <p style={styles.link}>
                    Already have an account? <Link to="/login" style={styles.anchor}>Login</Link>
                </p>
            </div>
        </div>
    )
}

const styles: Record<string, React.CSSProperties> = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#1e1e1e',
    },
    box: {
        backgroundColor: '#2d2d2d',
        padding: '2rem',
        borderRadius: '8px',
        width: '360px',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    },
    title: {
        color: '#ffffff',
        margin: 0,
        textAlign: 'center',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
    },
    input: {
        padding: '0.6rem 0.8rem',
        borderRadius: '4px',
        border: '1px solid #444',
        backgroundColor: '#1e1e1e',
        color: '#fff',
        fontSize: '14px',
        outline: 'none',
    },
    button: {
        padding: '0.7rem',
        borderRadius: '4px',
        border: 'none',
        backgroundColor: '#0e7a0d',
        color: '#fff',
        fontSize: '14px',
        cursor: 'pointer',
    },
    error: {
        color: '#ff6b6b',
        fontSize: '13px',
        textAlign: 'center',
        margin: 0,
    },
    link: {
        color: '#aaa',
        fontSize: '13px',
        textAlign: 'center',
        margin: 0,
    },
    anchor: {
        color: '#4ec9b0',
    },
}

export default Register