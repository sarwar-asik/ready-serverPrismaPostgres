import { User } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import config from '../../../config';
import { tokenName } from '../../../constants/jwt.token';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { AuthService } from './Auth.service';

const SignUp = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  const result = await AuthService.signUp(data);

  const cookieOptions = {
    secure: config.env === 'production',
    httpOnly: true,
  };

  if (result) {
    res.cookie(tokenName, result?.accessToken, cookieOptions);
    // eslint-disable-next-line no-unused-vars
    const { password, ...userData } = result.data;

    sendResponse<Partial<User>>(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: 'Successfully SignUp',
      data: userData,
    });
  }
});

const login = catchAsync(async (req: Request, res: Response) => {
  const { ...loginData } = req.body;

  // console.log(loginData,"asdfsd");

  const result = await AuthService.authLogin(loginData);

  const { refreshToken, ...others } = result;

  const cookieOption = {
    secure: config.env === 'production',
    httpOnly: true,
  };

  res.cookie('refreshToken', refreshToken, cookieOption);

  res.json({
    success: true,
    statusCode: 200,
    message: 'User sign In successfully!',
    data: others,
  });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const authUser = req.user as any;
  const passData = req.body;
  const result = await AuthService.changePassword(authUser, passData);

  sendResponse<Partial<User>>(res, {
    statusCode: httpStatus.OK,
    message: 'Updated your password',
    success: true,
    data: result,
  });
});

const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const passData = req.body;
  await AuthService.forgotPassword(passData);

  sendResponse<Partial<User>>(res, {
    statusCode: httpStatus.OK,
    message: 'Check your email',
    success: true,
  });
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const passData = req.body;
  const token = req.headers.authorization || 'token';
  await AuthService.resetPassword(passData, token);

  sendResponse<Partial<User>>(res, {
    statusCode: httpStatus.OK,
    message: 'Account recovered ',
    success: true,
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  const result = await AuthService.refreshToken(refreshToken);

  // set refresh token into cookie

  // const cookieOptions = {
  //   secure: config.env === 'production',
  //   httpOnly: true,
  // };

  // res.cookie('refreshToken', refreshToken, cookieOptions);

  sendResponse<any>(res, {
    statusCode: 200,
    success: true,
    message: 'User logged in successfully !',
    data: result,
  });
});
export const AuthController = {
  SignUp,
  login,
  changePassword,
  forgotPassword,
  resetPassword,
  refreshToken,
};
