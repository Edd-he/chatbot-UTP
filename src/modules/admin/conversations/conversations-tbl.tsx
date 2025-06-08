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
import { HiOutlineArrowsUpDown } from 'react-icons/hi2'
import useSWR from 'swr'

import TableSkeleton from '../skelletons/table-skeleton'
import { Conversation } from '../types/conversations.types'

import Pagination from '@/modules/shared/components/ui/pagination'
import { BACKEND_URL } from '@/lib/constants'
import { useSortData } from '@/modules/shared/hooks/use-sort-data'
import { Button } from '@/modules/shared/components/ui/button'
import { fetcher } from '@/lib/utils'

type Props = {
  query: string
  status: string
  page: number
  limit: number
}

type GetConversations = {
  data: Conversation[]
  total: number
  totalPages: number
}

export default function ConversationsTbl({
  page,
  limit,
  status,
  query,
}: Props) {
  const url = `${BACKEND_URL}/conversations/get-all-conversations?page_size=${limit}&page=${page}&status=${status}&query=${query}`
  const { data, error, isLoading } = useSWR<GetConversations>(url, fetcher)

  const { sortData, handleSort } = useSortData<Conversation>('id')
  const sortedConversations = sortData(data?.data)

  if (error) toast.error('Error al cargar las conversaciones.')

  return (
    <Card x-chunk="Conversations-table">
      <CardHeader>
        <CardTitle>Conversaciones</CardTitle>
        <CardDescription>
          Visualiza las conversaciones de la inteligencia artificial
        </CardDescription>
      </CardHeader>
      <CardContent>
        <table className="table-fixed text-center text-xs w-full relative">
          <thead className="border-b relative w-full">
            <tr className="h-16">
              <td className="max-lg:hidden">
                <Button
                  variant={'ghost'}
                  size={'sm'}
                  onClick={() => handleSort('number')}
                >
                  Nro
                  <HiOutlineArrowsUpDown />
                </Button>
              </td>
              <td>Creado</td>
              <td className="max-lg:hidden">
                <Button
                  variant={'ghost'}
                  size={'sm'}
                  onClick={() => handleSort('title')}
                >
                  Título
                  <HiOutlineArrowsUpDown />
                </Button>
              </td>
              <td className="max-lg:hidden">Estado</td>
              <td className="max-md:hidden">Estado de Cierre</td>
              <td className="max-xl:hidden">
                <Button
                  onClick={() => handleSort('total_tokens')}
                  variant={'ghost'}
                >
                  <HiOutlineArrowsUpDown />
                  Tokens Totales
                </Button>
              </td>
              <td></td>
            </tr>
          </thead>
          <tbody className="text-xs relative">
            {isLoading ? (
              <TableSkeleton rows={limit} />
            ) : sortedConversations && sortedConversations.length > 0 ? (
              sortedConversations.map((conversation, index) => (
                <tr
                  key={index}
                  className="hover:bg-muted/50 duration-200 relative h-14 border-t"
                >
                  <td className="rounded-l-lg max-lg:hidden">
                    {conversation.number}
                  </td>
                  <td className="rounded-l-lg">{conversation.created_at}</td>
                  <td>
                    {conversation.title ? conversation.title : 'Sin título'}
                  </td>
                  <td
                    className={`max-lg:hidden text-shadow-lg ${
                      conversation.status === 'ACTIVE'
                        ? 'text-green-500 shadow-green-500/50'
                        : 'text-red-500 shadow-red-500/50'
                    }`}
                  >
                    {conversation.status === 'ACTIVE' ? 'Activa' : 'Terminada'}
                  </td>
                  <td className="max-md:hidden">
                    {conversation.completed_at ?? 'Sin Terminar'}
                  </td>
                  <td className="max-xl:hidden">{conversation.total_tokens}</td>
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
                <td colSpan={7} className="text-center py-4">
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
