import {formatError} from "../../controller/formatError"
import {requireAuth} from "../../controller/auth";

export default {
    Mutation: {
        createTeam: requireAuth.createResolver(async (parent, args, {models, user}) => {
            try {
                await models.Team.create({...args, owner: user.id});
                return {
                    ok: true
                }
            } catch (e) {
                console.log(e);
                return {
                    ok: false,
                    errors: formatError(e)
                }
            }

        })
    }
}