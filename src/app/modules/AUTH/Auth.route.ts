import { NextFunction, Request, Response, Router } from 'express';
import httpStatus from 'http-status';
import { ENUM_USER_ROLE } from '../../../enums/user';
import ApiError from '../../../errors/ApiError';
import { uploadLocalFileURL } from '../../../helpers/upload.helper';
import auth from '../../middlewares/auth';
import { uploadFile } from '../../middlewares/fileUploader';
import validateRequest from '../../middlewares/validateRequest';
import { AuthController } from './Auth.controller';
import { AuthValidation } from './Auth.validation';
const router = Router();

router.post(
  '/sign-up',
  validateRequest(AuthValidation.signUp),
  AuthController.signUpUser
);

router.post(
    '/sign-up-form',
    uploadFile.single('profile_img'),
    (req: Request | any, res: Response, next: NextFunction) => {
      if (!req?.body?.data) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Data is required');
      }
      else {
        req.body = AuthValidation.signupData.parse(JSON.parse(req.body.data));
      }

      if (!req?.file) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Image is required');
      }
      else {
        uploadLocalFileURL(req, 'single', 'profile_img');
      }

      return AuthController.signUpUser(req, res, next);
    }
  );


router.post(
  '/verify-signup-otp',
  validateRequest(AuthValidation.verifySignUpOtp),
  AuthController.verifySignUpOtp
);

router.post(
  '/resend-otp',
  validateRequest(AuthValidation.resendOtp),
  AuthController.resendOtp
);

router.post(
  '/login',
  validateRequest(AuthValidation.loginUser),
  AuthController.login
);

router.patch(
  '/change-password',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.USER),
  validateRequest(AuthValidation.changePassword),
  AuthController.changePassword
);
router.post(
  '/forgot-password',
  validateRequest(AuthValidation.forgotPassword),
  AuthController.forgotPassword
);

router.post(
  '/reset-password',
  validateRequest(AuthValidation.resetPassword),
  AuthController.resetPassword
);

router.post(
  '/refresh-token',
  validateRequest(AuthValidation.refreshTokenZodSchema),
  AuthController.refreshToken
);

export const authRoutes = router;
