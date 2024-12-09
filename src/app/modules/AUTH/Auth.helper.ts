import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import prisma from "../../../shared/prisma";
import { User } from "@prisma/client";
import bcrypt from 'bcrypt';
export const createActivationCode = () => {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
    return activationCode;
  };


export const checkIsValidOTP = async (payload: { code: string; email: string }) => {
    const user: User | null = await prisma.user.findUnique({
      where: {
        email: payload?.email,
      },
    });
  
    if (!user) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'User does not exist!');
    }
  
  
    if (!user.verify_code || !user.verify_expiration) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'OTP not found or already used');
    }
    // console.log(user);
    // console.log(user.verify_expiration, new Date());
    if (new Date(user.verify_expiration).getTime() <= new Date().getTime()) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'OTP has expired');
    }
  
    const isOTPMatch = await bcrypt.compare(payload?.code, user.verify_code as string);
    if (!isOTPMatch) {
      throw new ApiError(httpStatus.NOT_FOUND, 'OTP is not correct');
    }
  
    return { valid: true, user };
};