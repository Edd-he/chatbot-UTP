'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FaRegEdit } from 'react-icons/fa'
import { BsChevronLeft } from 'react-icons/bs'
import { AiOutlineLoading } from 'react-icons/ai'
import { MdOutlineUnfoldMore } from 'react-icons/md'
import { RiDeleteBin6Line } from 'react-icons/ri'

import redirectChat from '../server_actions/redirect'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/modules/shared/components/ui/popover'
import { Button } from '@/modules/shared/components/ui/button'
import { useConversationStore } from '@/app/store/conversations.store'

export default function ConversationsAside() {
  const conversations = useConversationStore((state) => state.conversations)
  const deleteConversation = useConversationStore(
    (state) => state.removeConversation,
  )

  const pathname = usePathname()

  const [activeIndex, setActiveIndex] = useState('')
  const [loadingTitle, setLoadingTitle] = useState<string | null>(null)

  const [isHovered, setIsHovered] = useState(false)
  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null)

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

  const isAsideOpen = isHovered || openPopoverId !== null

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`fixed top-0 left-0 h-screen flex flex-col items-center border-r px-3 transition-all duration-200 ${
        isAsideOpen ? 'w-80 bg-background' : 'w-20 bg-accent'
      }`}
    >
      <div className="mt-5 mx-auto">
        <BsChevronLeft size={24} />
      </div>

      <div
        className={`relative text-sm w-full mt-10 transition-opacity duration-300 ${
          isAsideOpen ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <Button
          asChild
          variant="ghost"
          className="flex justify-start gap-2 mx-4 p-2 text-base mb-4 truncate"
        >
          <Link href="/">
            <FaRegEdit className="size-5" />
            Nueva Conversación
          </Link>
        </Button>
        <span className="text-start text-base px-5 flex justify-start mb-4 font-semibold truncate">
          Reciente
        </span>
        <ul className="h-96 overflow-y-auto overflow-x-hidden custom-scrollbar py-2 px-3 space-y-2 text-sm">
          {[...conversations].reverse().map((conv) => (
            <li
              key={conv.id}
              className="relative flex items-center justify-between w-full"
            >
              <Link
                href={`/${conv.id}`}
                onClick={() => setActiveIndex(conv.id)}
                className={`cursor-pointer rounded-md transition-colors truncate w-full flex p-2 ${
                  activeIndex === conv.id ? 'bg-blue-light' : 'hover:bg-accent'
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

              <Popover
                open={openPopoverId === conv.id}
                onOpenChange={(open) => setOpenPopoverId(open ? conv.id : null)}
              >
                <Button asChild variant={'ghost'} size={'icon'}>
                  <PopoverTrigger
                    onClick={(e) => e.stopPropagation()}
                    className="ml-2 p-1"
                  >
                    <MdOutlineUnfoldMore size={18} className="rotate-90" />
                  </PopoverTrigger>
                </Button>
                <PopoverContent
                  align="end"
                  className="flex flex-col gap-2 items-start text-sm p-1 max-w-26"
                >
                  <button
                    onClick={async () => {
                      deleteConversation(conv)
                      setIsHovered(false)
                      setOpenPopoverId(null)
                      await redirectChat()
                    }}
                    className="flex items-center gap-2 hover:bg-blue-light p-2 rounded-sm w-full"
                  >
                    <RiDeleteBin6Line size={16} />
                    Eliminar
                  </button>
                </PopoverContent>
              </Popover>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
