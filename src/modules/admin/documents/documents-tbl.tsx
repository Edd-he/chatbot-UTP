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
import Link from 'next/link'
import { FiEdit } from 'react-icons/fi'
import { RiDeleteBin6Line } from 'react-icons/ri'
import useSWR from 'swr'
import { HiOutlineArrowsUpDown } from 'react-icons/hi2'

import TableSkeleton from '../skelletons/table-skeleton'
import { Doc } from '../types/documents.types'

import Pagination from '@/modules/shared/components/ui/pagination'
import { BACKEND_URL } from '@/lib/constants'
import { useSortData } from '@/modules/shared/hooks/use-sort-data'
import { fetcher } from '@/lib/http/fetcher'
import { Button } from '@/modules/shared/components/ui/button'

type Props = {
  query: string
  status: string
  page: number
  limit: number
}

type GetDocuments = {
  data: Doc[]
  total: number
  totalPages: number
}

export default function DocumentsTbl({ page, limit, status, query }: Props) {
  const url = `${BACKEND_URL}/documents/get-all-documents?page_size=${limit}&page=${page}&status=${status}&query=${query}`
  const { data, error, isLoading } = useSWR<GetDocuments>(url, fetcher)

  const { sortData, handleSort } = useSortData<Doc>('id')
  const sortedDocs = sortData(data?.data)

  if (error) toast.error('Error al cargar los documentos.')

  return (
    <Card x-chunk="documents-table">
      <CardHeader>
        <CardTitle>Documentos</CardTitle>
        <CardDescription>Visualiza los documentos</CardDescription>
      </CardHeader>
      <CardContent>
        <table className="table-fixed text-xs text-center w-full relative">
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
              <td>
                <Button
                  variant={'ghost'}
                  size={'sm'}
                  onClick={() => handleSort('name')}
                >
                  Titulo
                  <HiOutlineArrowsUpDown />
                </Button>
              </td>
              <td className="max-md:hidden">
                <Button
                  variant={'ghost'}
                  size={'sm'}
                  onClick={() => handleSort('size')}
                >
                  Tamaño
                  <HiOutlineArrowsUpDown />
                </Button>
              </td>
              <td className="max-xl:hidden">Estado</td>
              <td className="max-xl:hidden">Información</td>
              <td></td>
            </tr>
          </thead>
          <tbody className="relative">
            {isLoading ? (
              <TableSkeleton rows={limit} />
            ) : sortedDocs && sortedDocs.length > 0 ? (
              sortedDocs.map((doc, index) => (
                <tr
                  key={index}
                  className="hover:bg-muted/50 duration-200 relative h-14 border-t"
                >
                  <td className="rounded-l-lg max-lg:hidden">{doc.number}</td>
                  <td className="truncate">{doc.name}</td>
                  <td className="max-md:hidden">{doc.size}</td>
                  <td
                    className={`max-xl:hidden text-shadow-lg ${
                      doc.is_active
                        ? 'text-green-500 shadow-green-500/50'
                        : 'text-red-500 shadow-red-500/50'
                    }`}
                  >
                    {doc.is_active ? 'Activo' : 'Inactivo'}
                  </td>
                  <td className="max-xl:hidden max-w-32">
                    <div className="flex flex-col text-left w-full ml-5">
                      <span className="line-clamp-1">
                        Creado: {doc.created_at}
                      </span>
                      <span className="line-clamp-1">
                        Actualizado: {doc.updated_at}
                      </span>
                    </div>
                  </td>
                  <td className="rounded-r-lg space-x-2">
                    <Popover>
                      <PopoverTrigger className="p-2 rounded hover:shadow-xl hover:shadow-pressed/50 hover:bg-background duration-200">
                        <MdOutlineUnfoldMore size={20} />
                      </PopoverTrigger>
                      <PopoverContent
                        align="end"
                        className="flex flex-col gap-2 items-start text-sm p-1 max-w-40"
                      >
                        <Link
                          href={`/admin/documents/edit/${doc.id}`}
                          className="flex items-center gap-2 hover:bg-secondary p-2 w-full rounded-sm"
                        >
                          <FiEdit size={18} /> Editar
                        </Link>
                        <button className="flex items-center gap-2 hover:bg-secondary p-2 rounded-sm w-full">
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
