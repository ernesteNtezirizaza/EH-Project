const swaggerJSDoc = require('swagger-jsdoc');
const dotenv = require("dotenv");

dotenv.config();

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'EH Backend API',
      version: '1.0.0',
      description: 'Comprehensive API documentation for Quiz Management System'
    },
    servers: [
      {
        url: "https://eh-backend-j67n.onrender.com/api/v1"
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        },
      },
      schemas: {
        // User Schema
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            username: { type: 'string' },
            email: { type: 'string', format: 'email' },
            password: { type: 'string' },
            roleId: { type: 'integer' },
            image: { type: 'string' }
          },
        },
        // Role Schema
        Role: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            description: { type: 'string' },
            role_status: { type: 'string' }
          },
        },
        // Quiz Schema
        Quiz: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            title: { type: 'string' },
            description: { type: 'string' },
            admin_id: { type: 'integer' },
            duration: { type: 'integer' },
            status: { 
              type: 'string', 
              enum: ['DRAFT', 'ACTIVE', 'INACTIVE'] 
            }
          },
        },
        // Question Schema
        Question: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            quiz_id: { type: 'integer' },
            points: { type: 'integer' },  
            question_text: { type: 'string' },
            question_type: { 
              type: 'string', 
              enum: ['MULTIPLE_CHOICE'] 
            }
          },
        },
        // Option Schema
        Option: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            question_id: { type: 'integer' },
            option_text: { type: 'string' },
            is_correct: { type: 'boolean' }
          },
        },
        // Create Quiz Request Body
        CreateQuizRequest: {
          type: 'object',
          properties: {
            title: { type: 'string', required: true },
            description: { type: 'string' },
            duration: { type: 'integer', required: true },
            questions: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  question_text: { type: 'string', required: true },
                  options: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        option_text: { type: 'string', required: true },
                        is_correct: { type: 'boolean', default: false }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./routes/*.js'],
};

const specs = swaggerJSDoc(options);
module.exports = specs;
