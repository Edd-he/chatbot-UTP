'use client'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@shared/components/ui/card'
import { toast } from 'sonner'
import useSWR from 'swr'
import { MdOutlineUnfoldMore } from 'react-icons/md'

import TableSkeleton from '../skelletons/table-skeleton'
import { Log } from '../types/logs.types'
import { JsonCompare } from '../components/json-diff-viewer'

import Pagination from '@/modules/shared/components/ui/pagination'
import { BACKEND_URL } from '@/lib/constants'
import { useSortData } from '@/modules/shared/hooks/use-sort-data'
import { fetcher } from '@/lib/http/fetcher'
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/modules/shared/components/ui/dialog'

type Props = {
  page: number
  limit: number
}

type GetLogs = {
  data: Log[]
  total: number
  totalPages: number
}

export default function LogsTbl({ page, limit }: Props) {
  const url = `${BACKEND_URL}/Logs/get-all-logs?page_size=${limit}&page=${page}`
  const { data, error, isLoading } = useSWR<GetLogs>(url, fetcher)
  const logs = data?.data ?? []

  const { sortData } = useSortData<Log>('id')
  const sortedLogs = sortData(logs)

  if (error) toast.error(error.message)

  return (
    <Card x-chunk="logs-table">
      <CardHeader>
        <CardTitle>Logs</CardTitle>
        <CardDescription>
          Visualiza las acciones de los administradores
        </CardDescription>
      </CardHeader>
      <CardContent>
        <table className="table-fixed text-center text-xs w-full relative">
          <thead className="border-b relative w-full">
            <tr className="h-16">
              <td>ID</td>
              <td>Creado</td>
              <td className="max-lg:hidden">ID Usuario</td>
              <td className="max-lg:hidden">Acción</td>
              <td className="max-md:hidden">Entidad</td>
              <td className="max-xl:hidden">ID Entidad</td>
              <td></td>
            </tr>
          </thead>
          <tbody className="relative">
            {isLoading ? (
              <TableSkeleton rows={limit} />
            ) : sortedLogs && sortedLogs.length > 0 ? (
              sortedLogs.map((log) => (
                <tr
                  key={log.id}
                  className="hover:bg-muted/50 duration-200 relative h-14 border-t"
                >
                  <td className="rounded-l-lg max-lg:hidden">{log.id}</td>
                  <td>{log.created_at}</td>
                  <td className="max-lg:hidden">{log.user_id}</td>
                  <td className="max-lg:hidden font-semibold text-muted-foreground">
                    {log.action}
                  </td>
                  <td className="max-md:hidden">{log.entity}</td>
                  <td className="max-xl:hidden">{log.entity_id}</td>
                  <td className="rounded-r-lg space-x-2">
                    {log.action === 'UPDATE' && (
                      <>
                        <Dialog>
                          <DialogTrigger className="p-2 rounded hover:bg-background duration-200">
                            <MdOutlineUnfoldMore size={20} />
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Comparación de Cambios</DialogTitle>
                            </DialogHeader>
                            <div className="overflow-x-hidden">
                              <JsonCompare
                                before={log.details?.before ?? {}}
                                after={log.details?.after ?? {}}
                              />
                            </div>
                          </DialogContent>
                        </Dialog>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr className="relative h-24">
                <td colSpan={6} className="text-center py-4">
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
