import jwt from 'jsonwebtoken';
import { TokenPayload } from '../types';

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'hirehub_access_secret_default_2026';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'hirehub_refresh_secret_default_2026';

export const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_ACCESS_SECRET, {
    expiresIn: '1h',
  });
};

export const generateRefreshToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: '7d',
  });
};

export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, JWT_ACCESS_SECRET) as TokenPayload;
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  return jwt.verify(token, JWT_REFRESH_SECRET) as TokenPayload;
};
