import { Role, User } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { UserFilterableFields } from './UserConstant';
import { UsersService } from './Users.service';

const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const authUser = req.user as any;

  const data = req.body;
  console.log(authUser.role, 'and', data.role);

  if (authUser.role !== Role.super_admin && data.role === 'admin') {
    // console.log('yesssssss');
    throw new ApiError(httpStatus.NOT_ACCEPTABLE, 'You can not create admin');
  }

  const result = await UsersService.createAdmin(data);

  sendResponse<User>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Successfully created admin',
    data: result,
  });
});

const userProfile = catchAsync(async (req: Request, res: Response) => {
  const authUser = req.user as any;
  const result = await UsersService.getProfile(authUser);

  if (result) {
    // eslint-disable-next-line no-unused-vars
    const { password, ...profileData } = result;

    sendResponse<Partial<User>>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Successfully fetched User profile',
      data: profileData,
    });
  }
});

const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const authUser = req.user as any;
  const updateData = req.body;
  // console.log(updateData, 'update Profile data');

  const result = await UsersService.updateProfile(authUser, updateData);

  if (result) {
    sendResponse<Partial<User>>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Successfully updated User profile',
      data: result,
    });
  }
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  // console.log(req.query,'from getAll db controller');
  const filters = pick(req.query, UserFilterableFields);
  // ServiceFilterableFields (use it in filters )
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

  const result = await UsersService.getAllUsers(filters, options);

  sendResponse<User[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Successfully fetched Users Data',
    meta: result.meta,
    data: result?.data,
  });
});

const deleteByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await UsersService.deleteByIdFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User deleted successfully',
    data: result,
  });
});

const getSingleDataById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await UsersService.getSingleData(id);

  sendResponse<User>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Successfully get user Data `,
    data: result,
  });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const updateData = req.body;
  // console.log(updateData, 'update data');

  const result = await UsersService.updateUser(id, updateData);

  if (result) {
    sendResponse<Partial<User>>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Successfully updated User ',
      data: result,
    });
  }
});
export const UsersController = {
  createAdmin,
  userProfile,
  updateProfile,
  getAllUsers,
  deleteByIdFromDB,
  getSingleDataById,
  updateUser,
};
