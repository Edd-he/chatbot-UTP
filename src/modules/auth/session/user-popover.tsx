'use client'

import { PiUserCheckLight } from 'react-icons/pi'
import { useSession } from 'next-auth/react'
import { AiOutlineLoading } from 'react-icons/ai'
import { Button } from '@shared/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@shared/components/ui/popover'
import Link from 'next/link'

import CloseSessionButton from './close-session-btn'

export default function UserPopover() {
  const { data: session, status } = useSession()

  const username = session?.user?.username?.split(' ')[0] || ''
  const name =
    username.charAt(0).toUpperCase() + username.slice(1).toLowerCase()

  return (
    <Popover>
      <Button asChild variant="ghost" className="gap-3">
        <PopoverTrigger>
          <PiUserCheckLight size={22} />
          {status === 'loading' ? (
            <AiOutlineLoading size={18} className="animate-spin ease-in-out" />
          ) : session?.user ? (
            name
          ) : (
            ''
          )}
        </PopoverTrigger>
      </Button>
      <PopoverContent
        align="end"
        className="flex flex-col gap-1 items-start text-sm w-auto p-1"
      >
        {session ? (
          <CloseSessionButton iconSize={18} label="Cerrar Sesión" />
        ) : (
          <Link
            className="flex-center duration-200 p-2 rounded gap-2 hover:bg-secondary cursor-pointer"
            href="/auth"
          >
            Iniciar Sesión
          </Link>
        )}
      </PopoverContent>
    </Popover>
  )
}
