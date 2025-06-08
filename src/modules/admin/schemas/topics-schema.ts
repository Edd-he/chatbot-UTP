import { z } from 'zod'

export const topicSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: 'El nombre debe tener al menos 2 caracteres.',
    })
    .max(100, {
      message: 'El nombre no puede exceder 100 caracteres.',
    }),
  description: z
    .string()
    .min(10, {
      message: 'La descripción debe tener al menos 10 caracteres.',
    })
    .max(500, {
      message: 'La descripción no puede exceder 500 caracteres.',
    }),
  is_active: z.boolean().default(true),
})
