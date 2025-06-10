import Link from 'next/link'
import { Button } from '@shared/components/ui/button'

export default function NotFound() {
  return (
    <div className="w-screen h-screen bg-background flex-center flex-col gap-5">
      <h1 className="text-3xl font-bold">UTP AI</h1>
      <h2 className="text-xl font-light">Página no encontrada (404)</h2>

      <Button asChild className="text-lg w-40">
        <Link href={'/'}>Regresar</Link>
      </Button>
    </div>
  )
}
