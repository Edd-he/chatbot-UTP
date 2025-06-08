import { IoShieldHalfSharp } from 'react-icons/io5'
import { GrDocumentStore } from 'react-icons/gr'
import { LuActivity } from 'react-icons/lu'
import { AiOutlineAudit } from 'react-icons/ai'
import { GoDiscussionOutdated } from 'react-icons/go'
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
]
