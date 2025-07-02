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
  modules_access: z.array(z.string()).optional(),
})

export const userCreateSchema = baseSchema
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  })
  .refine(
    (data) =>
      data.role === 'SUPER_ADMIN' ||
      (data.modules_access && data.modules_access.length > 0),
    {
      message: 'Debe seleccionar al menos un módulo si el rol es administrador',
      path: ['modules_access'],
    },
  )

export const userEditSchema = baseSchema
  .omit({
    password: true,
    confirmPassword: true,
  })
  .refine(
    (data) =>
      data.role === 'SUPER_ADMIN' ||
      (data.modules_access && data.modules_access.length > 0),
    {
      message: 'Debe seleccionar al menos un módulo si el rol es administrador',
      path: ['modules_access'],
    },
  )
