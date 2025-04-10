import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'

export const healthCheckRoute: FastifyPluginAsyncZod = async server => {
  server.get('/health', async (request, reply) => {
    request.log.info('Health check')
    return await reply.status(200).send({ message: 'Tudo OK agora no ECS' })
  })
}
