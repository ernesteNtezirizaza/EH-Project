const swaggerJSDoc = require('swagger-jsdoc');
const dotenv = require("dotenv");

dotenv.config();

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'EH Backend API',
      version: '1.0.0',
      description: 'API documentation'
    },
    servers: [
      {
        url: `${process.env.BACKEND_URL}/api/v1`
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer'
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            username: { type: 'string' },
            email: { type: 'string', format: 'email' },
            password: { type: 'string' },
            roleId: { type: 'integer' },
            image: { type: 'string' }
          },
        },
        Role: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            description: { type: 'string' },
            role_status: { type: 'string' }
          },
        },
      },
    },
  },
  apis: ['./routes/*.js'],
};

const specs = swaggerJSDoc(options);
module.exports = specs;
