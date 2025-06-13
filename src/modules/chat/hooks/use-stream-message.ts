import { useState, useCallback } from 'react'

export function useStreamMessage(url: string) {
  const [text, setText] = useState('')
  const [finalText, setFinalText] = useState('')
  const [title, setTitle] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const startStream = useCallback(
    async (message: string, conversation_id: string) => {
      setText('')
      setLoading(true)
      setError('')

      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            conversation_id,
            message,
          }),
        })

        if (!res.ok) {
          const errorBody = await res.json()
          console.warn(errorBody)
          const message = errorBody.message?.[0] || 'Error desconocido'
          throw new Error(message)
        }

        if (!res.body)
          throw new Error('La respuesta no contiene un cuerpo válido.')

        const reader = res.body.getReader()
        const decoder = new TextDecoder('utf-8')

        let accumulatedText = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value, { stream: true })

          try {
            const json = JSON.parse(chunk)

            if (json?.title) {
              setTitle(json.title)
              continue
            }

            if (json?.message && !json.ok) {
              setError(json.message)
              break
            }
          } catch {
            accumulatedText += chunk
            setText(accumulatedText)
          }
        }

        setFinalText(accumulatedText)
      } catch (e: unknown) {
        if (e instanceof Error) setError(e.message || 'Error desconocido')
      } finally {
        setLoading(false)
      }
    },
    [url],
  )

  return {
    text,
    finalText,
    title,
    error,
    loading,
    startStream,
  }
}
