import Link from 'next/link'
import { Button } from '@shared/components/ui/button'

export default function NotFound() {
  return (
    <div className="size-full flex-center flex-col gap-5">
      <h1 className="text-3xl font-bold">UTP IA</h1>
      <h2 className="text-xl font-light">
        Recurso no inexistento o no disponible
      </h2>

      <Button asChild className="text-lg w-40">
        <Link href={'/admin/monitoring'}>Regresar</Link>
      </Button>
    </div>
  )
}
