// models/quizAttemptAnswer.model.js
module.exports = (sequelize, Sequelize) => {
    const QuizAttemptAnswer = sequelize.define("QuizAttemptAnswers", {
      attempt_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'QuizAttempts',
          key: 'id'
        }
      },
      question_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Questions',
          key: 'id'
        }
      },
      option_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Options',
          key: 'id'
        }
      },
      is_correct: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      }
    });
  
    return QuizAttemptAnswer;
  };