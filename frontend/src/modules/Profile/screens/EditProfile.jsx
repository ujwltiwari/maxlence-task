import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { registrationFormSchema } from '@/modules/Auth/Registration/forms/schema/registrationSchema.js'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import { Toaster } from '@/components/ui/sonner'
import { useNavigate } from 'react-router-dom'
import useAuth from '@/hooks/useAuth'
import { z } from 'zod'
import { emailRegex } from '@/helpers/regex'

const fields = [
  {
    name: 'fullName',
    placeholder: 'Enter Full Name',
    type: 'text',
  },
  {
    name: 'email',
    placeholder: 'Enter Email',
    type: 'email',
  },
  {
    name: 'password',
    placeholder: 'Enter Password (leave blank to keep current password)',
    type: 'password',
  },
]

const EditProfile = () => {
  const navigate = useNavigate()
  const { isLoggedIn, loading, user } = useAuth()
  const [imageUrl, setImageUrl] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [error, setError] = useState('')
  const [userDetails, setUserDetails] = useState(null)

  useEffect(() => {
    if (user) {
      getDetails()
    }
  }, [user])

  // Get current user's details
  const getDetails = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:3000/users/${user.userId}`
      )
      console.log('data', data)
      setUserDetails(data)
      form.reset({
        fullName: data.fullName,
        email: data.email,
        password: '', // Keep password empty for security
        image: null,
      })
      setImagePreview(data.image)
    } catch (error) {
      console.error('Error fetching user details:', error)
      setError('Failed to fetch user details.')
    }
  }

  const schema = z.object({
    fullName: z
      .string()
      .min(2, {
        message: 'Username must be at least 2 characters.',
      })
      .max(50),
    email: z
      .string()
      .email({
        message: 'Please enter a valid email address',
      })
      .regex(emailRegex),
    password: z.string().optional(), // Make the password field optional
  })

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: '',
      email: '',
      password: undefined, // Keep as empty string initially
      image: null,
    },
  })

  const onSubmit = async (values) => {
    console.log('values', { ...values, image: imageUrl })
    try {
      const result = await axios.put(
        `http://localhost:3000/users/${user.userId}`, // Update the endpoint to PUT request
        {
          ...values,
          image: imageUrl,
        }
      )
      if (result.data) {
        toast.success('Profile updated successfully')
        setTimeout(() => {
          window.location.reload()
        }, 1500)
      }
      form.reset() // Reset react-hook-form fields
      setImagePreview(null) // Set image preview to null
    } catch (error) {
      console.error('Error Occurred', error.response)
      setError(
        error.response.data.message || 'An error occurred during the update.'
      )
    }
  }

  console.log('imageUrl', imageUrl)

  const handleImageChange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      // Show image preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result) // Set the preview URL
      }
      reader.readAsDataURL(file) // Convert file to a data URL
      form.setValue('image', file) // Set the file in the form values

      // Upload file to S3
      const data = new FormData()
      data.append('file', file) // Append the selected file to FormData

      try {
        const result = await axios.post('http://localhost:3000/upload', data, {
          headers: {
            'Content-Type': 'multipart/form-data', // Required for file uploads
          },
        })
        setImageUrl(result?.data?.result)
      } catch (error) {
        console.error('Error Uploading Image', error)
      }
    }
  }

  return (
    <>
      <Toaster position='top-right' />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2'>
          {/* Normal Inputs */}
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
          {/* Image Input */}
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
          {/* Image Preview */}
          {imagePreview && (
            <div className='mt-2'>
              <img
                src={imagePreview}
                alt='Image Preview'
                style={{ maxWidth: '300px', marginTop: '10px' }}
              />
            </div>
          )}
          <Button type='submit'>Submit</Button>
        </form>
      </Form>
      {error && (
        <p className='text-[16px] font-medium text-red-600 mt-4'>
          Error: {error}
        </p>
      )}
    </>
  )
}

export default EditProfile
