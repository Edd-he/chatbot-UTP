'use client'

import { useEffect } from 'react'
import Pusher from 'pusher-js'
import { toast } from 'sonner'

export function MonitoringSocket() {
  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    })

    const channel = pusher.subscribe('chat-monitor')

    channel.bind('chatbot-error', (data: any) => {
      toast.error('Error en chatbot:', {
        description: `Error: ${data.error}`,
      })
    })

    return () => {
      channel.unbind_all()
      channel.unsubscribe()
    }
  }, [])

  return null
}
