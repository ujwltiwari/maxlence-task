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
import { registrationFormSchema } from '@/modules/Auth/Registration/forms/schema/registrationSchema.js'
import { useState } from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import { Toaster } from '@/components/ui/sonner'
import { useNavigate } from 'react-router-dom'
import useAuth from '@/hooks/useAuth'
import { useEffect } from 'react'

const fields = [
  {
    name: 'fullName',
    placeholder: 'Enter Full Name',
    type: 'text',
  },
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

const RegistrationForm = () => {
  const navigate = useNavigate()
  const { isLoggedIn, loading, user } = useAuth()
  const [imageUrl, setImageUrl] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/')
    }
  }, [isLoggedIn])

  const form = useForm({
    resolver: zodResolver(registrationFormSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      image: null,
    },
  })

  const onSubmit = async (values) => {
    console.log(values)
    try {
      const result = await axios.post(
        'http://localhost:3000/api/auth/register',
        {
          ...values,
          image: imageUrl,
          type: 'signup',
        }
      )
      console.log('signed up', result)
      if (result.data) {
        toast.success('Account Created, Verification link sent to email')
      }
      form.reset() // reset react-hook-form fields
      setImagePreview(null) // also setImagePreview to null
      setIsSubmitDisabled(true)
    } catch (error) {
      console.error('Error Occurred', error.response)
      setError(error.response.data)
    }
  }

  const handleImageChange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      //show image preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result) // Set the preview URL
      }
      reader.readAsDataURL(file) // Convert file to a data URL
      form.setValue('image', file) // Set the file in the form values

      // upload file to s3
      const data = new FormData()
      data.append('file', file) // Append the selected file to FormData

      try {
        const result = await axios.post('http://localhost:3000/upload', data, {
          headers: {
            'Content-Type': 'multipart/form-data', // Required for file uploads
          },
        })
        setImageUrl(result?.data?.result)
        setIsSubmitDisabled(false)
      } catch (error) {
        console.error('Error Uploading Image', error)
      }
    }
  }

  return (
    <>
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
          {/*Image Input*/}
          <FormField
            control={form.control}
            name='image'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type='file'
                    accept='image/*'
                    onChange={handleImageChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/*Image Input*/}
          {imagePreview && (
            <div className='mt-2'>
              <img
                src={imagePreview}
                alt='Image Preview'
                style={{ maxWidth: '300px', marginTop: '10px' }}
              />
            </div>
          )}
          <p>Please Upload Image to Complete Sign Up</p>
          <Button type='submit' disabled={isSubmitDisabled}>
            Submit
          </Button>
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

export default RegistrationForm
