/* eslint-disable no-unused-vars */
'use client'
import { toast } from 'sonner'
import { AiOutlineLoading } from 'react-icons/ai'
import { Button } from '@shared/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@shared/components/ui/dialog'
import { useSession } from 'next-auth/react'

import { Topic } from '../types/topics.types'

import { BACKEND_URL } from '@/lib/constants'
import { useSendRequest } from '@/modules/shared/hooks/use-send-request'

type Props = {
  topic: Topic | null
  open: boolean
  handleOpenChange: (open: boolean) => void
  handleRefresh: () => void
}

export function DeleteTopicDialog({
  open,
  topic,
  handleOpenChange,
  handleRefresh,
}: Props) {
  const { data: session } = useSession()

  const { sendRequest, loading } = useSendRequest(
    `${BACKEND_URL}/topics/${topic?.id}/remove-topic`,
    'DELETE',
    session?.tokens.access,
  )
  const handleDelete = async () => {
    const { error } = await sendRequest()

    handleOpenChange(false)
    handleRefresh()

    if (error) {
      toast.error(error)
      return
    }
    toast('Usuario Eliminado Correctamente')
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar Tópico</DialogTitle>
          <DialogDescription className="text-xs">
            ¿Seguro que deseas eliminar este tópico permanentemente?
          </DialogDescription>
          <div className="w-full flex justify-between items-center pt-6">
            <Button
              variant={'default'}
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? (
                <AiOutlineLoading
                  size={18}
                  className="animate-spin ease-in-out"
                />
              ) : (
                <>Confirmar</>
              )}
            </Button>

            <Button
              variant={'destructive'}
              onClick={() => handleOpenChange(false)}
            >
              Cancelar
            </Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
