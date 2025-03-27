const { sequelize } = require("../config/db.config.js");
const Sequelize = require("sequelize");

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Existing models
db.User = require("../models/user.model.js")(sequelize, Sequelize);
db.Role = require("../models/role.model.js")(sequelize, Sequelize);

// New quiz-related models
db.Quiz = require("../models/quiz.model.js")(sequelize, Sequelize);
db.Question = require("../models/question.model.js")(sequelize, Sequelize);
db.Option = require("../models/option.model.js")(sequelize, Sequelize);
db.QuizAttempt = require("../models/quizAttempt.model.js")(sequelize, Sequelize);
db.QuizAttemptAnswer = require("../models/quizAttemptAnswer.model.js")(sequelize, Sequelize);

// Relationships
db.Role.hasMany(db.User, { foreignKey: 'roleId' });
db.User.belongsTo(db.Role, { foreignKey: 'roleId' });

// Quiz relationships
db.User.hasMany(db.Quiz, { foreignKey: 'admin_id', as: 'CreatedQuizzes' });
db.Quiz.belongsTo(db.User, { foreignKey: 'admin_id', as: 'Creator' });

db.Quiz.hasMany(db.Question, { foreignKey: 'quiz_id' });
db.Question.belongsTo(db.Quiz, { foreignKey: 'quiz_id' });

db.Question.hasMany(db.Option, { foreignKey: 'question_id' });
db.Option.belongsTo(db.Question, { foreignKey: 'question_id' });

// Add relationships
db.Quiz.hasMany(db.QuizAttempt, { foreignKey: 'quiz_id' });
db.QuizAttempt.belongsTo(db.Quiz, { foreignKey: 'quiz_id' });

db.User.hasMany(db.QuizAttempt, { foreignKey: 'user_id' });
db.QuizAttempt.belongsTo(db.User, { foreignKey: 'user_id', as: 'Student' });

db.QuizAttempt.hasMany(db.QuizAttemptAnswer, { foreignKey: 'attempt_id' });
db.QuizAttemptAnswer.belongsTo(db.QuizAttempt, { foreignKey: 'attempt_id' });

db.Question.hasMany(db.QuizAttemptAnswer, { foreignKey: 'question_id' });
db.QuizAttemptAnswer.belongsTo(db.Question, { foreignKey: 'question_id' });

db.Option.hasMany(db.QuizAttemptAnswer, { foreignKey: 'option_id' });
db.QuizAttemptAnswer.belongsTo(db.Option, { foreignKey: 'option_id' });

db.User.hasMany(db.QuizAttempt, { foreignKey: 'mentor_id' });
db.QuizAttempt.belongsTo(db.User, { foreignKey: 'mentor_id', as: 'Mentor' });

module.exports = db;