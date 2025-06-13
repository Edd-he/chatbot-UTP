import Link from 'next/link'
import { IoAddCircleOutline } from 'react-icons/io5'

import UserTbl from '@/modules/admin/users/users-tbl'
import { Button } from '@/modules/shared/components/ui/button'
import {
  SearchByName,
  ToogleLimit,
  ToogleStatus,
} from '@/modules/admin/filters'

type SearchParams = {
  query?: string
  page?: string
  limit?: string
  error?: string
}

type Props = {
  searchParams: Promise<SearchParams>
}
export default async function Page({ searchParams }: Props) {
  const { query, page, error, limit } = await searchParams
  const queryValue = query || ''
  const currentPage = Number(page) || 1
  const statusValue = error || 'all'
  const limitValue = Number(limit) || 10

  return (
    <>
      <section className="w-full flex items-end justify-between max-sm:flex-col-reverse gap-3">
        <div className="space-y-2 max-sm:w-full">
          <SearchByName className="sm:w-96 " />
          <ToogleLimit />
          <ToogleStatus />
        </div>

        <Button asChild>
          <Link
            href={'/admin/users/create'}
            className="max-sm:w-full flex gap-2 "
          >
            <IoAddCircleOutline size={22} /> Agregar Usuario
          </Link>
        </Button>
      </section>

      <UserTbl
        page={currentPage}
        limit={limitValue}
        query={queryValue}
        status={statusValue}
      />
    </>
  )
}
