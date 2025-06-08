import RunsTbl from '@/modules/admin/runs/runs-tbl'
import {
  SearchByName,
  ToogleLimit,
  ToogleRunStatus,
} from '@/modules/admin/filters'

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
          <SearchByName className="sm:w-96 " />
          <ToogleLimit />
          <ToogleRunStatus />
        </div>
      </section>

      <RunsTbl
        page={currentPage}
        limit={limitValue}
        query={queryValue}
        status={statusValue}
      />
    </>
  )
}
