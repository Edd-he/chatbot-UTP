import { AiOutlinePlus } from 'react-icons/ai'

import { tourney } from '@/config/fonts'

interface Props {
  iconClassName?: string
  className?: string
}
export default function UTP({ iconClassName, className }: Props) {
  return (
    <span className="h-full flex flex-center">
      <span className={`${tourney.className} ${className}`}>UTP</span>
      <AiOutlinePlus strokeWidth={70} className={`${iconClassName}`} />
    </span>
  )
}
