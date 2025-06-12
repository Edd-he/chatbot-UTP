'use client'

import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@shared/components/ui/chart'

import { TokensData } from '../actions/fetch-tokens-month'

const chartConfig = {} satisfies ChartConfig

type Props = {
  chartData: TokensData[]
}
export default function TokensGrowthChart({ chartData }: Props) {
  const data = chartData.map((item) => ({
    ...item,
    tokens: item.totalTokens,
  }))
  return (
    <div className="aspect-auto h-[500px] w-full">
      <ChartContainer
        config={chartConfig}
        className="aspect-auto h-[500px] w-full"
      >
        <AreaChart
          accessibilityLayer
          data={data}
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
            dataKey="tokens"
            type="linear"
            fill="red"
            fillOpacity={0.6}
            stroke="red"
          />
        </AreaChart>
      </ChartContainer>
    </div>
  )
}
