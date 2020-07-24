import { formatError } from '../../controller/formatError';
import { requireAuth } from '../../controller/auth';

export default {
  Query: {
    allTeams: requireAuth.createResolver(
      async (parent, args, { models, user }) => models.Team.findAll({
        where: { owner: user.id },
        raw: true,
      }),
    ),
    inviteTeam: requireAuth.createResolver(
      async (parent, args, { models, user }) => models.sequelize.query('select * from members on id = team_id where user_id = ? ', {
        replacements: [user.id],
        model: models.Team,
      }),
    ),
    // inviteTeam: requireAuth.createResolver(
    //   async (parent, args, { models, user }) => models.Team.findAll({
    //     include: [
    //       {
    //         model: models.User,
    //         where: { id: user.id },
    //       },
    //     ],
    //     raw: true,
    //   }),
    // ),

  },
  Mutation: {
    createTeam: async (parent, args, { models, user }) => {
      try {
        const response = await models.sequelize.transaction(async () => {
          const team = await models.Team.create({
            ...args,
            owner: user.id,
          });
          await models.Channel.create({
            name: 'general',
            public: true,
            teamId: team.id,
          });
          return team;
        });

        return {
          ok: true,
          team: response,
        };
      } catch (e) {
        return {
          ok: false,
          errors: formatError(e, models),
        };
      }
    },
    addTeamMember: async (parent, { email, teamId }, { models, user }) => {
      try {
        const teamPromise = models.Team.findOne({
          where: { id: teamId },
          raw: true,
        });
        const UserToAddPromise = models.User.findOne({
          where: { email },
          raw: true,
        });
        const [team, userToAdd] = await Promise.all([teamPromise, UserToAddPromise]);
        if (team.owner !== user.id) {
          return {
            ok: false,
            error: [{
              path: 'email',
              message: 'You cannot add member Team',
            }],
          };
        }
        if (!userToAdd) {
          return {
            ok: false,
            error: [{
              path: 'email',
              message: 'Could not find user this email',
            }],
          };
        }
        await models.Member.create({
          userId: userToAdd.id,
          teamId,
        });
        return {
          ok: true,
        };
      } catch (err) {
        return {
          ok: false,
          errors: formatError(err, models),
        };
      }
    },
  },
  Team: {
    channels: ({ id }, args, { models }) => models.Channel.findAll({ where: { teamId: id } }),
  },
};
