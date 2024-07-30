import express from 'express';
import { authRoutes } from '../modules/AUTH/Auth.route';
import { UsersRoutes } from '../modules/Users/Users.route';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/user',
    routes: UsersRoutes,
  },
  {
    path: '/auth',
    routes: authRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.routes));
export default router;
