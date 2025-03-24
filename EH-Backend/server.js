const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./swagger.config');
const { connectDB } = require('./config/db.config');

dotenv.config();

const allowedOrigins = process.env.FRONTEND_URL;

var corsOptions = {
  origin: allowedOrigins,
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// Connect to the database
connectDB();

const db = require("./models");

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to EH Backend application." });
});

// routes
const roleRoutes = require('./routes/role.routes');
const userRoutes = require('./routes/user.routes');
const authRoutes = require('./routes/auth.routes');
app.use("/uploads", express.static("uploads"));
app.use('/api/v1', roleRoutes, userRoutes, authRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

const PORT = process.env.PORT;

// Sync database and start the server
db.sequelize.sync()
  .then(() => {
    // Log successful database synchronization
    console.log('Database synced successfully!');
    
    // Start the server and listen on the defined port
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    // Log error if database synchronization fails
    console.error('Failed to sync database:', err);
  });