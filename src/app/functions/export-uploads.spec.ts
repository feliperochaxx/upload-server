import exp from 'node:constants'
import { randomUUID } from 'node:crypto'
import * as upload from '@/infra/storage/upload-file-to-storage'
import { makeUpload } from '@/test/factories/make-upload'
import { describe, expect, it, vi } from 'vitest'
import { isRight, unwrapEither } from '../../infra/shared/either'
import { exportUploads } from './export-uploads'

const POSTGRES_TIMESTAMP_REGEX =
  /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}(\.\d+)?(\+\d{2}:\d{2}|Z|[+-]\d{2})?$/

describe('Export uploads', () => {
  it('should be able to export uploads', async () => {
    const uploadStub = vi
      .spyOn(upload, 'uploadFileToStorage')
      .mockImplementationOnce(async () => {
        return {
          url: 'http://example.com/file.csv',
          key: `${randomUUID()}.csv`,
        }
      })

    const namePattern = randomUUID()

    const upload1 = await makeUpload({ name: `${namePattern}.webp` })
    const upload2 = await makeUpload({ name: `${namePattern}.webp` })
    const upload3 = await makeUpload({ name: `${namePattern}.webp` })
    const upload4 = await makeUpload({ name: `${namePattern}.webp` })
    const upload5 = await makeUpload({ name: `${namePattern}.webp` })

    // system under test
    const sut = await exportUploads({
      searchQuery: namePattern,
    })

    const generatedCsvStream = uploadStub.mock.calls[0][0].contentStream

    const csvAsString = await new Promise<string>((resolve, reject) => {
      const chunks: Buffer[] = []

      generatedCsvStream.on('data', chunk => {
        chunks.push(chunk)
      })

      generatedCsvStream.on('end', () => {
        resolve(Buffer.concat(chunks).toString())
      })

      generatedCsvStream.on('error', reject)
    })

    const csvAsArray = csvAsString
      .trim()
      .split('\n')
      .map(line => line.split(','))

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut).reportUrl).toBe('http://example.com/file.csv')
    expect(csvAsArray).toEqual([
      ['ID', 'Name', 'URL', 'Uploaded at'],
      [
        upload1.id,
        upload1.name,
        upload1.remoteUrl,
        expect.stringMatching(POSTGRES_TIMESTAMP_REGEX),
      ],
      [
        upload2.id,
        upload2.name,
        upload2.remoteUrl,
        expect.stringMatching(POSTGRES_TIMESTAMP_REGEX),
      ],
      [
        upload3.id,
        upload3.name,
        upload3.remoteUrl,
        expect.stringMatching(POSTGRES_TIMESTAMP_REGEX),
      ],
      [
        upload4.id,
        upload4.name,
        upload4.remoteUrl,
        expect.stringMatching(POSTGRES_TIMESTAMP_REGEX),
      ],
      [
        upload5.id,
        upload5.name,
        upload5.remoteUrl,
        expect.stringMatching(POSTGRES_TIMESTAMP_REGEX),
      ],
    ])
  })
})
