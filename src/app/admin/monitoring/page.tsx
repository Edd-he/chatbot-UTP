import { Suspense } from 'react'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@shared/components/ui/card'

import TokensGrowthChart from '@/modules/admin/monitoring/charts/tokens-growth-chart'
import RunsDataLinearChart from '@/modules/admin/monitoring/charts/runs-data-linear-chart'
import { fetchRunsData } from '@/modules/admin/monitoring/actions/fetch-runs-analytics'
import { fetchTokenssData } from '@/modules/admin/monitoring/actions/fetch-tokens-month'
import TopInputsList from '@/modules/admin/monitoring/components/top-inputs-list'
import { fetchTopInputs } from '@/modules/admin/monitoring/actions/fetch-top-inputs'

export default async function Page() {
  const runs = await fetchRunsData()
  const tokens = await fetchTokenssData()
  const inputs = await fetchTopInputs()
  return (
    <>
      <section className="relative w-full space-y-5">
        <Card>
          <CardHeader>
            <CardTitle>Ejecuciones del año</CardTitle>
          </CardHeader>
          <CardContent className="p-2 relative">
            <Suspense>
              <RunsDataLinearChart chartData={runs} />
            </Suspense>
          </CardContent>
        </Card>
      </section>

      <section className="relative w-full flex gap-5 max-lg:flex-col">
        <Card className="w-[40%] max-lg:w-full">
          <CardHeader>
            <CardTitle>Top preguntas más relevantes</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense>
              <TopInputsList data={inputs} />
            </Suspense>
          </CardContent>
          <CardFooter>Ultimos 6 meses</CardFooter>
        </Card>

        <Card className="w-[60%] max-lg:w-full">
          <CardHeader>
            <CardTitle>Crecimiento de tokens usados</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense>
              <TokensGrowthChart chartData={tokens} />
            </Suspense>
          </CardContent>
          <CardFooter>Ultimos 6 meses</CardFooter>
        </Card>
      </section>
    </>
  )
}
