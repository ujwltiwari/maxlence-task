import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Registration from '@/modules/Auth/Registration/screens/Registration.jsx'
import { Toaster } from '@/components/ui/sonner'
import Login from './modules/Auth/Login/screens/Login'

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
