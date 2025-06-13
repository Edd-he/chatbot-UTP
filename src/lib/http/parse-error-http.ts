export function parseErrorHttpMessage(msg: unknown): string {
  if (Array.isArray(msg)) return msg[0]
  if (typeof msg === 'string') return msg
  return 'Error desconocido'
}
