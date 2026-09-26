import z from 'zod'

export const pointsResponseSchema = z.object({
  properties: z.object({
    gridId: z.string(),
    gridX: z.number().int(),
    gridY: z.number().int(),
    forecast: z.url(),
  }),
})

export type PointsResponse = z.infer<typeof pointsResponseSchema>
