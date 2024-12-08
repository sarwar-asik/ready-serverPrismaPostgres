
import { z } from 'zod';
const updateProfile = z.object({
  body: z.object({
    name: z.string({
      required_error: 'name is Required.',
    }).optional(),
    email: z.string({ required_error: 'email is Required.' }).optional(),
    contact: z.string({ required_error: 'contact is Required.' }).optional(),
    img: z.string({ required_error: 'img is Required.' }).optional(),
  }),
});

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


