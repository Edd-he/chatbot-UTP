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
  modules_access: ModuleAccess[]
}

export type ModuleAccess =
  | 'monitoring'
  | 'topics'
  | 'documents'
  | 'logs'
  | 'gemini'
