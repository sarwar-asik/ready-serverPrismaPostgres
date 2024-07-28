// import { Users } from '@prisma/client';

import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { UsersService } from "./Users.service";

const insertDB = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  const result = await UsersService.insertDB(data)

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Successfully Users',
    data: result,
  });
});

export const UsersController = {insertDB};
