import { fastifyCors } from '@fastify/cors'
import fastifyMultipart from '@fastify/multipart'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import { fastify } from 'fastify'
import {
  hasZodFastifySchemaValidationErrors,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import { exportUploadsRoute } from './routes/export-uploads'
import { getUploadsRoute } from './routes/get-uploads'
import { healthCheckRoute } from './routes/health-check'
import { uploadImageRoute } from './routes/upload-image'
import { transformSwaggerSchema } from './transform-swagger-schema'

const server = fastify({
  logger: {
    ...(process.env.NODE_ENV === 'development' && {
      transport: {
        targets: [
          {
            target: 'pino-pretty',
            level: 'error',
            options: {
              name: 'dev-terminal',
              colorize: true,
              levelFirst: true,
              include: 'level,time',
              translateTime: 'yyyy-mm-dd HH:MM:ss Z',
            },
          },
        ],
      },
    }),
  },
})

server.setValidatorCompiler(validatorCompiler)
server.setSerializerCompiler(serializerCompiler)

// Error handler global
server.setErrorHandler((error, request, reply) => {
  // Erros esperados a aplicação deve tratar
  if (hasZodFastifySchemaValidationErrors(error)) {
    reply.status(400).send({
      message: 'Validation error',
      issues: error.validation,
    })
  }

  // Erros inesperados a aplicação envia para ferramentas de monitoramento
  console.log(error)

  return reply.status(500).send({ message: 'Internal server error' })
})

server.register(fastifyCors, {
  origin: '*',
})

server.register(fastifyMultipart)
server.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Upload Server',
      version: '1.0.0',
    },
  },
  transform: transformSwaggerSchema,
})

server.register(fastifySwaggerUi, {
  routePrefix: '/docs',
})

server.register(uploadImageRoute)
server.register(getUploadsRoute)
server.register(exportUploadsRoute)
server.register(healthCheckRoute)

server.listen({ port: 3333, host: '0.0.0.0' }).then(() => {
  server.log.info('Server is running on port 3333')
})
