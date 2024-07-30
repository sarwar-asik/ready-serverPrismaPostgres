"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidation = void 0;
const zod_1 = require("zod");
const signUp = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string({
            required_error: 'name is Required.',
        })
            .optional(),
        password: zod_1.z.string({ required_error: 'password is Required.' }),
        email: zod_1.z.string({ required_error: 'email is Required.' }),
        img: zod_1.z.string({ required_error: 'img is Required.' }).optional(),
    }),
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
exports.AuthValidation = {
    signUp,
    loginUser,
    changePassword,
    forgotPassword,
    resetPassword,
    refreshTokenZodSchema,
};
