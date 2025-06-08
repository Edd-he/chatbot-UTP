export type User = {
  id: string
  number: number
  created_at: string
  updated_at: string
  dni: string
  name: string
  last_name: string
  email: string
  role: 'ADMIN' | 'SUPER_ADMIN'
  is_active: boolean
}

export type UserFormData = {
  dni: string
  email: string
  role: 'ADMIN' | 'SUPER_ADMIN'
  is_active: boolean
  password: string
  confirmPassword?: string
}

export type UserEditFormData = {
  dni?: string
  email?: string
  role?: string
  is_active?: boolean
}
