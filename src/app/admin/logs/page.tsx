import LogsTbl from '@/modules/admin/logs/logs-tbl'
import { ToogleLimit } from '@/modules/admin/filters'
import { ToogleLogAction } from '@/modules/admin/filters/toogle-log-action'

type SearchParams = {
  query?: string
  page?: string
  limit?: string
  logAction?: string
}

type Props = {
  searchParams: Promise<SearchParams>
}
export default async function Page({ searchParams }: Props) {
  const { page, limit, logAction } = await searchParams
  const logActionValue = logAction || 'all'
  const currentPage = Number(page) || 1
  const limitValue = Number(limit) || 10

  return (
    <>
      <section className="w-full flex items-end justify-between max-sm:flex-col-reverse gap-3">
        <div className="space-y-2 max-sm:w-full w-50">
          <ToogleLimit />
          <ToogleLogAction />
        </div>
      </section>

      <LogsTbl
        page={currentPage}
        limit={limitValue}
        logAction={logActionValue}
      />
    </>
  )
}
