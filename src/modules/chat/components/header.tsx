import InstallButton from '@shared/components/install-button'
import UserPopover from '@auth/session/user-popover'

import UTP from '@/modules/shared/components/UTP'

export default function ChatHeader() {
  return (
    <header className="w-full h-[60px] flex items-center justify-between px-5 sticky top-0 z-50 border-b border-border bg-background">
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
