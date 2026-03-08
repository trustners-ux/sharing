import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function PrivateRoute({ children, requireManager = false, requireAdmin = false }) {
  const { isAuthenticated, isManager, isAdmin, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100vh', color: '#1B3A6B',
      }}>
        Loading...
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (requireManager && !isManager) {
    return <Navigate to="/advisor" replace />
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/advisor" replace />
  }

  return children
}
