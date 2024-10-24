import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import RegistrationForm from '@/modules/Auth/Registration/forms/RegistrationForm.jsx'
import Layout from './components/layout/Layout'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Layout>
        <h1>Home Page</h1>
      </Layout>
    </>
  )
}

export default App
