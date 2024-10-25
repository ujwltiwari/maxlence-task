import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import RegistrationForm from '@/modules/Auth/Registration/forms/RegistrationForm.jsx'
import Layout from './components/layout/Layout'
import useAuth from './hooks/useAuth'

function App() {
  const [count, setCount] = useState(0)
  const { isLoggedIn, user, loading } = useAuth()
  console.log('user', user)

  return (
    <>
      <Layout>
        <h1>Home Page</h1>
      </Layout>
    </>
  )
}

export default App
