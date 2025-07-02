import { z } from 'zod'

export const documentSchema = z.object({
  file: z
    .any()
    .refine((files) => files?.length > 0, 'Debes seleccionar un archivo.')
    .refine(
      (files) => files?.[0]?.size <= 10 * 1024 * 1024,
      'El archivo debe ser menor a 10MB.',
    )
    .refine(
      (files) => files?.[0]?.type === 'application/pdf',
      'Solo se permiten archivos en formato PDF.',
    ),
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
  tags: z
    .array(z.string())
    .min(1, {
      message: 'Debes agregar al menos un tag.',
    })
    .max(10, {
      message: 'No puedes agregar más de 10 tags.',
    }),
  is_active: z.boolean().default(true),
})
