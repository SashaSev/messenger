import { formatError } from "../../controller/formatError";
import { requireAuth } from "../../controller/auth";

export default {
  Query: {
    allTeams: requireAuth.createResolver(
      async (parent, args, { models, user }) =>
        await models.Team.findAll({
          where: { owner: user.id },
          raw: true,
        })
    ),
    // models.Team.findAll({ where: { owner: user.id } }, { raw: true })),
  },
  Mutation: {
    createTeam: async (parent, args, { models, user }) => {
      try {
        console.log(user.id);
        const team = await models.Team.create({
          ...args,
          owner: user.id,
        });
        await models.Channel.create({
          name: "general",
          public: true,
          teamId: team.id,
        });
        return {
          ok: true,
          team,
        };
      } catch (e) {
        console.log(e);
        return {
          ok: false,
          errors: formatError(e),
        };
      }
    },
  },
  Team: {
    channels: ({ id }, args, { models }) =>
      models.Channel.findAll({ where: { teamId: id } }),
  },
};
