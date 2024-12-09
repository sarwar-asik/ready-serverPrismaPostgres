import { z } from 'zod';
const signUp = z.object({
  body: z.object({
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
      .max(20, 'Password must not exceed 20 characters'),
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
