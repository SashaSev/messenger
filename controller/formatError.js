import _ from "lodash";

export  const formatError = (e, models) => {

    if (e instanceof models.Sequelize.ValidationError) {
        return e.errors.map(x => _.pick(x, ["path", "message"]))
    }
    return [{path: "name", message: "Something went wrong"}]
}