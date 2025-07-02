import { InputsData } from '../server_actions/fetch-top-inputs'

type Props = {
  data: InputsData[]
}

export default function TopInputsList({ data }: Props) {
  return (
    <ul className="relative flex flex-col h-full divide-y-2 divide-secondary">
      {data.map((input, i) => (
        <li
          key={i}
          className="text-sm flex justify-between w-full h-24 p-2 sm:p-4 items-center gap-3 relative hover:bg-muted/50 duration-200"
        >
          {input.question}
        </li>
      ))}
    </ul>
  )
}
