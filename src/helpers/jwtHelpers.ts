import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import config from '../config';

const createToken = (
  payload: Record<string, unknown>,
  secret: Secret,
  expireTime: string
): string => {
  // console.log(expireTime, 'expireTime'); // Log the expireTime to verify
  return jwt.sign(payload, secret, {
    expiresIn: expireTime,
  });
};

const verifyToken = (token: string, secret: Secret): JwtPayload => {
  return jwt.verify(token, secret) as JwtPayload;
};

const createPassResetToken = (payload: any) => {
  return jwt.sign(payload, config.jwt.secret as Secret, {
    algorithm: 'HS256',
    expiresIn: config.jwt.expires_in,
  });
};
export const jwtHelpers = {
  createToken,
  verifyToken,
  createPassResetToken,
};
