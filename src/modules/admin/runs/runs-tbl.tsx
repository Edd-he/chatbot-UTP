'use client'
import { MdOutlineUnfoldMore } from 'react-icons/md'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@shared/components/ui/card'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@shared/components/ui/popover'
import { toast } from 'sonner'
import useSWR from 'swr'
import { HiOutlineArrowsUpDown } from 'react-icons/hi2'

import TableSkeleton from '../skelletons/table-skeleton'
import { Run } from '../types/runs.types'

import Pagination from '@/modules/shared/components/ui/pagination'
import { Button } from '@/modules/shared/components/ui/button'
import { BACKEND_URL } from '@/lib/constants'
import { useSortData } from '@/modules/shared/hooks/use-sort-data'
import { fetcher } from '@/lib/utils'

type Props = {
  query: string
  status: string
  page: number
  limit: number
}

type GetRuns = {
  data: Run[]
  total: number
  totalPages: number
}

export default function RunsTbl({ page, limit, status, query }: Props) {
  const url = `${BACKEND_URL}/runs/get-all-runs?page_size=${limit}&page=${page}&status=${status}&query=${query}`
  const { data, error, isLoading } = useSWR<GetRuns>(url, fetcher)
  const runs = data?.data ?? []

  const { handleSort, sortData } = useSortData<Run>('id')
  const sortedRuns = sortData(runs)

  if (error) toast.error('Error al cargar las ejecuciones.')

  return (
    <Card x-chunk="runs-table">
      <CardHeader>
        <CardTitle>Ejecuciones</CardTitle>
        <CardDescription>
          Visualiza las ejecuciones de la inteligencia artificial
        </CardDescription>
      </CardHeader>
      <CardContent>
        <table className="table-fixed text-center text-xs w-full relative">
          <thead className="border-b relative w-full">
            <tr className="h-16">
              <td className="max-lg:hidden">
                <Button
                  size={'sm'}
                  variant={'ghost'}
                  onClick={() => handleSort('number')}
                >
                  Nro
                  <HiOutlineArrowsUpDown />
                </Button>
              </td>
              <td>Creado</td>
              <td className="max-lg:hidden">
                <Button
                  size={'sm'}
                  variant={'ghost'}
                  onClick={() => handleSort('model_llm')}
                >
                  Modelo
                  <HiOutlineArrowsUpDown />
                </Button>
              </td>
              <td className="max-lg:hidden">Estado</td>
              <td className="max-md:hidden">
                <Button
                  onClick={() => handleSort('latency')}
                  variant="ghost"
                  size={'sm'}
                >
                  Latencia
                  <HiOutlineArrowsUpDown />
                </Button>
              </td>
              <td className="max-xl:hidden">
                <Button
                  onClick={() => handleSort('tokens')}
                  variant="ghost"
                  size={'sm'}
                >
                  Tokens
                  <HiOutlineArrowsUpDown />
                </Button>
              </td>
              <td className="max-xl:hidden">Conversación ID</td>
              <td></td>
            </tr>
          </thead>
          <tbody className=" relative">
            {isLoading ? (
              <TableSkeleton rows={limit} />
            ) : sortedRuns && sortedRuns.length > 0 ? (
              sortedRuns.map((run, index) => (
                <tr
                  key={index}
                  className="hover:bg-muted/50 duration-200 relative h-14 border-t"
                >
                  <td className="rounded-l-lg max-lg:hidden">{run.number}</td>
                  <td>{new Date(run.created_at).toLocaleString()}</td>
                  <td className="max-lg:hidden">{run.model_llm}</td>
                  <td
                    className={`max-lg:hidden text-shadow-lg ${
                      !run.error
                        ? 'text-green-500 shadow-green-500/50'
                        : 'text-red-500 shadow-red-500/50'
                    }`}
                  >
                    {run.error ? 'Error' : 'Sin Error'}
                  </td>
                  <td className="max-md:hidden">{run.latency}</td>
                  <td className="max-xl:hidden">{run.tokens}</td>
                  <td className="max-xl:hidden">{run.conversation_id}</td>
                  <td className="rounded-r-lg space-x-2">
                    <Popover>
                      <PopoverTrigger className="p-2 rounded hover:shadow-xl hover:shadow-pressed/50 hover:bg-background duration-200">
                        <MdOutlineUnfoldMore size={20} />
                      </PopoverTrigger>
                      <PopoverContent
                        align="end"
                        className="flex flex-col gap-2 items-start text-sm p-1 max-w-40"
                      ></PopoverContent>
                    </Popover>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="relative h-24">
                <td colSpan={9} className="text-center py-4">
                  No hay datos disponibles
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </CardContent>
      <CardFooter>
        <Pagination totalPages={data?.totalPages ?? 1} />
      </CardFooter>
    </Card>
  )
}
