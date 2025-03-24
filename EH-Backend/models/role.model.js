module.exports = (sequelize, Sequelize) => {
  const Role = sequelize.define("Roles", {
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    description: {
      type: Sequelize.STRING,
      allowNull: false
    },
    role_status: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        isIn: [['ENABLED', 'DISABLED']]
      }
    },
  });

  return Role;
};
