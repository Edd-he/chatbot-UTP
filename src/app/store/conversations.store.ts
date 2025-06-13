/* eslint-disable no-unused-vars */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { Conversation } from './types/conversation.types'

type ConversationsStore = {
  conversations: Conversation[]

  addConversation: (conversation: Conversation) => void
  updateTitle: (id: string, title: string) => void
  removeConversation: (conversation: Conversation) => void
  resetConversations: () => void
}

export const useConversationStore = create<ConversationsStore>()(
  persist<ConversationsStore>(
    (set, get) => ({
      conversations: [],
      addConversation: (conversation) => {
        set((state) => {
          const exists = state.conversations.some(
            (c) => c.id === conversation.id,
          )
          if (exists) return state
          return { conversations: [...state.conversations, conversation] }
        })
      },

      removeConversation: (conversation) => {
        const { conversations } = get()
        const updated = conversations.filter((c) => c.id !== conversation.id)
        set({ conversations: updated })
      },

      updateTitle: (id, title) => {
        const { conversations } = get()
        const updated = conversations.map((c) =>
          c.id === id ? { ...c, title } : c,
        )
        set({ conversations: updated })
      },

      resetConversations: () => {
        set({ conversations: [] })
      },
    }),
    {
      name: 'conversations',
    },
  ),
)
