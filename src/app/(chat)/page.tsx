'use client'

import { useState } from 'react'

import CustomMarkdown from '@/modules/shared/components/markdown'
import { useStreamMessage } from '@/modules/chat/hooks/use-stream-message'

export default function Home() {
  const [input, setInput] = useState('')
  const { text, error, loading, startStream } = useStreamMessage(
    'https://chatbot-ia-api.vercel.app/api/v1/chat/send',
  )

  const handleStartStream = () => {
    startStream(input, '01969288-7f4f-70ef-915b-aa93f3752ced')
  }
  return (
    <>
      <div className="p-4 min-h-screen text-black  text-sm">
        <h1 className="mb-4 text-lg font-bold">Chatbot UTP IA</h1>
        <input
          className="border p-2 rounded mx-2"
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
        />
        <button
          onClick={handleStartStream}
          className="mb-4 bg-yellow-500 px-4 py-2 text-black font-bold rounded"
          disabled={loading}
        >
          {loading ? 'Cargando...' : 'Enviar'}
        </button>
        <div className="prose max-w-none text-xs space-y-4">
          <CustomMarkdown>{text}</CustomMarkdown>
        </div>
        {error && <p className="text-red-500"> {error}</p>}
      </div>
    </>
  )
}
