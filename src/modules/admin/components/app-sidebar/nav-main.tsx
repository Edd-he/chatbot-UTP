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
  const pathname = usePathname()
  const [activeIndex, setActiveIndex] = useState(0)
  useEffect(() => {
    const index = links.findIndex((link) => link.src.startsWith(pathname))
    setActiveIndex(index !== -1 ? index : 0)
  }, [pathname, links])

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Navegación</SidebarGroupLabel>
      <SidebarMenu className="relative">
        {links.map((item, index) => (
          <SidebarMenuItem key={index}>
            <SidebarMenuButton
              asChild
              className={`[&>svg]:size-6 group-data-[collapsible=icon]:[&>svg]:mx-4 [&>svg]:mx-2 h-12 gap-2 duration-200 ${
                index === activeIndex ? 'bg-blue-light hover:bg-blue-light' : ''
              }`}
              tooltip={item.label}
            >
              <Link href={item.src}>
                {item.icon && <item.icon />}
                {item.label}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
        <Collapsible>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="relative [&>svg]:size-6 group-data-[collapsible=icon]:[&>svg]:mx-4 [&>svg]:mx-2 h-12 duration-200"
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
                <Link href={'/admin/gemini/conversations'}>Conversaciones</Link>
              </SidebarMenuSubButton>
              <SidebarMenuSubItem>
                <SidebarMenuSubButton asChild className="h-10">
                  <Link href={'/admin/gemini/runs'}>Ejecuciones</Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            </SidebarMenuSub>
          </CollapsibleContent>
        </Collapsible>
      </SidebarMenu>
    </SidebarGroup>
  )
}
