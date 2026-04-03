import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from './app/store'
import Login from './pages/Login'
import Register from './pages/Register'
import IDE from './pages/IDE'

function PrivateRoute({ children }: { children: React.ReactNode }) {
    const token = useSelector((state: RootState) => state.auth.token)
    return token ? <>{children}</> : <Navigate to="/login" />
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/ide" element={
                    <PrivateRoute>
                        <IDE />
                    </PrivateRoute>
                } />
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App