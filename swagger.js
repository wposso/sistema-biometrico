const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Sofidya API",
      version: "1.0.0",
      description: "API de asistencia, geocerca y device binding"
    },
    servers: [
      {
        url: "http://localhost:3000/api/engine/v1/",
        description: "Servidor local"
      }
    ],
    components: {
      securitySchemes: {
        sessionId: {
          type: "apiKey",
          in: "cookie",
          name: "connect.sid"
        }
      }
    },
    security: [{ sessionId: [] }]
  },
  apis: ["./src/routes/*.js", "./src/models/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = setupSwagger;