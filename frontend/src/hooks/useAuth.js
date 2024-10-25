import Cookies from 'js-cookie'
import { useEffect, useState } from 'react'
import axios from 'axios' // Make sure axios is imported

const useAuth = () => {
  const [user, setUser] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = Cookies.get('token')

    if (token) {
      // Verify the token from backend
      axios
        .get('http://localhost:3000/api/auth/verifyToken', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          if (response.status === 200) {
            setIsLoggedIn(true) // Token is valid, user is logged in
            setUser(response.data) // Set user info from response
          } else {
            setIsLoggedIn(false) // Token is invalid or expired
            setUser(null) // Clear user info
          }
        })
        .catch((error) => {
          console.error('Token verification failed:', error)
          setIsLoggedIn(false) // Token is invalid or verification failed
          setUser(null) // Clear user info
        })
        .finally(() => {
          setLoading(false) // Set loading to false after the check
        })
    } else {
      setIsLoggedIn(false) // No token means user is not logged in
      setUser(null) // Clear user info
      setLoading(false) // Set loading to false
    }
  }, [])

  const logout = async () => {
    try {
      axios
        .post(
          'http://localhost:3000/api/auth/logout',
          {},
          { withCredentials: true }
        )
        .then((response) => {
          console.log(response.data)
        })
        .catch((error) => {
          console.error('Logout error:', error)
        })

      // Update auth states
      setIsLoggedIn(false)
      setUser(null)
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return { isLoggedIn, loading, user, logout }
}

export default useAuth
