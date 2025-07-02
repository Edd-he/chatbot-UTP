import { redirect, RedirectType } from 'next/navigation'

export default async function redirectChat() {
  redirect('/', RedirectType.push)
}
