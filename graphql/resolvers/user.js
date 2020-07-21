import { Login } from "../../controller/auth";
import { formatError } from "../../controller/formatError";

export default {
  Query: {
    getUser: (parent, { id }, { models }) => models.User.findOne({ id }),
    allUsers: (parent, args, { models }) => models.User.findAll(),
  },
  Mutation: {
    // eslint-disable-next-line max-len
    login: (parent, { email, password }, { models, SECRET, refreshSECRET }) =>
      Login(email, password, models, SECRET, refreshSECRET),
    register: async (parent, args, { models }) => {
      try {
        const user = await models.User.create(args);
        return {
          ok: true,
          user,
        };
      } catch (e) {
        return {
          ok: false,
          errors: formatError(e, models),
        };
      }
    },
  },
};
