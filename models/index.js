import Sequelize from 'sequelize';
// const sequelize = new Sequelize("config.database", "config.username", "config.password")
const sequelize = new Sequelize('slack', 'postgres', 'postgres', {
  dialect: 'postgres',
  underscored: true,
});

const models = {
  User: sequelize.import('./user'),
  Channel: sequelize.import('./channel'),
  Message: sequelize.import('./message'),
  Team: sequelize.import('./team'),
  Member: sequelize.import('./member'),
};
Object.keys(models).forEach((modelName) => {
  if ('associate' in models[modelName]) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

export default models;
