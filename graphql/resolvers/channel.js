import { formatError } from '../../controller/formatError';

export default {
  Mutation: {
    createChannel: async (parent, args, { models }) => {
      try {
        const channel = await models.Channel.create(args);
        return {
          ok: true,
          channel,
        };
      } catch (e) {
        return {
          ok: false,
          error: formatError(e),
        };
      }
    },
  },
};
