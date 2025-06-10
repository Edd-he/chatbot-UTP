import { BACKEND_URL } from '@/lib/constants'
export type TokensData = {
  month: string
  totalTokens: number
}
export async function fetchTokenssData(): Promise<TokensData[]> {
  try {
    const res = await fetch(BACKEND_URL + '/monitoring/get-tokens-month', {
      headers: {
        'Content-Type': 'application/json',
      },
      next: {
        revalidate: 60,
      },
    })
    if (!res.ok) throw new Error('Error al cargar los  de los tokens')
    return res.json()
  } catch (e) {
    console.error((e as Error).message)
    return []
  }
}
