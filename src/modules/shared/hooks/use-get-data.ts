import { useState, useEffect } from 'react'

import { parseErrorHttpMessage } from '@/lib/http/parse-error-http'

export function useGetData<T>(url: string, auth?: string) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const refresh = () => {
    setRefreshKey((prevKey) => prevKey + 1)
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            ...(auth ? { Authorization: `Bearer ${auth}` } : {}),
          },
        })

        if (!response.ok) {
          const errorBody = await response.json()
          console.warn(errorBody)
          const message = parseErrorHttpMessage(errorBody.message)
          throw new Error(message)
        }

        const json = await response.json()
        setData(json)
      } catch (e: unknown) {
        if (e instanceof Error) setError(e.message || 'Error desconocido')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [url, refreshKey, auth])

  return { setData, data, loading, error, refresh }
}
