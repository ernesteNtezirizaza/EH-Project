const { sequelize } = require("../config/db.config.js");  // Import sequelize instance from db.config.js

const Sequelize = require("sequelize");

// Use the imported sequelize instance instead of manually creating a new one
const db = {};

// Attach Sequelize to db object for easy reference
db.Sequelize = Sequelize;
db.sequelize = sequelize;  // Use the sequelize instance from db.config.js

// Import models (make sure to pass sequelize and Sequelize to them)
db.User = require("../models/user.model.js")(sequelize, Sequelize);
db.Role = require("../models/role.model.js")(sequelize, Sequelize);

// Setting up relationships between models
db.Role.hasMany(db.User, { foreignKey: 'roleId' });
db.User.belongsTo(db.Role, { foreignKey: 'roleId' });

module.exports = db;
