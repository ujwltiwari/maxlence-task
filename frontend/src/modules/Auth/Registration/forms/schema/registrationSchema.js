import { z } from 'zod'
import { emailRegex } from '@/helpers/regex.js'

export const registrationFormSchema = z.object({
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

  password: z.string().min(6, {
    message: 'Password must be at least 6 characters',
  }),
})
