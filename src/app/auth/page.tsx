/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
'use client'
import { useState, useEffect } from 'react'
import { AiOutlineLoading } from 'react-icons/ai'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Button } from '@/modules/shared/components/ui/button'
import { Input } from '@/modules/shared/components/ui/input'

export default function Page() {
  const { prefetch } = useRouter()
  const [loading] = useState(false)

  useEffect(() => {
    prefetch('/admin/monitoring')
  })
  return (
    <>
      <div className="w-full max-w-md px-5">
        <p className="text-2xl font-semibold">Panel administrativo UTP AI</p>
        <p className="text-xl mb-5 font-light">
          Ingresa para gestionar el chatbot inteligente.
        </p>
        <form className="grid w-full items-center gap-6 text-sm font-semibold">
          <label className="flex flex-col gap-2">
            <span>Correo:</span>
            <Input id="email" className="font-normal" />
            <span className="text-xs font-normal">
              Ejemplo de usuario: A1533148 (no digitar el @utp.edu.pe)
            </span>
          </label>

          <label className="flex flex-col gap-2">
            <span>Contraseña:</span>
            <Input id="password" type="password" className="font-normal" />
          </label>
          <Button asChild className="w-full">
            <Link href="/admin/users">Iniciar Sesión</Link>
          </Button>
          {/* <Button disabled={loading} className=" w-full">
            {loading ? (
              <AiOutlineLoading
                size={18}
                className="animate-spin ease-in-out"
              />
            ) : (
              <>Iniciar Sesión</>
            )}
          </Button> */}
        </form>
      </div>
    </>
  )
}
