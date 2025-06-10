import * as React from 'react'

import ChatHeader from '@/modules/chat/components/header'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ChatHeader />
      <main className="min-h-[calc(100dvh-60px)] flex flex-col relative">
        {children}
      </main>
    </>
  )
}
