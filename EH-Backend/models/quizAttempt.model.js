// models/quizAttempt.model.js
module.exports = (sequelize, Sequelize) => {
    const QuizAttempt = sequelize.define("QuizAttempts", {
      quiz_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Quizzes',
          key: 'id'
        }
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      score: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      time_taken: {
        type: Sequelize.INTEGER, // in seconds
        allowNull: false
      },
      completed_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      mentor_feedback: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      mentor_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id'
        }
      }
    });
  
    return QuizAttempt;
  };