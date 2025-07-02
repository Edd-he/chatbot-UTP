'use client'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/modules/shared/components/ui/select'

export function ToogleConversationStatus() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  const currentLimit = searchParams.get('conversationStatus') || 'all'

  function handleOrder(term: string) {
    const params = new URLSearchParams(searchParams)
    if (term) {
      params.set('conversationStatus', term)
    } else {
      params.delete('conversationStatus')
    }
    params.set('page', '1')
    replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return (
    <Select onValueChange={handleOrder} defaultValue={currentLimit}>
      <SelectTrigger className="max-w-40 w-full h-12">
        <span>Estado: </span>
        <SelectValue />
      </SelectTrigger>
      <SelectContent position="popper" sideOffset={10} hideWhenDetached>
        <SelectItem value="all">Todos</SelectItem>
        <SelectItem value="ACTIVE">Activas</SelectItem>
        <SelectItem value="CLOSED">Cerradas</SelectItem>
      </SelectContent>
    </Select>
  )
}
