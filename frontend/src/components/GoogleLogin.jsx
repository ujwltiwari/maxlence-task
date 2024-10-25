import React, { useState, useEffect } from 'react'
import { useGoogleLogin } from '@react-oauth/google'
import { Button } from './ui/button'
import { FcGoogle } from 'react-icons/fc'
import axios from 'axios'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

const GoogleLoginComp = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate() // To navigate after login
  console.log('user', user)
  const login = useGoogleLogin({
    onSuccess: (codeResponse) => setUser(codeResponse),
    onError: (error) => alert('Login Failed:', error),
  })

  useEffect(() => {
    if (user) {
      fetchUserProfile(user.access_token)
    }
  }, [user])

  const fetchUserProfile = async (accessToken) => {
    setLoading(true)
    try {
      const { data } = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessToken}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/json',
          },
        }
      )
      handleUserInDB(data)
    } catch (error) {
      console.error('Error fetching user profile:', error)
      setError('Unable to fetch user profile. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const handleUserInDB = async (userData) => {
    try {
      const { data: existingUser } = await axios.get(
        `http://localhost:3000/users/email`,
        {
          params: { email: userData.email },
        }
      )
      console.log('existingUser', existingUser)
      if (existingUser.data.length) {
        // Existing user: log in and redirect to dashboard
        console.log('inside exisitingUser')
        const login = await axios.post(
          `http://localhost:3000/api/auth/login`,
          {
            email: userData.email,
            password: '',
            type: 'google',
          },
          {
            withCredentials: true,
          }
        )
        console.log('login ', login)
        if (login.data.message === 'Login Succesfull') {
          toast.success('Welcome back!')
        }
        // navigate('/profile')
      } else {
        // New user: create an account
        const { data: newAccount } = await axios.post(
          `http://localhost:3000/api/auth/register`,
          {
            fullName: userData.name,
            email: userData.email,
            image: userData.picture,
            password: '',
            type: 'signup',
          }
        )

        if (newAccount) {
          toast.success('Account Created, Verification link sent to email')
        }
      }
    } catch (error) {
      console.error('Error handling user in DB:', error)
      setError('An error occurred while saving your profile. Please try again.')
    }
  }

  return (
    <div className='mt-4'>
      {error && <p className='text-red-500 text-sm mb-2'>{error}</p>}
      <Button
        onClick={login}
        className='max-w-[500px] w-full'
        disabled={loading}
      >
        {loading ? 'Signing in...' : 'Sign in with Google'} <FcGoogle />
      </Button>
    </div>
  )
}

export default GoogleLoginComp
