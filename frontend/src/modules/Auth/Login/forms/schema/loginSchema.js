import { z } from 'zod'
import { emailRegex } from '@/helpers/regex.js'

export const loginFormSchema = z.object({
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
