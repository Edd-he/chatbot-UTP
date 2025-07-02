'use client'

import { IconType } from 'react-icons'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { RiGeminiLine } from 'react-icons/ri'
import { BiChevronRight } from 'react-icons/bi'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@shared/components/ui/sidebar'
import { useSession } from 'next-auth/react'

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/modules/shared/components/ui/collapsible'

type Props = {
  links: {
    label: string
    src: string
    icon?: IconType
  }[]
}

export function NavMain({ links }: Props) {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [activeIndex, setActiveIndex] = useState(0)

  const role = session?.user.role
  const modules = session?.user.modules || []

  const filteredLinks =
    role === 'SUPER_ADMIN'
      ? links
      : links.filter((link) => {
          if (link.src === '/admin/users') return false
          const module = link.src.split('/')[2]
          return modules.includes(module)
        })

  useEffect(() => {
    const index = filteredLinks.findIndex((link) =>
      pathname.startsWith(link.src),
    )
    setActiveIndex(index !== -1 ? index : 0)
  }, [pathname, filteredLinks])

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Navegación</SidebarGroupLabel>
      <SidebarMenu className="relative">
        {filteredLinks.map((item, index) =>
          item.src !== '/admin/gemini' ? (
            <SidebarMenuItem key={index}>
              <SidebarMenuButton
                asChild
                className={`[&>svg]:size-6 group-data-[collapsible=icon]:[&>svg]:mx-4 [&>svg]:mx-2 h-12 gap-2 duration-200 ${
                  index === activeIndex
                    ? 'bg-blue-light hover:bg-blue-light'
                    : ''
                }`}
                tooltip={item.label}
              >
                <Link prefetch href={item.src}>
                  {item.icon && <item.icon />}
                  {item.label}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ) : (
            <Collapsible key={index}>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className={`[&>svg]:size-6 group-data-[collapsible=icon]:[&>svg]:mx-4 [&>svg]:mx-2 h-12 gap-2 duration-200 ${
                    index === activeIndex
                      ? 'bg-blue-light hover:bg-blue-light'
                      : ''
                  }`}
                >
                  <CollapsibleTrigger className="[&[data-state=open]>svg]:rotate-90">
                    <RiGeminiLine />
                    Gemini
                    <BiChevronRight className="!size-4 !ml-18 duration-200 transition-transform" />
                  </CollapsibleTrigger>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <CollapsibleContent>
                <SidebarMenuSub>
                  <SidebarMenuSubButton asChild className="h-10">
                    <Link href={'/admin/gemini/conversations'}>
                      Conversaciones
                    </Link>
                  </SidebarMenuSubButton>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild className="h-10">
                      <Link href={'/admin/gemini/runs'}>Ejecuciones</Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </CollapsibleContent>
            </Collapsible>
          ),
        )}
      </SidebarMenu>
    </SidebarGroup>
  )
}
