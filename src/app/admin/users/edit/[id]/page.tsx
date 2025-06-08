'use client'
import Link from 'next/link'
import { MdOutlineChevronLeft } from 'react-icons/md'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useEffect, use } from 'react'
import { AiOutlineLoading } from 'react-icons/ai'
import _ from 'lodash'
import { z } from 'zod'

import { userEditSchema } from '@/modules/admin/schemas/user-schema'
import UserChangePasswordDialog from '@/modules/admin/users/change-pasword-dialog'
import { DniQueryForm } from '@/modules/admin/users/fetch-dni-form'
import { FetchDniDialog } from '@/modules/admin/users/fetch-dni-dialog'
import { Button } from '@/modules/shared/components/ui/button'
import { Input } from '@/modules/shared/components/ui/input'
import { User } from '@/modules/admin/types/users.types'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/modules/shared/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/modules/shared/components/ui/select'
import { BACKEND_URL } from '@/lib/constants'
import { useSendRequest } from '@/modules/shared/hooks/use-send-request'
import { useGetData } from '@/modules/shared/hooks/use-get-data'
import { Switch } from '@/modules/shared/components/ui/switch'

type ReniecData = {
  name: string
  lastName: string
}

type Props = {
  params: Promise<{ id: string }>
}

type UserEditFormValues = z.infer<typeof userEditSchema>

export default function Page({ params }: Props) {
  const { id } = use(params)
  const { push } = useRouter()
  const [reniecData, setReniecData] = useState<ReniecData>()
  const [open, setOpen] = useState(false)

  const url = `${BACKEND_URL}/users/${id}/get-user`

  const {
    data: user,
    error: getError,
    loading: getLoading,
  } = useGetData<User>(url)

  const { sendRequest, loading: putLoading } = useSendRequest<User>(
    `${BACKEND_URL}/users/${id}/update-user`,
    'PATCH',
  )

  const {
    register,
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<UserEditFormValues>({
    resolver: zodResolver(userEditSchema),
  })

  const handleOpenChange = (newState: boolean) => {
    setOpen(newState)
  }

  const handleFetchReniec = (dni: string, name: string, lastName: string) => {
    setValue('dni', dni)
    setReniecData({ name, lastName })
  }

  useEffect(() => {
    if (user) {
      setReniecData({ name: user.name, lastName: user.last_name })

      const editable = editableValues(user)
      reset({
        ...editable,
      })
    }
  }, [user, reset])

  const onSubmit: SubmitHandler<UserEditFormValues> = async (data) => {
    if (!user) {
      toast.warning('Error al obtener el usuario')
      return
    }

    if (_.isEqual(editableValues(user), data)) {
      toast.warning('No se está actualizando nada en los datos del usuario')
      return
    }

    const { error } = await sendRequest(data)

    if (error) {
      toast.error(error)
      return
    }

    toast.success('Usuario Actualizado Correctamente')

    push('/admin/users')
  }
  if (getError) toast.error(getError)

  const isActive = watch('is_active')

  return (
    <>
      <section className="max-w-screen-xl w-full mx-auto flex items-center justify-start gap-5">
        <Button asChild variant={'outline'} size={'icon'}>
          <Link href={'/admin/users'}>
            <MdOutlineChevronLeft size={25} />
          </Link>
        </Button>
        <span className="flex-center gap-2 max-md:flex-col">
          <h1 className="text-3xl">Editar Usuario</h1>
          <UserChangePasswordDialog id={id} />
        </span>
      </section>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex max-w-screen-xl w-full mx-auto max-lg:flex-col gap-5"
      >
        <div className="flex flex-col gap-5 w-full lg:w-[60%]">
          <div className="flex bg-background flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <label htmlFor="is_active" className="text-lg">
                Estado Activo
              </label>
              <p className="text-sm text-gray-500">
                Verifica si el usuario tendra acceso
              </p>
            </div>
            <Switch
              id="is_active"
              checked={isActive}
              onCheckedChange={(value) => setValue('is_active', value)}
            />
          </div>

          <Card className="max-w-screen-md">
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle className="text-xl font-normal">Detalles</CardTitle>
              <Button
                variant={'outline'}
                type="button"
                onClick={() => handleOpenChange(true)}
              >
                Consultar RENIEC
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              <label className="flex flex-col gap-2">
                <span className="text-sm">DNI</span>
                <Input id="dni" {...register('dni')} />
                {errors.dni && (
                  <p className="text-red-600 text-xs">{errors.dni.message}</p>
                )}
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-sm">Nombres</span>
                <Input id="name" defaultValue={reniecData?.name} readOnly />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-sm">Apellidos</span>
                <Input
                  id="lastName"
                  defaultValue={reniecData?.lastName}
                  readOnly
                />
              </label>
            </CardContent>
          </Card>

          <Card className="max-w-screen-md">
            <CardHeader>
              <CardTitle className="text-xl font-normal">Contacto</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-5 max-md:flex-col">
              <label className="flex flex-col gap-2 w-full">
                <span className="text-sm">Correo Electrónico</span>
                <Input id="email" {...register('email')} />
                {errors.email && (
                  <p className="text-red-600 text-xs">{errors.email.message}</p>
                )}
              </label>
            </CardContent>
          </Card>
        </div>

        <div className="w-full lg:w-[40%] relative flex flex-col gap-5">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-xl font-normal">
                Rol asignado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Controller
                name="role"
                control={control}
                defaultValue=""
                render={({ field }) => {
                  return (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="hover:bg-secondary">
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent
                        position="popper"
                        sideOffset={5}
                        hideWhenDetached
                      >
                        <SelectItem value="ADMIN">Administrador</SelectItem>
                        <SelectItem value="SUPER_ADMIN">
                          SuperAdministrador
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )
                }}
              />
              {errors.role && (
                <p className="text-red-600 text-xs">{errors.role.message}</p>
              )}
            </CardContent>
          </Card>

          <Button type="submit" disabled={getLoading || putLoading}>
            {getLoading || putLoading ? (
              <AiOutlineLoading
                size={18}
                className="animate-spin ease-in-out"
              />
            ) : (
              <>Guardar Usuario</>
            )}
          </Button>
        </div>
      </form>

      <FetchDniDialog open={open} handleOpenChange={handleOpenChange}>
        <DniQueryForm
          handleOpenChange={handleOpenChange}
          handleFetchReniec={handleFetchReniec}
        />
      </FetchDniDialog>
    </>
  )
}

function editableValues(user: User): UserEditFormValues {
  return {
    dni: user.dni,
    email: user.email,
    is_active: user.is_active,
    role: user.role,
  }
}
