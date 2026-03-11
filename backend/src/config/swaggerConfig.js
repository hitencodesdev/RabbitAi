import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Sales Insight Automator API',
      version: '1.0.0',
      description: 'API for processing CSV/Excel sales data, generating AI-based summaries, and dispatching them via email.',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/routes/*.js'], // Files containing annotations
};

export const swaggerSpec = swaggerJsdoc(options);
