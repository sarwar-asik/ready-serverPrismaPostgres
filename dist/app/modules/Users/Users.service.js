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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
/* eslint-disable no-unused-vars */
const client_1 = require("@prisma/client");
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const UserConstant_1 = require("./UserConstant");
const createAdmin = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.user.create({
        data,
    });
    return result;
});
const getProfile = (authUser) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = authUser;
    const userResult = yield prisma_1.default.user.findUnique({
        where: {
            id,
        },
        // include: {
        //   bookings: true,
        //   usersCarts: true,
        //   payments: true,
        // },
    });
    // console.log(userResult);
    return userResult;
});
const getAllUsers = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    // !for pagination
    const { page, limit, skip } = paginationHelper_1.paginationHelpers.calculatePagination(options);
    //   ! for filters
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            OR: UserConstant_1.UserSearchableField.map(field => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive',
                },
            })),
        });
    }
    if (Object.keys(filtersData).length > 0) {
        andConditions.push({
            AND: Object.keys(filtersData).map(key => ({
                [key]: {
                    equals: filtersData[key],
                },
            })),
        });
    }
    // for andCondition for where
    const whereCondition = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = yield prisma_1.default.user.findMany({
        where: whereCondition,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? {
                [options.sortBy]: options.sortOrder,
            }
            : {
                createdAt: 'desc',
            },
    });
    const total = yield prisma_1.default.user.count();
    return {
        meta: {
            total,
            page,
            limit,
        },
        data: result,
    };
});
const updateProfile = (authUser, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, id } = authUser;
    // console.log(email, 'email...', updateData);
    if (updateData.role || updateData.password) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'You can not update role or password ');
    }
    const userResult = yield prisma_1.default.user.update({
        where: {
            id,
        },
        data: updateData,
    });
    return userResult;
});
const deleteByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.user.delete({
        where: {
            id,
        },
    });
    return result;
});
const getSingleData = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.user.findUnique({
        where: {
            id,
        },
    });
    return result;
});
const updateUser = (id, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(id,"and",updateData);
    const isSuperAdmin = yield getSingleData(id);
    // console.log("🚀 ~ file: Users.service.ts:153 ~ isSuperAdmin:", isSuperAdmin)
    if (isSuperAdmin && (isSuperAdmin === null || isSuperAdmin === void 0 ? void 0 : isSuperAdmin.role) === client_1.Role.super_admin) {
        throw new ApiError_1.default(http_status_1.default.EXPECTATION_FAILED, "You can not update super admin");
    }
    const userResult = yield prisma_1.default.user.update({
        where: {
            id,
        },
        data: updateData,
    });
    return userResult;
});
exports.UsersService = {
    createAdmin,
    getProfile,
    updateProfile,
    getAllUsers,
    deleteByIdFromDB,
    getSingleData,
    updateUser,
};
