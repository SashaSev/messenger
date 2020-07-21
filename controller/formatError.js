import _ from 'lodash';

// eslint-disable-next-line import/prefer-default-export
export const formatError = (e, models) => {
  if (e instanceof models.Sequelize.ValidationError) {
    return e.errors.map((x) => _.pick(x, ['path', 'message']));
  }
  return [{ path: 'name', message: 'Something went wrong' }];
};
