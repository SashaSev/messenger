import { formatError } from '../../controller/formatError';

export default {
  Mutation: {
    createChannel: async (parent, args, { models, user }) => {
      try {
        const teams = await models.Team.findOne({ where: { id: args.teamId }, raw: true });
        if (!teams.owner !== user.id) {
          return {
            ok: false,
            error: [
              {
                path: 'name',
                message: 'You have to be owner Team',
              },
            ],
          };
        }
        const channel = await models.Channel.create(args);
        return {
          ok: true,
          channel,
        };
      } catch (e) {
        return {
          ok: false,
          error: formatError(e, models),
        };
      }
    },
  },
};
