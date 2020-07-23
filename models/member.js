export default (sequelize, DataTypes) => {
  const Member = sequelize.define(
    'member',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
    },
  );
  return Member;
};
