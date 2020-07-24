import jwt from 'jsonwebtoken';
import models from '../models';
import { refreshTokens } from '../controller/auth';

const { SECRET } = process.env;
const { refreshSECRET } = process.env;

// eslint-disable-next-line import/prefer-default-export
export const addUser = async (req, res, next) => {
  const token = req.headers['x-token'];
  if (token) {
    try {
      const { user } = await jwt.decode(token, SECRET);
      req.user = user;
    } catch (e) {
      const refreshToken = req.headers['x-token-refresh'];
      const newToken = await refreshTokens(
        token,
        refreshToken,
        models,
        SECRET,
        refreshSECRET,
      );
      if (newToken.token && newToken.refreshToken) {
        res.set(
          'Access-Control-Expose-Headers',
          'x-token',
          'x-token-refresh',
        );
        res.set('x-token', newToken.token);
        res.set('x-token-refresh', newToken.refreshToken);
      }
      req.user = newToken.user;
    }
  }
  next();
};
