import Link from 'next/link'
import { IoAddCircleOutline } from 'react-icons/io5'

import {
  SearchByQuery,
  ToogleLimit,
  ToogleStatus,
} from '@/modules/admin/filters'
import DocumentsTbl from '@/modules/admin/documents/documents-tbl'
import { Button } from '@/modules/shared/components/ui/button'

type SearchParams = {
  query?: string
  page?: string
  limit?: string
  status?: string
}

type Props = {
  searchParams: Promise<SearchParams>
}
export default async function Page({ searchParams }: Props) {
  const { query, page, status, limit } = await searchParams
  const queryValue = query || ''
  const currentPage = Number(page) || 1
  const statusValue = status || 'all'
  const limitValue = Number(limit) || 10

  return (
    <>
      <section className="w-full flex items-end justify-between max-sm:flex-col-reverse gap-3">
        <div className="space-y-2 max-sm:w-full">
          <SearchByQuery className="sm:w-96 " />
          <ToogleLimit />
          <ToogleStatus />
        </div>

        <Button asChild>
          <Link
            href={'/admin/documents/create'}
            className="max-sm:w-full flex gap-2 "
          >
            <IoAddCircleOutline size={22} /> Agregar Documento
          </Link>
        </Button>
      </section>

      <DocumentsTbl
        page={currentPage}
        limit={limitValue}
        query={queryValue}
        status={statusValue}
      />
    </>
  )
}
