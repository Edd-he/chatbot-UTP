import { Skeleton } from '@shared/components/ui/skeleton'

type Props = {
  rows: number
}

export default function TableSkeleton({ rows }: Props) {
  const skeletonRows = Array(rows).fill(null)

  return (
    <>
      {skeletonRows.map((_, index) => (
        <tr key={index} className="relative h-14">
          <td colSpan={9} className="text-center">
            <Skeleton className="h-10" />
          </td>
        </tr>
      ))}
    </>
  )
}
