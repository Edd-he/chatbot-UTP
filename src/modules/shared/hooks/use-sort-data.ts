import { useState } from 'react'

type SortOrder = 'asc' | 'desc'

type SortConfig<T> = {
  key: keyof T
  order: SortOrder
}

export function useSortData<T>(initialKey: keyof T) {
  const [sortConfig, setSortConfig] = useState<SortConfig<T>>({
    key: initialKey,
    order: 'asc',
  })

  const sortData = (data: T[] | undefined): T[] | undefined => {
    if (!data) return undefined

    const sorted = [...data].sort((a, b) => {
      const aValue = a[sortConfig.key]
      const bValue = b[sortConfig.key]

      if (aValue! < bValue!) return sortConfig.order === 'asc' ? -1 : 1
      if (aValue! > bValue!) return sortConfig.order === 'asc' ? 1 : -1
      return 0
    })

    return sorted
  }

  const handleSort = (key: keyof T) => {
    const isSameKey = sortConfig.key === key
    const newOrder: SortOrder =
      isSameKey && sortConfig.order === 'asc' ? 'desc' : 'asc'
    setSortConfig({ key, order: newOrder })
  }

  return {
    sortConfig,
    handleSort,
    sortData,
  }
}
