'use client'

import * as React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { IoClose } from 'react-icons/io5'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import Link from 'next/link'
import { MdOutlineChevronLeft } from 'react-icons/md'
import { AiOutlineLoading } from 'react-icons/ai'
import { useRouter } from 'next/navigation'

import { Switch } from '@/modules/shared/components/ui/switch'
import { Textarea } from '@/modules/shared/components/ui/textarea'
import { Input } from '@/modules/shared/components/ui/input'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/modules/shared/components/ui/card'
import { Button } from '@/modules/shared/components/ui/button'
import { documentSchema } from '@/modules/admin/schemas/documents-schema'
import { useSendRequest } from '@/modules/shared/hooks/use-send-request'
import { BACKEND_URL } from '@/lib/constants'
import PdfViewer from '@/modules/shared/components/viewer'

type DocumentFormValues = z.infer<typeof documentSchema>

export default function Page() {
  const { sendRequest, loading } = useSendRequest(
    `${BACKEND_URL}/topics/0196ea07-1baa-752d-b718-81e64dfeb817/documents/create-document`,
    'POST',
    '',
    true,
  )

  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const { push } = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
    setError,
    clearErrors,
  } = useForm<DocumentFormValues>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      name: '',
      description: '',
      tags: [],
      is_active: true,
    },
  })

  const selectedFile = watch('file')
  const currentFile: File = selectedFile?.[0] || null
  const isActive = watch('is_active')

  useEffect(() => {
    if (currentFile && currentFile.type === 'application/pdf') {
      const fileUrl = URL.createObjectURL(currentFile)
      setPdfUrl(fileUrl)

      return () => {
        URL.revokeObjectURL(fileUrl)
      }
    } else {
      setPdfUrl(null)
    }
  }, [currentFile])

  const addTag = () => {
    const trimmedTag = tagInput.trim()
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < 10) {
      const newTags = [...tags, trimmedTag]
      setTags(newTags)
      setValue('tags', newTags)
      setTagInput('')
      clearErrors('tags')
    }
  }

  const removeTag = (tagRemove: string) => {
    const newTags = tags.filter((tag) => tag !== tagRemove)
    setTags(newTags)
    setValue('tags', newTags)
    if (newTags.length === 0)
      setError('tags', { message: 'Debes agregar al menos un tag.' })
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag()
    }
  }

  async function onSubmit(data: DocumentFormValues) {
    const form = new FormData()
    form.append('name', data.name)
    form.append('description', data.description)
    form.append('is_active', data.is_active.toString())
    form.append('tags', JSON.stringify(data.tags))
    if (currentFile) {
      form.append('file', currentFile)
    }
    const { error } = await sendRequest(form)
    if (error) {
      toast.error(error)
      return
    }
    toast.success('Documento creado correctamente')
    push('/admin/documents')
  }

  const resetForm = () => {
    reset()
    setTags([])
    setTagInput('')
    setPdfUrl(null)
  }

  return (
    <>
      <section className="w-full mx-auto flex items-center justify-start gap-5">
        <Button asChild variant={'outline'} size={'icon'}>
          <Link href={'/admin/documents'}>
            <MdOutlineChevronLeft size={25} />
          </Link>
        </Button>

        <h1 className="text-3xl">Nuevo Documento</h1>
      </section>

      <div className="flex max-xl:flex-col-reverse gap-6 xl:h-[calc(100vh-200px)]">
        <div className="w-full h-full rounded overflow-hidden max-xl:h-[800px]">
          {pdfUrl ? (
            <PdfViewer className="w-full h-full" url={pdfUrl} />
          ) : (
            <div className="flex items-center justify-center h-full text-sm text-muted-foreground border rounded-lg">
              Vista previa no disponible. Selecciona un archivo PDF.
            </div>
          )}
        </div>

        <Card className="h-full overflow-auto w-full max-xl:h-[760px]">
          <CardHeader>
            <CardTitle>Información del Documento</CardTitle>
            <CardDescription>
              Completa los campos para describir tu documento.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6 text-sm"
            >
              <label className="flex flex-col gap-1">
                <span className="font-semibold">
                  Seleccionar Archivo: PDF, DOC, DOCX, TXT
                </span>
                <Input
                  id="file"
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  {...register('file')}
                  className={`cursor-pointer ${errors.file ? 'border-red-500' : ''}`}
                />
                {errors.file && (
                  <p className="text-xs text-red-500">
                    {errors.file.message?.toString()}
                  </p>
                )}
              </label>

              <label className="flex flex-col gap-1">
                <span className="font-semibold">Nombre del Documento</span>
                <Input
                  id="name"
                  placeholder="Ingresa el nombre del documento"
                  {...register('name')}
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-xs text-red-500">{errors.name.message}</p>
                )}
              </label>

              <label className="flex flex-col gap-1">
                <span className="font-semibold">Descripción</span>
                <Textarea
                  id="description"
                  placeholder="Describe el contenido del documento..."
                  className={`min-h-[100px] ${errors.description ? 'border-red-500' : ''}`}
                  {...register('description')}
                />
                {errors.description && (
                  <p className="text-xs text-red-500">
                    {errors.description.message}
                  </p>
                )}
              </label>

              <label className="flex flex-col gap-2">
                <span className="font-semibold">Tags</span>
                <div className="space-y-1">
                  <div className="flex gap-2">
                    <Input
                      id="tags"
                      placeholder="Escribe un tag y presiona Enter"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleKeyPress}
                      className={errors.tags ? 'border-red-500' : ''}
                    />
                    <Button
                      type="button"
                      onClick={addTag}
                      variant="outline"
                      disabled={!tagInput.trim()}
                    >
                      +
                    </Button>
                  </div>
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-1 bg-secondary rounded p-2 text-xs"
                        >
                          {tag}
                          <IoClose
                            className="h-4 w-4 cursor-pointer"
                            onClick={() => removeTag(tag)}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {errors.tags && (
                  <p className="text-xs text-red-500">{errors.tags.message}</p>
                )}
              </label>

              <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <label htmlFor="is_active" className="text-base">
                    Estado Activo
                  </label>
                  <p className="text-sm text-gray-500">
                    Documento disponible públicamente
                  </p>
                </div>
                <Switch
                  id="is_active"
                  checked={isActive}
                  onCheckedChange={(value) => setValue('is_active', value)}
                />
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  className="flex-1"
                >
                  Limpiar
                </Button>
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? (
                    <AiOutlineLoading
                      size={18}
                      className="animate-spin ease-in-out"
                    />
                  ) : (
                    <>Guardar Documento</>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
