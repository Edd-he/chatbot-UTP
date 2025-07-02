export const fetcher = async (url: string, token?: string) => {
  const res = await fetch(url, {
    headers: {
      ...(token && {
        Authorization: `Bearer ${token}`,
      }),
    },
  })

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    const error = new Error(errorData?.message || 'Error en la solicitud')
    throw error
  }

  return res.json()
}
