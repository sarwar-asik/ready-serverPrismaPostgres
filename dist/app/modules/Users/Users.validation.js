"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersValidation = void 0;
const zod_1 = require("zod");
const updateProfile = zod_1.z.object({
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
const createAdmin = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({
            required_error: 'name is Required.',
        }),
        password: zod_1.z.string({ required_error: 'password is Required.' }),
        email: zod_1.z.string({ required_error: 'email is Required.' }),
        contact: zod_1.z.string({ required_error: 'contact is Required.' }),
        img: zod_1.z.string({ required_error: 'img is Required.' }),
        role: zod_1.z.string({ required_error: 'role is Required.' }),
    }),
});
exports.UsersValidation = { updateProfile, createAdmin };
