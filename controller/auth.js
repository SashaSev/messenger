import jwt from 'jsonwebtoken';
import _ from 'lodash';
import bcrypt from 'bcryptjs';

const createToken = async (user, SECRET, refreshSECRTET) => {
  const token = await jwt.sign(
    {
      user: _.pick(user, ['id', 'username']),
    },
    SECRET,
    {
      expiresIn: '1h',
    },
  );
  const refreshToken = await jwt.sign(
    {
      user: _.pick(user, ['id']),
    },
    refreshSECRTET,
    {
      expiresIn: '7d',
    },
  );
  return [token, refreshToken];
};

export const refreshTokens = async (
  token,
  refreshToken,
  models,
  SECRET,
  SECRET2,
) => {
  let userId = null;
  try {
    const { user } = jwt.decode(refreshToken);
    userId = user.id;
  } catch (e) {
    return {};
  }
  if (!userId) {
    return {};
  }

  const user = await models.User.findOne({ where: { id: userId }, raw: true });
  if (!user) {
    return {};
  }
  const refreshSecret = user.password + SECRET2;
  try {
    await jwt.verify(refreshToken, refreshSecret);
  } catch (e) {
    return {};
  }
  const [newToken, newRefreshToken] = await createToken(
    user,
    SECRET,
    refreshSecret,
  );
  return {
    token: newToken,
    refreshToken: newRefreshToken,
    user,
  };
};

export const Login = async (
  email,
  password,
  models,
  SECRET,
  refreshSECRTET,
) => {
  const user = await models.User.findOne({ where: { email }, raw: true });
  if (!user) {
    return {
      ok: false,
      errors: [{ path: 'email', message: 'Wrong email' }],
    };
  }
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return {
      ok: false,
      errors: [{ path: 'password', message: 'Wrong password' }],
    };
  }
  const refreshTokenSecret = user.password + refreshSECRTET;

  const [token, refreshToken] = await createToken(
    user,
    SECRET,
    refreshTokenSecret,
  );

  return {
    ok: true,
    token,
    refreshToken,
  };
};

const createResolver = (resolver) => {
  const baseResolver = resolver;
  baseResolver.createResolver = (childResolver) => {
    const newResolver = async (parent, args, context, info) => {
      await resolver(parent, args, context, info);
      return childResolver(parent, args, context, info);
    };
    return createResolver(newResolver);
  };
  return baseResolver;
};

export const requireAuth = createResolver((parent, args, { user }) => {
  if (!user || !user.id) {
    throw new Error('Not Authenticated');
  }
});
