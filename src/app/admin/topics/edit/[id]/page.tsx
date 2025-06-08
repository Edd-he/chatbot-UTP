'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { Textarea } from '@shared/components/ui/textarea'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@shared/components/ui/card'
import { Input } from '@shared/components/ui/input'
import { Button } from '@shared/components/ui/button'
import { Switch } from '@shared/components/ui/switch'
import { useRouter } from 'next/navigation'
import { AiOutlineLoading } from 'react-icons/ai'
import { use, useEffect } from 'react'
import _ from 'lodash'

import { topicSchema } from '@/modules/admin/schemas/topics-schema'
import { useSendRequest } from '@/modules/shared/hooks/use-send-request'
import { BACKEND_URL } from '@/lib/constants'
import { useGetData } from '@/modules/shared/hooks/use-get-data'
import { Topic } from '@/modules/admin/types/topics.types'

type Props = {
  params: Promise<{ id: string }>
}

type TopicFormEditValues = z.infer<typeof topicSchema>

export default function Page({ params }: Props) {
  const { id } = use(params)
  const url = `${BACKEND_URL}/topics/${id}/get-topic`

  const {
    data: topic,
    error: getError,
    loading: getLoading,
  } = useGetData<Topic>(url)
  const { sendRequest, loading } = useSendRequest(
    `${BACKEND_URL}/topics/${id}/update-topic`,
    'PATCH',
  )
  const { push } = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<TopicFormEditValues>({
    resolver: zodResolver(topicSchema),
    defaultValues: {
      name: '',
      description: '',
      is_active: true,
    },
  })

  const isActive = watch('is_active')

  async function onSubmit(data: TopicFormEditValues) {
    console.warn(data)
    console.warn(topic)
    if (!topic) {
      toast.warning('Error al obtener el tópico')
      return
    }

    if (_.isEqual(editableValues(topic), data)) {
      toast.warning('No se está actualizando nada en los datos del tópico')
      return
    }
    const { error } = await sendRequest(data)
    if (error) {
      toast.error(error)
      return
    }
    toast.success('Tópico actualizado Correctamente')
    push('/admin/topics')
  }

  if (getError) toast.error(getError)

  useEffect(() => {
    if (topic) reset(topic)
  }, [topic, reset])
  return (
    <div className="max-w-3xl mx-auto w-full">
      <Card>
        <CardHeader>
          <CardTitle>Editar Tópico</CardTitle>
          <CardDescription>
            Completa el formulario para agregar un nuevo tópico a la base de
            datos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
            <label className="flex flex-col gap-1">
              <span className="font-semibold">Nombre</span>
              <Input
                id="name"
                placeholder="Ingresa el nombre del tópico"
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
                placeholder="Describe el tópico en detalle..."
                className={`min-h-[100px] ${errors.description ? 'border-red-500' : ''}`}
                {...register('description')}
              />
              {errors.description && (
                <p className="text-xs text-red-500">
                  {errors.description.message}
                </p>
              )}
            </label>

            <div className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <label htmlFor="is_active" className="text-base font-semibold">
                  Estado Activo
                </label>
                <p className="text-sm text-gray-500">
                  Determina si el tópico estará disponible para el uso de la IA.
                </p>
              </div>
              <Switch
                id="is_active"
                checked={isActive}
                onCheckedChange={(checked) => setValue('is_active', checked)}
              />
            </div>

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => reset()}
                className="flex-1"
              >
                Limpiar
              </Button>
              <Button
                type="submit"
                disabled={loading || getLoading}
                className="flex-1"
              >
                {loading ? (
                  <AiOutlineLoading
                    size={18}
                    className="animate-spin ease-in-out"
                  />
                ) : (
                  <>Guardar Tópico</>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

function editableValues(topic: Topic): TopicFormEditValues {
  return {
    name: topic.name,
    description: topic.description,
    is_active: topic.is_active,
  }
}
