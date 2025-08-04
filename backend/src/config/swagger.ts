import swaggerJsdoc from 'swagger-jsdoc';
import { SwaggerDefinition } from 'swagger-jsdoc';

const swaggerDefinition: SwaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'OoNt Order Tracker API',
    version: '1.0.0',
    description: 'A comprehensive order tracking API built with Node.js, Express, and TypeScript',
    contact: {
      name: 'OoNt Assignment',
      email: 'support@oont.com'
    }
  },
  servers: [
    {
      url: 'http://localhost:3001/api',
      description: 'Development server'
    }
  ],
  components: {
    schemas: {
      Order: {
        type: 'object',
        required: ['id', 'userId', 'product', 'quantity', 'amount', 'status', 'createdAt', 'updatedAt'],
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            description: 'Unique identifier for the order',
            example: '84c75335-5b07-4921-a4d9-2b9b0efcd5cd'
          },
          userId: {
            type: 'string',
            description: 'ID of the user who placed the order',
            example: 'alice.smith'
          },
          product: {
            type: 'string',
            description: 'Name of the product ordered',
            example: 'Wireless Headphones'
          },
          quantity: {
            type: 'integer',
            minimum: 1,
            description: 'Number of items ordered',
            example: 2
          },
          amount: {
            type: 'number',
            format: 'float',
            minimum: 0,
            description: 'Total amount for the order',
            example: 299.99
          },
          status: {
            type: 'string',
            enum: ['pending', 'completed', 'cancelled'],
            description: 'Current status of the order',
            example: 'pending'
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Order creation timestamp',
            example: '2025-01-15T10:30:00.000Z'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Order last update timestamp',
            example: '2025-01-15T10:30:00.000Z'
          }
        }
      },
      CreateOrderRequest: {
        type: 'object',
        required: ['userId', 'product', 'quantity', 'amount'],
        properties: {
          userId: {
            type: 'string',
            description: 'ID of the user placing the order',
            example: 'alice.smith'
          },
          product: {
            type: 'string',
            description: 'Name of the product to order',
            example: 'Wireless Headphones'
          },
          quantity: {
            type: 'integer',
            minimum: 1,
            description: 'Number of items to order',
            example: 2
          },
          amount: {
            type: 'number',
            format: 'float',
            minimum: 0,
            description: 'Total amount for the order',
            example: 299.99
          }
        }
      },
      UpdateOrderStatusRequest: {
        type: 'object',
        required: ['status'],
        properties: {
          status: {
            type: 'string',
            enum: ['pending', 'completed', 'cancelled'],
            description: 'New status for the order',
            example: 'cancelled'
          }
        }
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          error: {
            type: 'string',
            description: 'Error type',
            example: 'Order not found'
          },
          message: {
            type: 'string',
            description: 'Detailed error message',
            example: 'No order found with ID: invalid-id'
          }
        }
      },
      HealthResponse: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            example: 'OK'
          },
          timestamp: {
            type: 'string',
            format: 'date-time',
            example: '2025-01-15T10:30:00.000Z'
          },
          uptime: {
            type: 'number',
            description: 'Server uptime in seconds',
            example: 3600
          }
        }
      }
    },
    parameters: {
      OrderId: {
        name: 'id',
        in: 'path',
        required: true,
        description: 'UUID of the order',
        schema: {
          type: 'string',
          format: 'uuid'
        },
        example: '84c75335-5b07-4921-a4d9-2b9b0efcd5cd'
      },
      StatusFilter: {
        name: 'status',
        in: 'query',
        required: false,
        description: 'Filter orders by status',
        schema: {
          type: 'string',
          enum: ['pending', 'completed', 'cancelled']
        },
        example: 'pending'
      },
      UserFilter: {
        name: 'userId',
        in: 'query',
        required: false,
        description: 'Filter orders by user ID',
        schema: {
          type: 'string'
        },
        example: 'alice.smith'
      }
    }
  }
};

const options = {
  definition: swaggerDefinition,
  apis: ['./src/routes/*.ts'],
};

const specs = swaggerJsdoc(options);

export default specs;