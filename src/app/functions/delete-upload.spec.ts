import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { isLeft, isRight, unwrapEither } from '@/infra/shared/either'
import { makeUpload } from '@/test/factories/make-upload'
import { eq } from 'drizzle-orm'
import { describe, expect, it } from 'vitest'
import { deleteUpload } from './delete-upload'
import { UploadNotFound } from './errors/upload-not-found'

describe('Delete upload', () => {
  it('should be able to delete an upload', async () => {
    const upload = await makeUpload()

    const sut = await deleteUpload({
      id: upload.id,
    })

    expect(isRight(sut)).toBe(true)

    const uploadOnDatabase = await db.query.uploads.findFirst({
      where: eq(schema.uploads.id, upload.id),
    })

    expect(uploadOnDatabase).toBeUndefined()
  })

  it('should not be able to delete a non-existing upload', async () => {
    const sut = await deleteUpload({
      id: 'non-existing-id',
    })

    expect(isLeft(sut)).toBe(true)
    expect(unwrapEither(sut)).toBeInstanceOf(UploadNotFound)
  })
})
