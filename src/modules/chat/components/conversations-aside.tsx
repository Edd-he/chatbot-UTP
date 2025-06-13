'use client'

import { FaRegEdit } from 'react-icons/fa'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { BsChevronLeft } from 'react-icons/bs'
import { AiOutlineLoading } from 'react-icons/ai'

import { useConversationStore } from '@/app/store/conversations.store'
import { Button } from '@/modules/shared/components/ui/button'

export default function ConversationsAside() {
  const conversations = useConversationStore((state) => state.conversations)

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

    if (last) {
      setLoadingTitle(last.id)
    } else {
      setLoadingTitle(null)
    }
  }, [conversations])

  return (
    <div
      className={
        'group fixed top-0 left-0 w-20 hover:w-80 bg-accent hover:bg-background transform-cpu duration-200 h-screen flex flex-col items-center border-r px-3'
      }
    >
      <div className="mt-5 mx-auto">
        <BsChevronLeft size={24} />
      </div>

      <div className="relative text-sm w-full mt-10 group-hover:opacity-100 opacity-0 duration-300">
        <Button
          asChild
          variant={'ghost'}
          className="flex justify-start gap-2 mx-4 p-2 text-base mb-4 truncate"
        >
          <Link href={'/'}>
            <FaRegEdit className="size-5" />
            Nueva Conversación
          </Link>
        </Button>
        <span className="text-start text-base px-5 flex justify-start mb-4 font-semibold truncate">
          Reciente
        </span>
        <ul className="h-96 overflow-y-auto custom-scrollbar py-2 px-3 space-y-2 text-sm">
          {[...conversations].reverse().map((conv, i) => (
            <li key={i} className="flex">
              <Link
                href={`/${conv.id}`}
                onClick={() => setActiveIndex(conv.id)}
                className={`cursor-pointer rounded-md transition-colors truncate max-w-64 w-full relative flex p-2 ${
                  activeIndex === conv.id ? 'bg-blue-light' : 'hover:bg-accent'
                }`}
              >
                {loadingTitle === conv.id ? (
                  <span className="flex items-center gap-2">
                    <AiOutlineLoading className="animate-spin ease-in-out" />
                    Cargando título...
                  </span>
                ) : (
                  conv.title || 'Sin título'
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
