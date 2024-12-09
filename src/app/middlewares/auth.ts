import { User } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';
import config from '../../config';
import ApiError from '../../errors/ApiError';
import { jwtHelpers } from '../../helpers/jwtHelpers';
import prisma from '../../shared/prisma';

const auth =
  (...requiredRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      //get authorization token
      const token = req.headers.authorization;
      if (!token) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized');
      }
      // verify token
      let verifiedUser = null;

      verifiedUser = jwtHelpers.verifyToken(token, config.jwt.secret as Secret);

      req.user = verifiedUser; // role  , userid

      // role diye guard korar jnno
      if (requiredRoles.length && !requiredRoles.includes(verifiedUser.role)) {
        throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
      }
      const existUser:User | any= await prisma.user.findUnique({
        where: {
          id: verifiedUser.id,
        },
      });
      if (!existUser) { 
        throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
      }
      if(!existUser.is_active){
        throw new ApiError(httpStatus.NOT_FOUND, 'User is not active'); 
      }
      if(!existUser.is_verified){
        throw new ApiError(httpStatus.NOT_FOUND, 'User is not verified'); 
      }

      const changeTime = existUser?.pass_changed_at
      const iatTime = verifiedUser?.iat
      if(changeTime && iatTime && changeTime > iatTime){
       throw new ApiError(httpStatus.FORBIDDEN, 'Password changed after login');
      }

      next();
    } catch (error) {
      next(error);
    }
  };

export default auth;
