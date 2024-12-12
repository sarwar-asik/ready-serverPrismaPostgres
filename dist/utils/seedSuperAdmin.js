"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedSuperAdmin = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
const client_1 = require("@prisma/client");
const config_1 = __importDefault(require("../config"));
const prisma_1 = __importDefault(require("../shared/prisma"));
const seedSuperAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingSuperAdmin = yield prisma_1.default.user.findFirst({
            where: {
                role: client_1.Role.super_admin,
            },
        });
        // console.log(config.superAdmin,'ssssssssssss')
        if (existingSuperAdmin) {
            // console.log('Super admin account already exists');
            return;
        }
        yield prisma_1.default.user.create({
            data: {
                email: config_1.default.superAdmin.email,
                password: yield bcrypt_1.default.hash(config_1.default.superAdmin.password, Number(config_1.default.bycrypt_salt_rounds)),
                role: 'super_admin',
                is_active: true,
                is_verified: true
            },
        });
        console.log('Super admin account created successfully');
    }
    catch (error) {
        console.error('Error creating super admin account:', error.message);
    }
});
exports.seedSuperAdmin = seedSuperAdmin;
