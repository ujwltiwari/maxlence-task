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
import useAuth from '@/hooks/useAuth'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { z } from 'zod'
import { emailRegex } from '@/helpers/regex.js'

const fields = [
  {
    name: 'email',
    placeholder: 'Enter Email',
    type: 'text',
  },
]

const ForgetPassword = () => {
  const navigate = useNavigate()
  const { isLoggedIn, loading, user } = useAuth()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/')
    }
  }, [isLoggedIn])

  const schema = z.object({
    email: z
      .string()
      .email({
        message: 'Please enter a valid email address',
      })
      .regex(emailRegex),
  })

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = async (values) => {
    try {
      const result = await axios.post(
        'http://localhost:3000/api/auth/reset-password',
        {
          ...values,
        }
      )
      console.log('password reset', result)
      if (result.data) {
        toast.success('Password reset link sent to email')
        setSuccess('Password reset link sent to email')
      }
      form.reset()
    } catch (error) {
      console.error('Error While Password Reset', error)
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

          <Button type='submit'>Request Password Reset Link</Button>
        </form>
      </Form>
      {error ? (
        <p className='text-[16px] font-medium text-red-600 mt-4'>
          Error: {error}
        </p>
      ) : null}
      {success ? (
        <p className='text-[16px] font-medium text-teal-600 mt-4'>{success}</p>
      ) : null}
    </>
  )
}

export default ForgetPassword
