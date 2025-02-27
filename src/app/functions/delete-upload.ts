import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { type Either, makeLeft, makeRight } from '@/infra/shared/either'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { UploadNotFound } from './errors/upload-not-found'

const deleteUploadInput = z.object({
  id: z.string(),
})

type DeleteUploadInput = z.input<typeof deleteUploadInput>

export async function deleteUpload(
  input: DeleteUploadInput
): Promise<Either<UploadNotFound, true>> {
  const { id } = deleteUploadInput.parse(input)

  const upload = await db.query.uploads.findFirst({
    where: eq(schema.uploads.id, id),
  })

  if (!upload) {
    return makeLeft(new UploadNotFound())
  }

  await db.delete(schema.uploads).where(eq(schema.uploads.id, id))

  return makeRight(true)
}
