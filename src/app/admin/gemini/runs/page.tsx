import RunsTbl from '@/modules/admin/runs/runs-tbl'
import {
  SearchByQuery,
  ToogleLimit,
  ToogleRunStatus,
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
  const errorValue = error || 'all'
  const limitValue = Number(limit) || 10

  return (
    <>
      <section className="w-full flex items-end justify-between max-sm:flex-col-reverse gap-3">
        <div className="space-y-2 max-sm:w-full">
          <SearchByQuery
            className="sm:w-96 "
            placeholder="Buscar por id de conversacion"
          />
          <ToogleLimit />
          <ToogleRunStatus />
        </div>
      </section>

      <RunsTbl
        page={currentPage}
        limit={limitValue}
        query={queryValue}
        error={errorValue}
      />
    </>
  )
}
