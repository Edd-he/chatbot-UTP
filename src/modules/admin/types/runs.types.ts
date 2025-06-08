export type Run = {
  id: string
  number: number
  created_at: string
  is_run_successful: boolean
  model_llm: string
  latency: string
  tokens: number
  input: string
  output: string
  error: any
  conversation_id: string
}
