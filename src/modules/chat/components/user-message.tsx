type Props = {
  text: string
}
export default function UserMessage({ text }: Props) {
  return (
    <div className="bg-primary text-primary-foreground px-4 py-2 rounded-lg w-fit ml-auto max-w-9/12 max-sm:max-w-1/2 max-sm:text-xs">
      {text}
    </div>
  )
}
