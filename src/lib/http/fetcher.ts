export const fetcher = async (url: string) => {
  const res = await fetch(url)

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    const error = new Error(errorData?.message || 'Error en la solicitud')

    throw error.message
  }

  return res.json()
}
