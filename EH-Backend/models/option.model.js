// option.model.js
module.exports = (sequelize, Sequelize) => {
    const Option = sequelize.define("Options", {
      question_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Questions',
          key: 'id'
        }
      },
      option_text: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      is_correct: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      }
    });
  
    return Option;
  };