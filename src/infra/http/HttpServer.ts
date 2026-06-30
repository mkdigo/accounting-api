import Fastify, {
  FastifyInstance,
  FastifyReply,
  HookHandlerDoneFunction,
} from 'fastify';
import cors from '@fastify/cors';
import fastifyCookie from '@fastify/cookie';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';

import { env } from '@/env';
import { Exception } from '@/Exception';
import { Router } from './Router/Router';

export type TServer = FastifyInstance;

interface RequestConfig {
  Body?: any;
  Params?: any;
  Query?: any;
}

export type TRequest<T extends RequestConfig = any> = {
  body: T['Body'] extends undefined ? any : T['Body'];
  params: T['Params'] extends undefined ? any : T['Params'];
  query: T['Query'] extends undefined ? any : T['Query'];
  auth?: {
    tokenId: string;
    user: {
      id: string;
    };
  };
  headers: {
    authorization?: string;
  };
  cookies?: {
    refreshToken?: string;
  };
};

export type TReply = FastifyReply;

export type TDone = HookHandlerDoneFunction;

export class HttpServer {
  readonly server: TServer;

  constructor() {
    this.server = Fastify({
      logger: env.LOGGER,
    });
  }

  public async run(): Promise<void> {
    // Plugins Register
    await this.pluginsRegister();

    // Declare routes
    const router = new Router();
    this.server.register(router.routes);

    // Error Handler
    this.server.setErrorHandler(function (error: any, request, reply) {
      if (request.raw.destroyed)
        return reply.code(499).send({ message: 'Client Closed Request' });
      if (env.NODE_ENV === 'development') console.log(error);
      if (error instanceof Error && (error as any).validation) {
        const errors: Record<string, string[]> = {};

        for (const issue of (error as any).validation) {
          Object.assign(errors, {
            [issue.instancePath.replace('/', '')]: [issue.message],
          });
        }

        return reply.code(400).send({
          message: 'Validation error',
          errors,
        });
      }

      if (error instanceof Exception) {
        return reply.code(error.code).send({
          message: error.message,
          errors: error.errors,
        });
      }

      this.log.error(error);

      reply
        .code(500)
        .send({ message: error.message || 'Internal server error.' });
    });

    // Run
    this.server.listen({ port: env.APP_PORT }, (err, address) => {
      console.log(`Server running on port ${env.APP_PORT}`);
      if (err) {
        this.server.log.error(err);
        console.error(err);
        process.exit(1);
      }
    });
  }

  private async pluginsRegister() {
    this.server.register(cors, {
      origin: env.APP_CORS_ORIGIN,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    });

    this.server.register(fastifyCookie, {
      secret: env.APP_SECRET,
    });

    const isDev = env.NODE_ENV !== 'production';

    if (isDev) {
      // 1. Register the Swagger Generator
      await this.server.register(fastifySwagger, {
        openapi: {
          info: {
            title: 'Powerlifting API',
            description: 'Powerlifting API documentation',
            version: '1.0.0',
          },
          servers: [{ url: `http://localhost:${env.APP_PORT}` }],
          components: {
            securitySchemes: {
              bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                description: 'Insira o token JWT',
              },
            },
          },
        },
        transform: jsonSchemaTransform,
      });

      // 2. Register the UI Web Interface
      await this.server.register(fastifySwaggerUi, {
        routePrefix: '/documentation',
        uiConfig: {
          docExpansion: 'full',
          deepLinking: false,
        },
      });
    }

    this.server.setValidatorCompiler(validatorCompiler);
    this.server.setSerializerCompiler(serializerCompiler);

    this.server.ready();
  }
}
