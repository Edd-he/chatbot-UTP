'use client'

import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@shared/components/ui/chart'

import { TokensData } from '../actions/fetch-tokens-month'

const chartConfig = {
  label: {
    color: 'rgb(0,0,0)',
  },
} satisfies ChartConfig

type Props = {
  chartData: TokensData[]
}
export default function TokensGrowthChart({ chartData }: Props) {
  return (
    <div className="aspect-auto h-[500px] w-full">
      <ChartContainer
        config={chartConfig}
        className="aspect-auto h-[500px] w-full"
      >
        <AreaChart
          accessibilityLayer
          data={chartData}
          margin={{
            left: 12,
            right: 12,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dot" />}
          />
          <Area
            dataKey="totalTokens"
            type="linear"
            fill="hsl(var(--chart-5))"
            fillOpacity={0.6}
            stroke="hsl(var(--chart-5))"
          />
        </AreaChart>
      </ChartContainer>
    </div>
  )
}
