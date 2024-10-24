import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import axios from 'axios'
import { toast } from 'sonner'
import { Toaster } from '@/components/ui/sonner'
import { loginFormSchema } from './schema/loginSchema'
import useAuth from '@/hooks/useAuth'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
const fields = [
  {
    name: 'email',
    placeholder: 'Enter Email',
    type: 'text',
  },
  {
    name: 'password',
    placeholder: 'Enter Password',
    type: 'text',
  },
]

const LoginForm = () => {
  const navigate = useNavigate()
  const { isLoggedIn, loading, user } = useAuth()
  const [error, setError] = useState('')

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/')
    }
  }, [isLoggedIn])
  const form = useForm({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (values) => {
    try {
      const result = await axios.post('http://localhost:3000/api/auth/login', {
        ...values,
        type: 'login',
      })
      console.log('logged in', result)
      if (result.data) {
        toast.success('Verification Email Sent For Login')
      }
      form.reset()
    } catch (error) {
      console.error('Error While Login', error)
      setError(error.response.data)
    }
  }

  return (
    <>
      <Toaster position='top-right' />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2'>
          {/*Normal Inputs*/}
          {fields.map((x, idx) => (
            <FormField
              key={idx}
              control={form.control}
              name={x.name}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder={x.placeholder}
                      {...field}
                      type={x.type}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          {/*Normal Inputs*/}

          <Button type='submit'>Request Login Link</Button>
        </form>
      </Form>
      {error ? (
        <p className='text-[16px] font-medium text-red-600 mt-4'>
          Error: {error}
        </p>
      ) : null}
    </>
  )
}

export default LoginForm
