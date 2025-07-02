/* eslint-disable no-unused-vars */
'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@shared/components/ui/dialog'

import { Run } from '../types/runs.types'

type Props = {
  run: Run | null
  open: boolean
  handleOpenChange: (open: boolean) => void
}

export function ViewRunDialog({ open, run, handleOpenChange }: Props) {
  if (!run) return null

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Detalles de la ejecución #{run.number}
          </DialogTitle>
          <DialogDescription className="text-xs">
            Conversación:{' '}
            <span className="font-medium">{run.conversation_id}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 text-sm mt-4">
          <div className="grid grid-cols-2 gap-4">
            <p>
              <span className="font-semibold">ID:</span> {run.id}
            </p>
            <p>
              <span className="font-semibold">Fecha:</span> {run.created_at}
            </p>
            <p>
              <span className="font-semibold">Modelo:</span> {run.model_llm}
            </p>
            <p>
              <span className="font-semibold">Tokens usados:</span> {run.tokens}
            </p>
            <p>
              <span className="font-semibold">Latencia:</span> {run.latency}
            </p>
            <p>
              <span className="font-semibold">¿Exitosa?:</span>
              {run.is_run_successful ? ' Sí' : ' No'}
            </p>
          </div>

          <div>
            <p className="font-semibold">Entrada:</p>
            <pre className="bg-muted p-2 rounded text-xs whitespace-pre-wrap">
              {run.input}
            </pre>
          </div>

          <div>
            <p className="font-semibold">Salida:</p>
            <pre className="bg-muted p-2 rounded text-xs whitespace-pre-wrap max-h-96 h-full overflow-y-scroll custom-scrollbar">
              {run.output}
            </pre>
          </div>

          {run.error && (
            <div>
              <p className="font-semibold text-red-500">Error:</p>
              <pre className="bg-red-100 text-red-800 p-2 rounded text-xs whitespace-pre-wrap">
                {typeof run.error === 'string'
                  ? run.error
                  : JSON.stringify(run.error, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
