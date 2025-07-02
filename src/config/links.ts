import { IoShieldHalfSharp } from 'react-icons/io5'
import { GrDocumentStore } from 'react-icons/gr'
import { LuActivity } from 'react-icons/lu'
import { AiOutlineAudit } from 'react-icons/ai'
import { GoDiscussionOutdated } from 'react-icons/go'
import { RiGeminiLine } from 'react-icons/ri'
export const ADMIN_LINKS = [
  {
    label: 'Monitoreo',
    src: '/admin/monitoring',
    icon: LuActivity,
  },
  {
    label: 'Tópicos',
    src: '/admin/topics',

    icon: GoDiscussionOutdated,
  },
  {
    label: 'Documentos',
    src: '/admin/documents',
    module: 'documents',
    icon: GrDocumentStore,
  },
  {
    label: 'Usuarios',
    src: '/admin/users',
    icon: IoShieldHalfSharp,
  },
  {
    label: 'Auditoria',
    src: '/admin/logs',
    icon: AiOutlineAudit,
  },
  {
    label: 'Gemini',
    src: '/admin/gemini',
    icon: RiGeminiLine,
  },
]
export const ACCESS_MODULES = [
  { module: 'monitoring', title: 'Monitoreo' },
  { module: 'topics', title: 'Tópicos' },
  { module: 'documents', title: 'Documentos' },
  { module: 'logs', title: 'Auditoría' },
  { module: 'gemini', title: 'Gemini' },
]
