// question.model.js
module.exports = (sequelize, Sequelize) => {
    const Question = sequelize.define("Questions", {
      quiz_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Quizzes',
          key: 'id'
        }
      },
      question_text: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      points: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      question_type: {
        type: Sequelize.ENUM('MULTIPLE_CHOICE'),
        defaultValue: 'MULTIPLE_CHOICE'
      }
    });
  
    return Question;
  };
  