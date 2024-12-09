
import { z } from 'zod';
const updateProfile = z.object({
  full_name: z
    .string({
      required_error: 'Full name is required',
    })
    .optional(),
  user_name: z
    .string({
      required_error: 'Username is required',
    })
    .optional(),
  email: z
    .string({
      required_error: 'Email is required',
    })
    .email('Invalid email format'),
  self_pronoun: z
    .enum(['he', 'she', 'they'], {
      required_error: 'Self identity must be either "he", "she", or "they"',
    })
    .optional(),
  date_of_birth: z
    .string({
      required_error: 'Date of birth is required',
    })
    .optional(),
  password: z
    .string({
      required_error: 'Password is required',
    })
    .min(6, 'Password must be at least 6 characters long')
    .max(30, 'Password must not exceed 20 characters'),
})

const createAdmin = z.object({
  body: z.object({
    name: z.string({
      required_error: 'name is Required.',
    }),
    password: z.string({ required_error: 'password is Required.' }),
    email: z.string({ required_error: 'email is Required.' }),
    contact: z.string({ required_error: 'contact is Required.' }),
    img: z.string({ required_error: 'img is Required.' }),
    role: z.string({ required_error: 'role is Required.' }),
  }),
});


export const UsersValidation = {  updateProfile,createAdmin };


