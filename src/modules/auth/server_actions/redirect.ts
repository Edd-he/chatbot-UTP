'use server'

import { redirect, RedirectType } from 'next/navigation'

export async function redirectAdmin(page: string) {
  redirect(`/admin/${page}`, RedirectType.push)
}
