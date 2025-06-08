'use client'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/modules/shared/components/ui/select'

export function ToogleLimit() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  const currentLimit = searchParams.get('limit') || '10'

  function handleOrder(term: string) {
    const params = new URLSearchParams(searchParams)
    if (term) {
      params.set('limit', term)
    } else {
      params.delete('limit')
    }
    params.set('page', '1')
    replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return (
    <Select onValueChange={handleOrder} defaultValue={currentLimit}>
      <SelectTrigger className="max-w-40 w-full h-12">
        <span>Limite: </span>
        <SelectValue />
      </SelectTrigger>
      <SelectContent position="popper" sideOffset={10} hideWhenDetached>
        <SelectItem value="10">10</SelectItem>
        <SelectItem value="15">15</SelectItem>
        <SelectItem value="25">25</SelectItem>
      </SelectContent>
    </Select>
  )
}
