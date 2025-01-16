import { randomUUID } from 'node:crypto'
import { Readable } from 'node:stream'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { isLeft, isRight, unwrapEither } from '@/infra/shared/either'
import { eq } from 'drizzle-orm'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import { InvalidFileFormat } from './errors/invalid-file-format'
import { uploadImage } from './upload-image'

describe('Upload image', () => {
  beforeAll(() => {
    vi.mock('@/infra/storage/upload-file-to-storage', () => {
      return {
        uploadFileToStorage: vi.fn().mockImplementation(() => {
          return {
            key: `${randomUUID()}.jpg`,
            url: 'http://localhost:3000/file.jpg',
          }
        }),
      }
    })
  })

  it('should be able to upload an image', async () => {
    const fileName = `${randomUUID()}.jpg`

    // system under test
    const sut = await uploadImage({
      fileName,
      contentType: 'image/jpg',
      contentStream: Readable.from(['test']),
    })

    expect(isRight(sut)).toBe(true)

    const result = await db
      .select()
      .from(schema.uploads)
      .where(eq(schema.uploads.name, fileName))

    expect(result).toHaveLength(1)
  })

  it('should not be able to upload an invalid file', async () => {
    const fileName = `${randomUUID()}.pdf`

    // system under test
    const sut = await uploadImage({
      fileName,
      contentType: 'document/pdf',
      contentStream: Readable.from(['test']),
    })

    expect(isLeft(sut)).toBe(true)
    expect(unwrapEither(sut)).toBeInstanceOf(InvalidFileFormat)
  })
})
