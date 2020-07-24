// eslint-disable-next-line import/named
import { requireAuth } from '../../controller/auth';

export default {
  Message: {
    user: (
      { userId }, args, { models },
    ) => models.User.findOne(
      { where: { id: userId }, raw: true },
    ),
  },
  Query: {
    message: requireAuth.createResolver(
      async (parent, { channelId }, { models }) => models.Message.findAll({
        order: [['createdAt', 'ASC']],
        where: { channelId },
        raw: true,
      }),
    ),
  },
  Mutation: {
    createMessage: async (parent, args, { models, user }) => {
      try {
        await models.Message.create({
          ...args,
          userId: user.id,
        });
        return true;
      } catch (e) {
        return false;
      }
    },
  },
};
