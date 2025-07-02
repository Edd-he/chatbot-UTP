type LogDetails<T = Record<string, any>> = {
  before?: T
  after?: T
}

export type Log<T = Record<string, any>> = {
  id: number
  number: number
  created_at: string
  user_id: string
  action: string
  entity: string
  entity_id: string
  details?: LogDetails<T> | null
}
