'use client'

import { RiSendPlaneLine } from 'react-icons/ri'
import * as React from 'react'
import { useState, useRef, useEffect } from 'react'
import { toast } from 'sonner'

import { useStreamMessage } from '@/modules/chat/hooks/use-stream-message'
import CustomMarkdown from '@/modules/shared/components/markdown'
import { Textarea } from '@/modules/shared/components/ui/textarea'
import { Button } from '@/modules/shared/components/ui/button'
import ChatbotThinking from '@/modules/chat/components/chatbot-thinking'
import UserMessage from '@/modules/chat/components/user-message'
import WelcomeMessage from '@/modules/chat/components/welcome-message'

export default function Page() {
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const messageContainerRef = useRef<HTMLDivElement>(null)

  const [messages, setMessages] = useState<
    { sender: 'user' | 'bot'; text: string }[]
  >([])

  const { text, error, loading, startStream } = useStreamMessage(
    'https://chatbot-ia-api.vercel.app/api/v1/chat/send',
  )

  const lastMessageIndexRef = useRef<number | null>(null)

  const handleStartStream = () => {
    if (!input.trim()) return

    setMessages((prev) => {
      const messagesUpdated = [
        ...prev,
        { sender: 'user' as 'user', text: input },
        { sender: 'bot' as 'bot', text: '' },
      ]
      lastMessageIndexRef.current = messagesUpdated.length - 1
      return messagesUpdated
    })

    startStream(input, '0197583a-8cec-724d-a49f-80b0729b0729')
    setInput('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleStartStream()
    }
  }

  const adjustTextareaHeight = () => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto'
      inputRef.current.style.height = `${Math.min(
        inputRef.current.scrollHeight,
        120,
      )}px`
    }
  }

  useEffect(() => {
    adjustTextareaHeight()
  }, [input])

  useEffect(() => {
    if (error) toast.error(error)
  }, [error])

  useEffect(() => {
    if (lastMessageIndexRef.current !== null) {
      setMessages((prev) => {
        const updated = [...prev]
        updated[lastMessageIndexRef.current!] = {
          sender: 'bot',
          text,
        }
        return updated
      })
    }
  }, [text])

  useEffect(() => {
    messageContainerRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <>
      <section className="relative flex-1 flex flex-col max-w-4xl mx-auto w-full px-6 py-8">
        {messages.length === 0 && !loading && <WelcomeMessage />}

        <div className="flex-1 space-y-6 overflow-y-auto">
          {messages.map((msg, index) => (
            <div key={index}>
              {msg.sender === 'user' ? (
                <UserMessage text={msg.text} />
              ) : (
                <div className="prose prose-gray text-sm py-2 rounded-lg w-fit mr-auto max-w-[80%] max-sm:text-xs">
                  {loading && index === messages.length - 1 && (
                    <ChatbotThinking />
                  )}
                  <CustomMarkdown>{msg.text}</CustomMarkdown>
                </div>
              )}
            </div>
          ))}
          <div ref={messageContainerRef} />
        </div>

        <div className="sticky bottom-0 rounded-lg border p-4  sm:max-w-4xl w-full bg-background shadow-[0_-12px_16px_-1px_rgba(0,0,0,0.08)] z-20">
          <div className="flex-center gap-3">
            <Textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Escribe tu mensaje aquí..."
              className="w-full max-sm:text-xs"
              disabled={loading}
            />
            <Button
              onClick={handleStartStream}
              disabled={loading || !input.trim()}
            >
              <RiSendPlaneLine className="size-5" />
            </Button>
          </div>
          <p className="text-xs mt-3 text-center">
            Presiona Enter para enviar • Shift + Enter para nueva línea
          </p>
        </div>
      </section>
    </>
  )
}
