'use client'
import InstallButton from '@shared/components/install-button'
import UserPopover from '@auth/session/user-popover'

import ConversationsAside from './conversations-aside'
import ConversationsSheet from './conversations-sheet'

import UTP from '@/modules/shared/components/UTP'
import { useMediaQuery } from '@/modules/shared/hooks/use-media-query'

export default function ChatHeader() {
  const isMobile = useMediaQuery('(max-width: 1200px)')
  return (
    <header className="w-full h-[60px] flex items-center justify-between px-5 sticky top-0 z-50 bg-background ">
      <div>{isMobile ? <ConversationsSheet /> : <ConversationsAside />}</div>

      <div>
        <UTP className="text-3xl " iconClassName="size-[24px]" />
      </div>
      <div className="flex-center gap-2">
        <InstallButton />
        <UserPopover />
      </div>
    </header>
  )
}
