import { deleteUpload } from '@/app/functions/delete-upload'
import { isRight, unwrapEither } from '@/infra/shared/either'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

export const deleteUploadRoute: FastifyPluginAsyncZod = async server => {
  server.delete(
    '/uploads/:id',
    {
      schema: {
        summary: 'Delete an upload',
        tags: ['uploads'],
        params: z.object({
          id: z.string().uuid(),
        }),
        response: {
          204: z.void(),
          404: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params

      const result = await deleteUpload({
        id,
      })

      if (isRight(result)) {
        return reply.status(204).send()
      }

      const error = unwrapEither(result)

      switch (error.constructor.name) {
        case 'UploadNotFound':
          return reply.status(404).send({ message: error.message })
      }
    }
  )
}
