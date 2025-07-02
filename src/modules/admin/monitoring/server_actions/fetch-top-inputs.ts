import { BACKEND_URL } from '@/lib/constants'
export type InputsData = {
  number: number
  question: string
}
export async function fetchTopInputs(): Promise<InputsData[]> {
  try {
    const res = await fetch(BACKEND_URL + '/monitoring/get-top-inputs', {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    if (!res.ok) throw new Error('Error al cargar los de los inputs')
    return res.json()
  } catch (e) {
    console.error((e as Error).message)
    return []
  }
}
