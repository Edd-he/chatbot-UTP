'use client'

import { useMemo } from 'react'
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from 'recharts'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@shared/components/ui/chart'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@shared/components/ui/dialog'
import { useMediaQuery } from '@shared/hooks/use-media-query'

import { RunsData } from '../actions/fetch-runs-analytics'

type InteractiveExecutionChartProps = {
  showYAxis?: boolean
  chartData: RunsData[]
}

const chartConfig: ChartConfig = {
  correctas: {
    label: 'ok',
    color: '#22c55e',
  },
  erroneas: {
    label: 'error',
    color: '#ef4444',
  },
}

export function InteractiveRunsChart({
  showYAxis,
  chartData,
}: InteractiveExecutionChartProps) {
  const data = useMemo(() => chartData, [])

  const minValue = useMemo(
    () => Math.min(...data.map((d) => Math.min(d.ok, d.error))),
    [data],
  )
  const maxValue = useMemo(
    () => Math.max(...data.map((d) => Math.max(d.ok, d.error))),
    [data],
  )

  return (
    <ChartContainer config={chartConfig} className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 0,
            right: 0,
            left: 10,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={21}
            tickFormatter={(value) => {
              const date = new Date(value)
              return date.toLocaleDateString('es', {
                month: 'short',
                day: 'numeric',
              })
            }}
          />
          {showYAxis && (
            <YAxis
              domain={[minValue * 0.9, maxValue * 1.1]}
              tickFormatter={(value) => `${Math.round(value)}`}
            />
          )}

          <ChartTooltip
            content={
              <ChartTooltipContent
                className="w-[180px]"
                labelFormatter={(value) => {
                  const date = new Date(value)
                  return date.toLocaleDateString('es', {
                    month: 'short',
                    day: 'numeric',
                  })
                }}
              />
            }
          />

          <Line
            type="monotone"
            dataKey="ok"
            stroke={chartConfig.correctas.color}
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="erroneas"
            stroke={chartConfig.erroneas.color}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

export default function RunsDataLinearChart({
  chartData,
}: InteractiveExecutionChartProps) {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const classNameChart = isMobile
    ? 'absolute w-[85vh] h-[85vw] top-1/2 -translate-y-[50%] left-1/2 -translate-x-[55%] rotate-90'
    : 'aspect-auto h-[500px] w-full '

  return (
    <>
      {isMobile ? (
        <Dialog>
          <DialogTrigger className=" w-full py-2 px-4">
            Ver Gráfica de Ejecuciones
          </DialogTrigger>
          <DialogContent className="left-0 top-0 translate-x-0 translate-y-0 w-full max-w-[100vw] max-h-[100vh] h-full place-items-stretch border-none p-0">
            <div className={classNameChart}>
              <InteractiveRunsChart chartData={chartData} showYAxis={false} />
            </div>
          </DialogContent>
        </Dialog>
      ) : (
        <div className={classNameChart}>
          <InteractiveRunsChart chartData={chartData} showYAxis />
        </div>
      )}
    </>
  )
}
