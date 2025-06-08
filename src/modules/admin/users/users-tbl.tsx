'use client'

import useSWR from 'swr'
import { RiDeleteBin6Line } from 'react-icons/ri'
import { FiEdit } from 'react-icons/fi'
import { MdOutlineUnfoldMore } from 'react-icons/md'
import { HiOutlineArrowsUpDown } from 'react-icons/hi2'
import Link from 'next/link'
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
import { AiOutlineInfoCircle } from 'react-icons/ai'

import TableSkeleton from '../skelletons/table-skeleton'
import { User } from '../types/users.types'

import Pagination from '@/modules/shared/components/ui/pagination'
import { Button } from '@/modules/shared/components/ui/button'
import { BACKEND_URL } from '@/lib/constants'
import { fetcher } from '@/lib/utils'
import { useSortData } from '@/modules/shared/hooks/use-sort-data'

type Props = {
  query: string
  status: string
  page: number
  limit: number
}

type GetUsers = {
  data: User[]
  total: number
  totalPages: number
}

export default function UserTbl({ page, limit, status, query }: Props) {
  const url = `${BACKEND_URL}/users/get-all-users?page_size=${limit}&page=${page}&status=${status}&query=${query}`
  const { data, error, isLoading } = useSWR<GetUsers>(url, fetcher)

  const { handleSort, sortData } = useSortData<User>('number')

  const sortedUsers = sortData(data?.data)

  if (error) toast.error(error)

  return (
    <Card x-chunk="users-table">
      <CardHeader>
        <CardTitle>Usuarios</CardTitle>
        <CardDescription>
          Administra los permisos de tus usuarios
        </CardDescription>
      </CardHeader>
      <CardContent>
        <table className="table-fixed text-center text-xs w-full relative">
          <thead className=" border-b relative w-full">
            <tr className="h-16">
              <td className="max-lg:hidden">
                <Button
                  onClick={() => handleSort('number')}
                  variant={'ghost'}
                  size={'sm'}
                >
                  <HiOutlineArrowsUpDown />
                  Nro
                </Button>
              </td>
              <td>
                <Button
                  onClick={() => handleSort('dni')}
                  variant={'ghost'}
                  size={'sm'}
                >
                  <HiOutlineArrowsUpDown />
                  Dni
                </Button>
              </td>
              <td>
                <Button
                  onClick={() => handleSort('name')}
                  variant={'ghost'}
                  size={'sm'}
                >
                  <HiOutlineArrowsUpDown />
                  Nombre
                </Button>
              </td>
              <td className="max-lg:hidden">
                <Button
                  onClick={() => handleSort('is_active')}
                  variant={'ghost'}
                  size={'sm'}
                >
                  <HiOutlineArrowsUpDown />
                  Estado
                </Button>
              </td>
              <td className="max-md:hidden">Correo</td>
              <td className="max-xl:hidden">Información</td>
              <td></td>
            </tr>
          </thead>
          <tbody className="text-xs relative">
            {isLoading ? (
              <TableSkeleton rows={limit} />
            ) : sortedUsers && sortedUsers.length > 0 ? (
              sortedUsers.map((user, index) => (
                <tr
                  key={index}
                  className="hover:bg-muted/50 duration-200 h-14 border-t relative"
                >
                  <td className="rounded-l-lg max-lg:hidden">{user.number}</td>
                  <td>{user.dni}</td>
                  <td>{`${user.name} ${user.last_name}`}</td>
                  <td
                    className={`max-lg:hidden text-shadow-lg ${user.is_active ? 'text-green-500 shadow-green-500/50' : 'text-red-500 shadow-red-500/50'}`}
                  >
                    {user.is_active ? 'Activo' : 'Inactivo'}
                  </td>
                  <td className="max-md:hidden">{user.email}</td>
                  <td className="max-xl:hidden max-w-32">
                    <div className="flex-center flex-col text-left w-full">
                      <span className="w-full line-clamp-1">
                        Creado: {user.created_at}
                      </span>
                      <span className="w-full line-clamp-1">
                        Actualizado: {user.updated_at}
                      </span>
                    </div>
                  </td>
                  <td className="rounded-r-lg space-x-2">
                    <Popover>
                      <PopoverTrigger className="p-2 rounded cursor-pointer hover:bg-background duration-200">
                        <MdOutlineUnfoldMore size={20} />
                      </PopoverTrigger>
                      <PopoverContent
                        align="end"
                        className="flex flex-col gap-2 items-start text-sm p-1 max-w-40"
                      >
                        <Link
                          href={`/admin/users/${user.id}`}
                          className="flex items-center gap-2 hover:bg-secondary p-2 w-full rounded-sm "
                        >
                          <AiOutlineInfoCircle size={18} /> Información
                        </Link>
                        <Link
                          href={`/admin/users/edit/${user.id}`}
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
