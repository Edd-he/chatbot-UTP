'use client'
import Link from 'next/link'
import { MdOutlineChevronLeft } from 'react-icons/md'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { AiOutlineLoading } from 'react-icons/ai'
import { Input } from '@shared/components/ui/input'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@shared/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@shared/components/ui/select'
import { Button } from '@shared/components/ui/button'
import { z } from 'zod'
import { useSession } from 'next-auth/react'

import { DniQueryForm } from '@/modules/admin/users/verify-dni/fetch-dni-form'
import { FetchDniDialog } from '@/modules/admin/users/verify-dni/fetch-dni-dialog'
import { useSendRequest } from '@/modules/shared/hooks/use-send-request'
import { BACKEND_URL } from '@/lib/constants'
import { Switch } from '@/modules/shared/components/ui/switch'
import { userCreateSchema } from '@/modules/admin/schemas/user-schema'
import { ACCESS_MODULES } from '@/config/links'

type ReniecData = {
  name: string
  lastName: string
}

type CreateUserSchemaType = z.infer<typeof userCreateSchema>

export default function Page() {
  const { data: session } = useSession()
  const { sendRequest, loading } = useSendRequest(
    `${BACKEND_URL}/users/create-user`,
    'POST',
    session?.tokens.access,
  )
  const [open, setOpen] = useState(false)
  const { push } = useRouter()

  const {
    register,
    watch,
    setValue,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUserSchemaType>({
    resolver: zodResolver(userCreateSchema),
    defaultValues: {
      is_active: true,
    },
  })
  const [reniecData, setReniecData] = useState<ReniecData>()

  const handleOpenChange = (newState: boolean) => {
    setOpen(newState)
  }

  const handleFetchReniec = (dni: string, name: string, lastName: string) => {
    setReniecData({ name, lastName })
    setValue('dni', dni)
  }

  const onSubmit: SubmitHandler<CreateUserSchemaType> = async (data) => {
    const payload = {
      ...data,
      modules_access: data.role === 'ADMIN' ? data.modules_access : undefined,
    }
    const { error } = await sendRequest(payload)

    if (error) {
      toast.error(error)
      return
    }
    toast.success('Usuario Creado Correctamente')
    push('/admin/users')
  }
  const isActive = watch('is_active')
  const role = watch('role')
  return (
    <>
      <section className="max-w-screen-xl w-full mx-auto flex items-center justify-start gap-5">
        <Button asChild variant={'outline'} size={'icon'}>
          <Link href={'/admin/users'}>
            <MdOutlineChevronLeft size={25} />
          </Link>
        </Button>

        <h1 className="text-3xl">Nuevo Usuario</h1>
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
                defaultValue="SUPER_ADMIN"
                render={({ field }) => (
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
                )}
              />
              {errors.role && (
                <p className="text-red-600 text-xs">{errors.role.message}</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="w-full lg:w-[40%] relative flex flex-col gap-5">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-normal">Contraseña</CardTitle>
              <CardDescription>Minimo 8 carácteres</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              <label className="flex flex-col gap-2 w-full">
                <span className="text-sm">Contraseña</span>
                <Input id="password" {...register('password')} />
                {errors.password && (
                  <p className="text-red-600 text-xs">
                    {errors.password.message}
                  </p>
                )}
              </label>

              <label className="flex flex-col gap-2 w-full">
                <span className="text-sm">Confirmar Contraseña</span>
                <Input id="confirmPassword" {...register('confirmPassword')} />
                {errors.confirmPassword && (
                  <p className="text-red-600 text-xs">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </label>
            </CardContent>
          </Card>
          {role === 'ADMIN' && (
            <Controller
              name="modules_access"
              control={control}
              defaultValue={[]}
              rules={{
                validate: (value) =>
                  (value?.length ?? 0) > 0 || 'Selecciona al menos un módulo',
              }}
              render={({ field }) => {
                const { value, onChange } = field

                const togglePermission = (permission: string) => {
                  if ((value ?? []).includes(permission)) {
                    onChange((value ?? []).filter((p) => p !== permission))
                  } else {
                    onChange([...(value ?? []), permission])
                  }
                }

                return (
                  <Card>
                    <CardHeader>
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-2">
                          Permisos de Módulos
                        </CardTitle>
                        <CardDescription>
                          Activa o desactiva el acceso a cada módulo del sistema
                        </CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {ACCESS_MODULES.map(({ module, title }) => (
                        <div
                          key={module}
                          className="flex items-center justify-between p-4"
                        >
                          <div className="text-sm font-medium">{title}</div>
                          <Switch
                            checked={(value ?? []).includes(module)}
                            onCheckedChange={() => togglePermission(module)}
                          />
                        </div>
                      ))}
                      {errors.modules_access && (
                        <p className="text-red-600 text-xs mt-2">
                          {errors.modules_access.message}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                )
              }}
            />
          )}

          <Button type="submit" disabled={loading}>
            {loading ? (
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
