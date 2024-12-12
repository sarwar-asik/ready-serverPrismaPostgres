"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidation = void 0;
const zod_1 = require("zod");
const signupData = zod_1.z.object({
    full_name: zod_1.z
        .string({
        required_error: 'Full name is required',
    })
        .optional(),
    user_name: zod_1.z
        .string({
        required_error: 'Username is required',
    })
        .optional(),
    email: zod_1.z
        .string({
        required_error: 'Email is required',
    })
        .email('Invalid email format'),
    self_pronoun: zod_1.z
        .enum(['he', 'she', 'they'], {
        required_error: 'Self identity must be either "he", "she", or "they"',
    })
        .optional(),
    date_of_birth: zod_1.z
        .string({
        required_error: 'Date of birth is required',
    })
        .optional(),
    password: zod_1.z
        .string({
        required_error: 'Password is required',
    })
        .min(6, 'Password must be at least 6 characters long')
        .max(30, 'Password must not exceed 20 characters'),
});
const signUp = zod_1.z.object({
    body: signupData
});
const loginUser = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({
            required_error: 'email is required ',
        }),
        password: zod_1.z.string({
            required_error: 'password is required ',
        }),
    }),
});
const changePassword = zod_1.z.object({
    body: zod_1.z.object({
        oldPassword: zod_1.z.string({
            required_error: 'oldPassword is required ',
        }),
        newPassword: zod_1.z.string({
            required_error: 'newPassword is required ',
        }),
    }),
});
const forgotPassword = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({
            required_error: 'email is required ',
        }),
    }),
});
const resetPassword = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({
            required_error: 'email is required ',
        }),
        newPassword: zod_1.z.string({
            required_error: 'newPassword is required ',
        }),
    }),
});
const refreshTokenZodSchema = zod_1.z.object({
    cookies: zod_1.z.object({
        refreshToken: zod_1.z.string({
            required_error: 'Refresh Token is required',
        }),
    }),
});
const verifySignUpOtp = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({
            required_error: 'email is required',
        }).email('Invalid email format'),
        otp: zod_1.z.string({
            required_error: 'OTP is required',
        }),
    }),
});
const resendOtp = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({
            required_error: 'Email is required',
        }).email('Invalid email format'),
    }),
});
exports.AuthValidation = {
    signupData,
    signUp,
    loginUser,
    changePassword,
    forgotPassword,
    resetPassword,
    refreshTokenZodSchema,
    verifySignUpOtp,
    resendOtp,
};
