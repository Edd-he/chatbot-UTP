import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import React from 'react'
import { Toaster } from 'sonner'

import { META_DATA } from '@/config/metadata'
import { NextAuthProvider } from '@/providers/session-provider'
import { ThemeProvider } from '@/providers/theme-provider'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = META_DATA

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className="bg-background custom-scrollbar"
    >
      <body
        className={` ${geistSans.variable} ${geistMono.variable} antialiased `}
      >
        <ThemeProvider forcedTheme="light" defaultTheme="light">
          <NextAuthProvider>
            <div vaul-drawer-wrapper="">{children}</div>
            <Toaster richColors closeButton duration={3000} visibleToasts={3} />
          </NextAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
