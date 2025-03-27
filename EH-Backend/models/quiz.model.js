// quiz.model.js
module.exports = (sequelize, Sequelize) => {
    const Quiz = sequelize.define("Quizzes", {
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      admin_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      duration: {
        type: Sequelize.INTEGER, // duration in minutes
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('PUBLISHED','COMPLETED','REVIEWED'),
        defaultValue: 'PUBLISHED'
      },
      category: {
        type: Sequelize.STRING,
        allowNull: false
      }
    });
  
    return Quiz;
  };
  