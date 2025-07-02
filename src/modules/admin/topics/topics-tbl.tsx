'use client'

import useSWR from 'swr'
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
import Link from 'next/link'
import { FiEdit } from 'react-icons/fi'
import { RiDeleteBin6Line } from 'react-icons/ri'
import { HiOutlineArrowsUpDown } from 'react-icons/hi2'
import { useSession } from 'next-auth/react'
import { useState } from 'react'

import TableSkeleton from '../skelletons/table-skeleton'
import { Topic } from '../types/topics.types'
import { DeleteTopicDialog } from './delete-topic-dialog'

import Pagination from '@/modules/shared/components/ui/pagination'
import { BACKEND_URL } from '@/lib/constants'
import { fetcher } from '@/lib/http/fetcher'
import { useSortData } from '@/modules/shared/hooks/use-sort-data'
import { Button } from '@/modules/shared/components/ui/button'

type Props = {
  query: string
  status: string
  page: number
  limit: number
}

type GetTopics = {
  data: Topic[]
  total: number
  totalPages: number
}

export default function TopicsTbl({ page, limit, status, query }: Props) {
  const { data: session } = useSession()
  const url = `${BACKEND_URL}/topics/get-all-topics?page_size=${limit}&page=${page}&status=${status}&query=${query}`

  const { data, error, isLoading, mutate } = useSWR<GetTopics>(
    session ? url : null,
    (url: string) => fetcher(url, session?.tokens.access),
  )

  const [selected, setSelected] = useState<Topic | null>(null)
  const [open, setOpen] = useState(false)

  const handleOpenChange = (value: boolean) => {
    setOpen(value)
  }
  const { handleSort, sortData } = useSortData<Topic>('id')
  const sortedTopics = sortData(data?.data)

  if (error) toast.error(error.message)

  return (
    <Card x-chunk="topics-table">
      <CardHeader>
        <CardTitle>Tópicos</CardTitle>
        <CardDescription>Visualiza los tópicos</CardDescription>
      </CardHeader>
      <CardContent>
        <table className="table-fixed text-center text-xs w-full relative">
          <thead className="border-b relative w-full">
            <tr className="h-16">
              <td className="max-lg:hidden">
                <Button
                  variant={'ghost'}
                  onClick={() => handleSort('number')}
                  size={'sm'}
                >
                  <HiOutlineArrowsUpDown />
                  Nro
                </Button>
              </td>
              <td>
                <Button
                  variant={'ghost'}
                  onClick={() => handleSort('name')}
                  size={'sm'}
                >
                  <HiOutlineArrowsUpDown />
                  Nombre
                </Button>
              </td>
              <td className="max-lg:hidden">
                <Button
                  onClick={() => handleSort('description')}
                  variant={'ghost'}
                  size={'sm'}
                >
                  <HiOutlineArrowsUpDown />
                  Descripción
                </Button>
              </td>
              <td className="max-lg:hidden">
                <Button
                  onClick={() => handleSort('documents_count')}
                  variant={'ghost'}
                  size={'sm'}
                >
                  <HiOutlineArrowsUpDown />
                  Nro Docs
                </Button>
              </td>
              <td className="max-md:hidden">
                <Button
                  onClick={() => handleSort('total_size')}
                  variant={'ghost'}
                  size={'sm'}
                >
                  <HiOutlineArrowsUpDown />
                  Tamaño
                </Button>
              </td>
              <td className="max-xl:hidden">
                <Button
                  onClick={() => handleSort('is_active')}
                  variant={'ghost'}
                  size={'sm'}
                >
                  <HiOutlineArrowsUpDown />
                  Estado
                </Button>
              </td>
              <td className="max-xl:hidden">Información</td>
              <td></td>
            </tr>
          </thead>
          <tbody className="relative">
            {isLoading ? (
              <TableSkeleton rows={limit} />
            ) : sortedTopics && sortedTopics.length > 0 ? (
              sortedTopics.map((topic, index) => (
                <tr
                  key={index}
                  className="hover:bg-muted/50 duration-200 relative h-14 border-t"
                >
                  <td className="rounded-l-lg max-lg:hidden">{topic.number}</td>
                  <td>{topic.name}</td>
                  <td className="max-lg:hidden">{topic.description}</td>
                  <td className="max-lg:hidden">{topic.documents_count}</td>
                  <td className="max-md:hidden">{topic.total_size}</td>
                  <td
                    className={`max-xl:hidden text-shadow-lg ${
                      topic.is_active
                        ? 'text-green-500 shadow-green-500/50'
                        : 'text-red-500 shadow-red-500/50'
                    }`}
                  >
                    {topic.is_active ? 'Activo' : 'Inactivo'}
                  </td>
                  <td className="max-xl:hidden max-w-32">
                    <div className="flex flex-col text-left w-full ml-5">
                      <span className="w-full line-clamp-1">
                        Creado: {topic.created_at}
                      </span>
                      <span className="w-full line-clamp-1">
                        Actualizado: {topic.updated_at}
                      </span>
                    </div>
                  </td>
                  <td className="rounded-r-lg space-x-2">
                    <Popover>
                      <PopoverTrigger className="p-2 rounded hover:bg-background duration-200">
                        <MdOutlineUnfoldMore size={20} />
                      </PopoverTrigger>
                      <PopoverContent
                        align="end"
                        className="flex flex-col gap-2 items-start text-sm p-1 max-w-40"
                      >
                        <Link
                          href={`/admin/topics/edit/${topic.id}`}
                          className="flex items-center gap-2 hover:bg-secondary p-2 w-full rounded-sm"
                        >
                          <FiEdit size={18} /> Editar
                        </Link>
                        <button
                          onClick={() => {
                            setSelected(topic)
                            handleOpenChange(true)
                          }}
                          className="flex items-center gap-2 hover:bg-secondary p-2 rounded-sm w-full"
                        >
                          <RiDeleteBin6Line size={18} />
                          Eliminar
                        </button>
                      </PopoverContent>
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
      <DeleteTopicDialog
        open={open}
        topic={selected}
        handleOpenChange={handleOpenChange}
        handleRefresh={mutate}
      />
    </Card>
  )
}
