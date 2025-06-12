'use client'
import { FaRegEdit } from 'react-icons/fa'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { toast } from 'sonner'
import { BsChevronLeft } from 'react-icons/bs'
import { AiOutlineLoading } from 'react-icons/ai'

import { useConversationStore } from '@/app/store/conversations.store'
import { BACKEND_URL } from '@/lib/constants'
import { sleep } from '@/lib/utils'
import { Button } from '@/modules/shared/components/ui/button'

export default function ConversationsAside() {
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
        await sleep(7000)
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
    <div className="group fixed top-0 left-0 w-20 hover:w-80 bg-accent hover:bg-background transform-cpu duration-200 h-screen flex flex-col items-center border-r z-50 px-3 ">
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
        <ul className="h-[60%] overflow-y-auto px-3 space-y-2 scrollbar-thin scrollbar-thumb-primary scrollbar-track-transparent">
          {[...conversations].reverse().map((conv, i) => (
            <li key={i} className="flex ">
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
