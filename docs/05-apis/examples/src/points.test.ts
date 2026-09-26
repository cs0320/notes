import { describe, expect, test } from 'vitest'
import fc from 'fast-check'
import { pointsResponseSchema } from './points-schema'
import { pointsResponseArb } from './points-arbitrary'
import livePoints from './fixtures/points-providence.json' with { type: 'json' }

/**
 * Smoke test to confirm that these are valid schemas/arbitraries.
 */
describe('points response', () => {
  test('schema accepts a real NWS points response', () => {
    const result = pointsResponseSchema.safeParse(livePoints)
    expect(result.error?.issues ?? []).toEqual([])
  })

  test('schema accepts everything the arbitrary generates', () => {
    fc.assert(
      fc.property(pointsResponseArb, (response) => {
        expect(pointsResponseSchema.safeParse(response).success).toBe(true)
      }),
    )
  })
})
