import LoginForm from '@/modules/Auth/Login/forms/LoginForm.jsx'
import Layout from '@/components/layout/Layout.jsx'
import GoogleLoginComp from '@/components/GoogleLogin'
import { Toaster } from 'sonner'
const Login = () => {
  return (
    <>
      <Layout>
        <Toaster position='top-right' />
        <LoginForm />
        <GoogleLoginComp />
      </Layout>
    </>
  )
}

export default Login
