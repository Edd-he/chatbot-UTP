'use client'

import { TfiMenuAlt } from 'react-icons/tfi'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FaRegEdit } from 'react-icons/fa'
import { AiOutlineLoading } from 'react-icons/ai'
import { RiDeleteBin6Line } from 'react-icons/ri'

import redirectChat from '../server_actions/redirect'

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

export default function ConversationsSheet() {
  const conversations = useConversationStore((state) => state.conversations)
  const deleteConversation = useConversationStore(
    (state) => state.removeConversation,
  )

  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const [activeIndex, setActiveIndex] = useState('')
  const [loadingTitle, setLoadingTitle] = useState<string | null>(null)

  useEffect(() => {
    const current = conversations.find((c) => `/${c.id}` === pathname)
    setActiveIndex(current?.id ?? '')
  }, [pathname, conversations])

  useEffect(() => {
    const last = [...conversations]
      .reverse()
      .find((conv) => !conv.title || conv.title === '')

    setLoadingTitle(last ? last.id : null)
  }, [conversations])

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <Button asChild variant="ghost">
        <SheetTrigger>
          <TfiMenuAlt />
        </SheetTrigger>
      </Button>

      <SheetContent
        side="left"
        className="flex flex-col gap-5 items-center w-80 border-border"
      >
        <SheetHeader>
          <SheetTitle className="text-2xl w-full flex justify-center items-start gap-1">
            <UTP className="text-3xl" iconClassName="size-[24px]" />
          </SheetTitle>
        </SheetHeader>

        <div className="relative text-sm w-full mt-10">
          <Button
            asChild
            variant="ghost"
            className="flex justify-start gap-2 mx-4 p-2 text-base mb-4 truncate"
          >
            <Link href="/" onClick={() => setOpen(false)}>
              <FaRegEdit className="size-5" />
              Nueva Conversación
            </Link>
          </Button>

          <span className="text-start text-base px-5 flex justify-start mb-4 font-semibold truncate">
            Reciente
          </span>

          <ul className="h-96 overflow-y-auto py-2 px-3 space-y-2 custom-scrollbar text-sm">
            {[...conversations].reverse().map((conv) => (
              <li
                key={conv.id}
                className="relative flex items-center justify-between w-full"
              >
                <Link
                  href={`/${conv.id}`}
                  onClick={() => {
                    setActiveIndex(conv.id)
                    setOpen(false)
                  }}
                  className={`cursor-pointer rounded-md transition-colors truncate max-w-64 w-full relative flex p-2 ${
                    activeIndex === conv.id
                      ? 'bg-blue-light'
                      : 'hover:bg-accent'
                  }`}
                >
                  {loadingTitle === conv.id ? (
                    <span className="flex items-center gap-2">
                      <AiOutlineLoading className="animate-spin" />
                      Cargando título...
                    </span>
                  ) : (
                    <span className="flex items-center justify-between w-full">
                      {conv.title || 'Sin título'}
                    </span>
                  )}
                </Link>

                <button
                  onClick={async () => {
                    deleteConversation(conv)
                    setOpen(false)
                    await redirectChat()
                  }}
                  className="ml-2 p-1 hover:bg-red-100 text-red-600 rounded transition-colors"
                  title="Eliminar conversación"
                >
                  <RiDeleteBin6Line size={18} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </SheetContent>
    </Sheet>
  )
}
