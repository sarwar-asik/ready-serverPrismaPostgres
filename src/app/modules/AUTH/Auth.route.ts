import { Router } from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { AuthController } from './Auth.controller';
import { AuthValidation } from './Auth.validation';
const router = Router();

router.post(
  '/sign-up',
  validateRequest(AuthValidation.signUp),
  AuthController.SignUp
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
