import { z } from 'zod'

export const ChangePasswordSchema = z
  .object({
    newPassword: z.string().min(8, {
      message: 'La nueva contraseña debe tener al menos 8 caracteres',
    }),
  })
  .strict()
