/* eslint-disable no-undef */
import { HTTP_METHOD } from 'next/dist/server/web/http'
import { useState } from 'react'

export function useSendRequest<T>(
  url: string,
  method: HTTP_METHOD,
  auth?: string,
  isFormData: boolean = false,
) {
  const [loading, setLoading] = useState(false)

  const sendRequest = async (
    payload: any = {},
  ): Promise<{ data?: T; error?: string }> => {
    setLoading(true)

    try {
      const headers: HeadersInit = {
        ...(auth && { Authorization: `Bearer ${auth}` }),
      }

      if (!isFormData) {
        headers['Content-Type'] = 'application/json'
      }

      const res = await fetch(url, {
        method: method,
        headers,
        body: isFormData ? payload : JSON.stringify(payload),
      })

      const result = await res.json()

      if (!res.ok) {
        const message = parseErrorMessage(result.message)
        return { error: message }
      }

      return { data: result }
    } catch (e: any) {
      const message = e?.message || 'Error desconocido'
      return { error: message }
    } finally {
      setLoading(false)
    }
  }

  return { sendRequest, loading }
}

function parseErrorMessage(msg: unknown): string {
  if (Array.isArray(msg)) return msg[0]
  if (typeof msg === 'string') return msg
  return 'Error desconocido'
}
