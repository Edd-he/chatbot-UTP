import { ToogleLimit } from '@/modules/admin/filters'
import ConversationsTbl from '@/modules/admin/conversations/conversations-tbl'
import { ToogleConversationStatus } from '@/modules/admin/filters/toogle-conversation-status'

type SearchParams = {
  page?: string
  limit?: string
  conversationStatus?: string
}

type Props = {
  searchParams: Promise<SearchParams>
}
export default async function Page({ searchParams }: Props) {
  const { conversationStatus, page, limit } = await searchParams
  const conversationStatusValue = conversationStatus || 'all'
  const currentPage = Number(page) || 1
  const limitValue = Number(limit) || 10

  return (
    <>
      <section className="w-full flex items-end justify-between max-sm:flex-col-reverse gap-3">
        <div className="space-y-2 max-sm:w-full sm:w-96 ">
          <ToogleLimit />
          <ToogleConversationStatus />
        </div>
      </section>

      <ConversationsTbl
        page={currentPage}
        limit={limitValue}
        conversationStatus={conversationStatusValue}
      />
    </>
  )
}
