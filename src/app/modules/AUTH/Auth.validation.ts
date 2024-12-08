import { z } from 'zod';
const signUp = z.object({
  body: z.object({
    name: z
      .string({
        required_error: 'name is Required.',
      })
      .optional(),
    password: z.string({ required_error: 'password is Required.' }),
    email: z.string({ required_error: 'email is Required.' }),

    img: z.string({ required_error: 'img is Required.' }).optional(),
  }),
});

const loginUser = z.object({
  body: z.object({
    email: z.string({
      required_error: 'email is required ',
    }),
    password: z.string({
      required_error: 'password is required ',
    }),
  }),
});
const changePassword = z.object({
  body: z.object({
    oldPassword: z.string({
      required_error: 'oldPassword is required ',
    }),
    newPassword: z.string({
      required_error: 'newPassword is required ',
    }),
  }),
});
const forgotPassword = z.object({
  body: z.object({
    email: z.string({
      required_error: 'email is required ',
    }),
  }),
});
const resetPassword = z.object({
  body: z.object({
    email: z.string({
      required_error: 'email is required ',
    }),
    newPassword: z.string({
      required_error: 'newPassword is required ',
    }),
  }),
});

const refreshTokenZodSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: 'Refresh Token is required',
    }),
  }),
});

export const AuthValidation = {
  signUp,
  loginUser,
  changePassword,
  forgotPassword,
  resetPassword,
  refreshTokenZodSchema,
};
