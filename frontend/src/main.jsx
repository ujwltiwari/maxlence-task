import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Registration from '@/modules/Auth/Registration/screens/Registration.jsx'
import { Toaster } from '@/components/ui/sonner'
import Login from './modules/Auth/Login/screens/Login'
import ForgetPassword from './modules/Auth/ForgetPassword/screens/ForgetPassword'
import Layout from './components/layout/Layout'
import ResetPassword from './modules/Auth/ForgetPassword/screens/ResetPassword'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/signup',
    element: <Registration />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/forget-password',
    element: (
      <Layout>
        <ForgetPassword />
      </Layout>
    ),
  },
  {
    path: '/reset-password/:id',
    element: (
      <Layout>
        <ResetPassword />
      </Layout>
    ),
  },
  // {
  //   path: "/:id",
  //   element: <App />,
  // },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}>
      <Toaster />
    </RouterProvider>
  </StrictMode>
)
