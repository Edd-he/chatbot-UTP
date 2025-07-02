'use client'

import { useState } from 'react'
import {
  Activity,
  MessageSquare,
  FileText,
  ScrollText,
  Sparkles,
} from 'lucide-react'
import { Badge } from '@shared/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@shared/components/ui/card'
import { Switch } from '@shared/components/ui/switch'

import { ModuleAccess } from '../types/users.types'

export default function AccessSelector() {
  const [permissions, setPermissions] = useState<Record<ModuleAccess, boolean>>(
    {
      monitoring: false,
      topics: true,
      documents: true,
      logs: false,
      gemini: false,
    },
  )

  const handlePermissionChange = (module: ModuleAccess, checked: boolean) => {
    setPermissions((prev) => ({
      ...prev,
      [module]: checked,
    }))
  }

  const moduleConfig = {
    monitoring: {
      title: 'Monitoreo',
      icon: Activity,
      description: 'Acceso al sistema de monitoreo',
    },
    topics: {
      title: 'Tópicos',
      icon: MessageSquare,
      description: 'Gestión de tópicos',
    },
    documents: {
      title: 'Documentos',
      icon: FileText,
      description: 'Acceso completo a la gestión de documentos',
    },
    logs: {
      title: 'Logs',
      icon: ScrollText,
      description: 'Visualización de auditoría de usuarios',
    },
    gemini: {
      title: 'Gemini',
      icon: Sparkles,
      description: 'Integración y uso de funcionalidades de Gemini AI',
    },
  }

  const activeModulesCount = Object.values(permissions).filter(Boolean).length
  const totalModules = Object.keys(permissions).length

  return (
    <Card>
      <CardHeader>
        <div className="flex-1">
          <CardTitle className="flex items-center gap-2">
            Permisos de Módulos
            <Badge variant="secondary" className="ml-auto">
              {activeModulesCount}/{totalModules}
            </Badge>
          </CardTitle>
          <CardDescription>
            Activa o desactiva el acceso a cada módulo del sistema
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(moduleConfig).map(([moduleKey, config]) => {
          const module = moduleKey as ModuleAccess
          const isActive = permissions[module]

          return (
            <div key={module} className="flex items-center justify-between">
              <div className="flex items-start gap-4 flex-1">
                <div className={'p-2 rounded-lg'}>
                  <config.icon className={'size-5'} />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <label
                      htmlFor={module}
                      className="text-sm font-medium cursor-pointer"
                    >
                      {config.title}
                    </label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {config.description}
                  </p>
                </div>
              </div>
              <Switch
                id={module}
                checked={isActive}
                onCheckedChange={(checked) =>
                  handlePermissionChange(module, checked)
                }
                className="ml-4"
              />
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
