/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
'use client'
import { TfiMenuAlt } from 'react-icons/tfi'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { BsChevronLeft } from 'react-icons/bs'
import { toast } from 'sonner'
import Link from 'next/link'
import { FaRegEdit } from 'react-icons/fa'

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/modules/shared/components/ui/sheet'
import UTP from '@/modules/shared/components/UTP'
import { Button } from '@/modules/shared/components/ui/button'
import { useConversationStore } from '@/app/store/conversations.store'
import { BACKEND_URL } from '@/lib/constants'
import { sleep } from '@/lib/utils'

export default function ConversationsSheet() {
  const [open, setOpen] = useState(false)
  const conversations = useConversationStore((state) => state.conversations)
  const updateTitleConversation = useConversationStore(
    (state) => state.updateTitle,
  )
  const pathname = usePathname()
  const [activeIndex, setActiveIndex] = useState('')
  const [loadingTitle, setLoadingTitle] = useState<string | null>(null)

  async function getLasTitle() {
    if (conversations.length === 0) return

    const last = conversations[conversations.length - 1]

    if (!last.title || last.title === '') {
      setLoadingTitle(last.id)
      try {
        await sleep(6000)
        await fetch(`${BACKEND_URL}/conversations/${last.id}/get-title`)

        const res = await fetch(
          `${BACKEND_URL}/conversations/${last.id}/get-title`,
        )

        if (!res.ok) toast.error('Error al obtener el título')

        const data = await res.json()
        if (data?.title) updateTitleConversation(last.id, data.title)
      } catch (e) {
        console.error('Error al obtener el título', e)
      } finally {
        setLoadingTitle(null)
      }
    }
  }

  useEffect(() => {
    const current = conversations.find((c) => `/${c.id}` === pathname)
    setActiveIndex(current?.id ?? '')
  }, [pathname, conversations])

  useEffect(() => {
    getLasTitle()
  }, [conversations, updateTitleConversation])

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <Button asChild variant={'ghost'}>
        <SheetTrigger>
          <TfiMenuAlt />
        </SheetTrigger>
      </Button>
      <SheetContent
        side={'left'}
        className="flex flex-col gap-5 items-center w-80 border-border"
      >
        <SheetHeader>
          <SheetTitle className="text-2xl w-full flex justify-center items-start gap-1">
            <UTP className="text-3xl " iconClassName="size-[24px]" />
          </SheetTitle>
        </SheetHeader>
        <div className="relative text-sm w-full mt-10">
          <Button
            asChild
            variant={'ghost'}
            className="flex justify-start gap-2 mx-4 p-2 text-base mb-4 truncate"
          >
            <Link href={'/'} onClick={() => setOpen(false)}>
              <FaRegEdit className="size-5" />
              Nueva Conversación
            </Link>
          </Button>
          <span className="text-start text-base px-5 flex justify-start mb-4 font-semibold truncate">
            Reciente
          </span>
          <ul className="h-[60%] overflow-y-auto px-3 space-y-2 scrollbar-thin scrollbar-thumb-primary scrollbar-track-transparent">
            {[...conversations].reverse().map((conv, i) => (
              <li key={i} className="flex ">
                <Link
                  href={`/${conv.id}`}
                  onClick={() => {
                    setActiveIndex(conv.id)
                    setOpen(false)
                  }}
                  className={`cursor-pointer rounded-md transition-colors truncate relative w-full "w-full flex p-2 ${
                    activeIndex === conv.id
                      ? 'bg-blue-light'
                      : 'hover:bg-accent'
                  }`}
                >
                  {loadingTitle === conv.id
                    ? 'Cargando título...'
                    : conv.title || 'Sin título'}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </SheetContent>
    </Sheet>
  )
}
