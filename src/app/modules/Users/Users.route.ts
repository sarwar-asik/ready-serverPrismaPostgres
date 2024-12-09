import { NextFunction, Request, Response, Router } from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { UsersController } from './Users.controller';
import { UsersValidation } from './Users.validation';
import { uploadFile } from '../../middlewares/fileUploader';
import { uploadLocalFileURL } from '../../../helpers/upload.helper';
const router = Router();

router.get(
  '/profile',
  auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  UsersController.userProfile
);
router.get(
  '/',
  // auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  UsersController.getAllUsers
);

router.patch(
  '/update',
  uploadFile.single('img'),
  (req: Request | any, res: Response, next: NextFunction) => {
    if (!req?.body?.data) {
      req.body.data = {};
    }
    else {
      req.body = UsersValidation.updateProfile.parse(JSON.parse(req.body.data));
    }

    if (req?.file) {
      uploadLocalFileURL(req, 'single', 'img');
    }

    return UsersController.updateProfile(req, res, next);
  }
  // auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  // validateRequest(UsersValidation.updateProfile),
  // UsersController.updateProfile
);

router.put(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validateRequest(UsersValidation.updateProfile),
  UsersController.updateUser
);

router.post(
  '/create-admin',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validateRequest(UsersValidation.createAdmin),
  UsersController.createAdmin
);

router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  UsersController.deleteByIdFromDB
);

router.get(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  UsersController.getSingleDataById
);

export const userRoutes = router;
