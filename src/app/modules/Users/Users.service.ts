/* eslint-disable no-unused-vars */
import { Prisma, Role, User } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { IUserFilterRequest } from './User.interface';
import { UserSearchableField } from './UserConstant';

const createAdmin = async (data: User): Promise<User> => {
  const result = await prisma.user.create({
    data,
  });

  return result;
};
const getProfile = async (authUser: {
  id?: string;
  email: string;
  role: string;
}): Promise<User | null> => {
  const { id } = authUser;
  const userResult = await prisma.user.findUnique({
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
};

const getAllUsers = async (
  filters: IUserFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<User[]>> => {
  // !for pagination
  const { page, limit, skip } = paginationHelpers.calculatePagination(options);

  //   ! for filters

  const { searchTerm, ...filtersData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: UserSearchableField.map(field => ({
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
          equals: (filtersData as any)[key],
        },
      })),
    });
  }

  // for andCondition for where

  const whereCondition: Prisma.UserWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.user.findMany({
    where: whereCondition,
    skip,
    take: limit,

    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: 'desc',
          },
  });
  const total = await prisma.user.count();
  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};
const updateProfile = async (
  authUser: {
    id?: string;
    email: string;
    role: string;
  },
  updateData: Partial<User>
): Promise<User | null> => {
  const { email, id } = authUser;
  // console.log(email, 'email...', updateData);
  if (updateData.role || updateData.password) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      'You can not update role or password '
    );
  }
  const userResult = await prisma.user.update({
    where: {
      id,
    },
    data: updateData,
  });

  return userResult;
};

const deleteByIdFromDB = async (id: string): Promise<User> => {
  const result = await prisma.user.delete({
    where: {
      id,
    },
  });

  return result;
};

const getSingleData = async (id: string): Promise<User | null> => {
  const result = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  return result;
};

const updateUser = async (
  id: string,
  updateData: Partial<User>
): Promise<User | null> => {
  // console.log(id,"and",updateData);
  const isSuperAdmin = await getSingleData(id) as any;

  // console.log("🚀 ~ file: Users.service.ts:153 ~ isSuperAdmin:", isSuperAdmin)

  if(isSuperAdmin&&isSuperAdmin?.role === Role.super_admin){
    throw new ApiError(httpStatus.EXPECTATION_FAILED,"You can not update super admin")
  }

  const userResult = await prisma.user.update({
    where: {
      id,
    },
    data: updateData,
  });

  return userResult;
};

export const UsersService = {
  createAdmin,
  getProfile,
  updateProfile,
  getAllUsers,
  deleteByIdFromDB,
  getSingleData,
  updateUser,
};
