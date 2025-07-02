import { BACKEND_URL } from '@/lib/constants'
export type RunsData = {
  date: string
  ok: number
  error: number
}
export async function fetchRunsData(): Promise<RunsData[]> {
  try {
    const res = await fetch(BACKEND_URL + '/monitoring/get-runs-analytics', {
      headers: {
        'Content-Type': 'application/json',
      },
      next: {
        revalidate: 60,
      },
    })
    if (!res.ok) throw new Error('Error al cargar los  de las ejecuciones')
    return res.json()
  } catch (e) {
    console.error((e as Error).message)
    return []
  }
}
