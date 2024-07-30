"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersValidation = void 0;
const zod_1 = require("zod");
const updateProfile = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({
            required_error: 'name is Required.',
        }).optional(),
        email: zod_1.z.string({ required_error: 'email is Required.' }).optional(),
        contact: zod_1.z.string({ required_error: 'contact is Required.' }).optional(),
        img: zod_1.z.string({ required_error: 'img is Required.' }).optional(),
    }),
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
