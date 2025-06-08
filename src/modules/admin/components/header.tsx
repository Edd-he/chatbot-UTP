import InstallButton from '@shared/components/install-button'
import { SidebarTrigger } from '@shared/components/ui/sidebar'
import UserPopover from '@auth/session/user-popover'

export default function AdminHeader() {
  return (
    <header className="w-full h-[60px] flex items-center justify-between px-5 sticky top-0 z-50 border-b border-border bg-background">
      <SidebarTrigger size={'lg'} />

      <div className="flex-center gap-2">
        <InstallButton />
        <UserPopover />
      </div>
    </header>
  )
}
