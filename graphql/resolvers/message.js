// eslint-disable-next-line import/named
import { withFilter, PubSub } from 'graphql-subscriptions';
import { requireAuth } from '../../controller/auth';

const pubsub = new PubSub();

const NEW_CHANNEL_MESSAGE = 'NEW_CHANNEL_MESSAGE';

export default {
  Subscription: {
    commentAdded: {
      subscribe: withFilter(
        () => pubsub.asyncIterator('commentAdded'),
        (payload, args) => payload.channelId === args.channelId,
      ),
    },
  },
  Message: {
    user: (
      { user, userId }, args, { models },
    ) => {
      if (user) {
        return user;
      }
      return models.User.findOne(
        {
          where: { id: userId },
          raw: true,
        },
      );
    },
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
        const message = await models.Message.create({
          ...args,
          userId: user.id,
        });
        const asyncFunc = async () => {
          const currentUser = await models.User.findOne({
            where: {
              id: user.id,
            },
          });

          await pubsub.publish(NEW_CHANNEL_MESSAGE, {
            channelId: args.channelId,
            newChannelMessage: {
              ...message.dataValues,
              user: currentUser.dataValues,
            },
          });
        };
        await asyncFunc();

        return true;
      } catch (e) {
        return false;
      }
    },
  },
};
