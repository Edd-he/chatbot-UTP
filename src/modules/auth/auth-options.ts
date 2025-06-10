import CredentialsProvider from 'next-auth/providers/credentials'
import type { NextAuthOptions } from 'next-auth'

import { BACKEND_URL } from '../../lib/constants'

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'jsmith' },
        password: { label: 'Password', type: 'password', placeholder: '*****' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        const { email, password } = credentials

        try {
          const res = await fetch(BACKEND_URL + '/auth/sign-in', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          })
          if (!res.ok) {
            console.error('Error en autenticación:', await res.text())
            return null
          }
          const user = await res.json()
          return user
        } catch (error) {
          console.error('Error en la solicitud:', error)
          return null
        }
      },
    }),
  ],
  pages: {
    signIn: '/auth',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) return { ...token, ...user }
      return token
    },
    async session({ session, token }) {
      session.user = token.user
      session.tokens = token.tokens
      return session
    },
  },
}
