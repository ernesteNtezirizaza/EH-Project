module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("Users", {
    firstName: {
      type: Sequelize.STRING,
      allowNull: false
    },
    lastName: {
      type: Sequelize.STRING,
      allowNull: false
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    roleId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'Roles',
        key: 'id'
      },
    },
    image: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    isVerified: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    verificationToken: {
      type: Sequelize.STRING
    },
    resetEmailToken: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    resetEmailExpires: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    resetPasswordToken: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    resetPasswordExpires: {
      type: Sequelize.DATE,
      allowNull: true,
    },
  });

  User.associate = models => {
    User.belongsTo(models.Role, {
      foreignKey: 'roleId'
    });
  };

  return User;
};
