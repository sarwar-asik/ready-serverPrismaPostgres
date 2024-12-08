"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Auth_route_1 = require("../modules/AUTH/Auth.route");
const Users_route_1 = require("../modules/Users/Users.route");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: '/user',
        routes: Users_route_1.userRoutes,
    },
    {
        path: '/auth',
        routes: Auth_route_1.authRoutes,
    },
];
moduleRoutes.forEach(route => router.use(route.path, route.routes));
exports.default = router;
