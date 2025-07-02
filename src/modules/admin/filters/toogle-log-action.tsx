'use client'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/modules/shared/components/ui/select'

export function ToogleLogAction() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  const currentLimit = searchParams.get('logAction') || 'all'

  function handleOrder(term: string) {
    const params = new URLSearchParams(searchParams)
    if (term) {
      params.set('logAction', term)
    } else {
      params.delete('logAction')
    }
    params.set('page', '1')
    replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return (
    <Select onValueChange={handleOrder} defaultValue={currentLimit}>
      <SelectTrigger className="max-w-40 w-full h-12">
        <span>Acción: </span>
        <SelectValue />
      </SelectTrigger>
      <SelectContent position="popper" sideOffset={10} hideWhenDetached>
        <SelectItem value="all">Todos</SelectItem>
        <SelectItem value="UPDATE">Creado</SelectItem>
        <SelectItem value="CREATE">Actualizado</SelectItem>
        <SelectItem value="DELETE">Removido</SelectItem>
      </SelectContent>
    </Select>
  )
}
