import fc from 'fast-check'
import type { PointsResponse } from './points-schema'

/**
 * Generate a PointsResponse (i.e., an object matching that schema).
 * The pipeline is:
 *   - Build an arbitrary for a record with grid id, x, and y (via fc.record). 
 *   - Build an arbitrary that will take a randomly-generated object from the 
 *     prior arbitrary, and covert it to match the real shape of an API response.
 * These get tied together via `.chain`. 
 */
export const pointsResponseArb: fc.Arbitrary<PointsResponse> = fc
  .record({
    // There are more grid IDs, but keeping it narrow here until I can find 
    // API documentation that lists all grid ID strings.
    gridId: fc.constant('BOX'),
    // Likewise, I don't know what valid coordinates look like within a grid ID.
    gridX: fc.integer({ min: 0, max: 200 }),
    gridY: fc.integer({ min: 0, max: 200 }),
  })
  .chain(({ gridId, gridX, gridY }) =>
    fc.record({
      properties: fc.record({
        gridId: fc.constant(gridId),
        gridX: fc.constant(gridX),
        gridY: fc.constant(gridY),
        // Manufacturing this based on manually-tested examples.
        forecast: fc.constant(
          `https://api.weather.gov/gridpoints/${gridId}/${gridX},${gridY}/forecast`,
        ),
      }),
    }),
  )
