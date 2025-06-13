'use client'
import InstallButton from '@shared/components/install-button'
import UserPopover from '@auth/session/user-popover'

import ConversationsAside from './conversations-aside'
import ConversationsSheet from './conversations-sheet'

import UTP from '@/modules/shared/components/UTP'
import { useMediaQuery } from '@/modules/shared/hooks/use-media-query'

export default function ChatHeader() {
  const isMobile = useMediaQuery('(max-width: 1280px)')
  return (
    <header className="w-full h-[60px] flex items-center justify-between px-5 sticky top-0 z-50 bg-background ">
      <div className="max-xl:hidden">{!isMobile && <ConversationsAside />}</div>
      <div className="xl:hidden">{isMobile && <ConversationsSheet />}</div>

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
