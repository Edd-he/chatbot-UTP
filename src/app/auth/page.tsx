'use client'
import { useState, useEffect } from 'react'
import { AiOutlineLoading } from 'react-icons/ai'
import { useRouter } from 'next/navigation'
import { signIn, useSession } from 'next-auth/react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import Link from 'next/link'

import { Button } from '@/modules/shared/components/ui/button'
import { Input } from '@/modules/shared/components/ui/input'
import { loginSchema } from '@/modules/auth/schemas/login-schema'
import { redirectAdmin } from '@/modules/auth/server_actions/redirect'

type LoginForm = {
  email: string
  password: string
}
export default function Page() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })
  const { push } = useRouter()

  const onSubmit: SubmitHandler<LoginForm> = async (data) => {
    setLoading(true)
    try {
      const response = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })
      if (!response?.ok) {
        throw {
          message: response?.error || 'Error en la solicitud',
        }
      }
      toast.success('Autenticación exitosa')
    } catch (e: any) {
      console.error((e as Error).message)
      toast.error('Credenciales Inválidas')
    } finally {
      setLoading(false)
    }
  }

  const handleRedirect = async () => {
    if (session?.user?.role) {
      const role = session.user.role
      if (role === 'ADMIN') {
        await redirectAdmin(session.user.modules[0])
        return
      }
      if (role === 'SUPER_ADMIN') {
        await redirectAdmin('monitoring')
        return
      }
    }
  }

  useEffect(() => {
    handleRedirect()
  }, [session, push])

  return (
    <>
      <div className="w-full max-w-md px-5">
        <p className="text-2xl font-semibold">Panel administrativo UTP AI</p>
        <p className="text-xl mb-5 font-light">
          Ingresa para gestionar el chatbot inteligente.
        </p>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid w-full items-center gap-6 text-sm font-semibold"
        >
          <label className="flex flex-col gap-2">
            <span>Correo:</span>
            <Input id="email" className="font-normal" {...register('email')} />
            {errors.email && (
              <p className="text-red-600 text-xs">{errors.email.message}</p>
            )}
          </label>

          <label className="flex flex-col gap-2">
            <span>Contraseña:</span>
            <Input
              id="password"
              type="password"
              className="font-normal"
              {...register('password')}
            />
            {errors.password && (
              <p className="text-red-600 text-xs">{errors.password.message}</p>
            )}
          </label>

          <Button disabled={loading} className=" w-full">
            {loading ? (
              <AiOutlineLoading
                size={18}
                className="animate-spin ease-in-out"
              />
            ) : (
              <>Iniciar Sesión</>
            )}
          </Button>
        </form>
        <Button variant={'outline'} className=" w-full mt-5">
          <Link href={'/'}>Conversar con el Chatbot</Link>
        </Button>
      </div>
    </>
  )
}
