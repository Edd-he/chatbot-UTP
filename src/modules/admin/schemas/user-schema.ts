import { z } from 'zod'

const roles = ['ADMIN', 'SUPER_ADMIN']

const baseSchema = z.object({
  dni: z
    .string()
    .length(8, { message: 'El DNI debe tener 8 caracteres numéricos' })
    .regex(/^\d+$/, { message: 'El DNI debe contener solo números' }),
  email: z.string().email({ message: 'Correo electrónico inválido' }),
  role: z
    .string({
      required_error: 'Selecciona un rol',
      invalid_type_error: 'El rol debe ser un texto',
    })
    .refine((role) => roles.includes(role), {
      message: 'El rol no es válido',
    }),
  password: z
    .string()
    .min(8, { message: 'La contraseña debe tener al menos 8 caracteres' }),
  confirmPassword: z.string(),
  is_active: z.boolean({ message: 'El estado debe ser un valor booleano' }),
})

export const userCreateSchema = baseSchema.refine(
  (data) => data.password === data.confirmPassword,
  {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  },
)

export const userEditSchema = baseSchema.omit({
  password: true,
  confirmPassword: true,
})
