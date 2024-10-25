import useAuth from '@/hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import Spinner from './Spinner'

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate()
  const { isLoggedIn, loading } = useAuth()

  if (loading)
    return (
      <div className='h-[100vh] w-full flex items-center justify-center'>
        <Spinner />
      </div>
    )
  if (!isLoggedIn) {
    navigate('/login')
  }

  return children // Render the protected component if authenticated
}

export default ProtectedRoute
