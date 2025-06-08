/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
'use client'

import { IconType } from 'react-icons'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { RiGeminiLine } from 'react-icons/ri'
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
import { BiChevronDown } from 'react-icons/bi'

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
    const index = links.findIndex((link) => link.src === pathname)
    setActiveIndex(index !== -1 ? index : 0)
  }, [pathname, links])

  const itemHeight = 56
  const gap = 4
  const indicatorOffset = activeIndex * (itemHeight + gap)

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Navegación</SidebarGroupLabel>
      <SidebarMenu className="relative">
        {links.map((item, index) => (
          <SidebarMenuItem key={index}>
            <SidebarMenuButton
              asChild
              tooltip={item.label}
              className="[&>svg]:size-6 group-data-[collapsible=icon]:[&>svg]:mx-4 [&>svg]:mx-2 h-12 gap-2 duration-200"
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
            <CollapsibleTrigger asChild>
              <SidebarMenuButton className="[&>svg]:size-6 group-data-[collapsible=icon]:[&>svg]:mx-4 [&>svg]:mx-2 h-12 duration-200">
                <RiGeminiLine />
                Gemini
                <BiChevronDown size={2} className="ml-6" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
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
