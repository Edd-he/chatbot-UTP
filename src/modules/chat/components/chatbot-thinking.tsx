export default function ChatbotThinking() {
  return (
    <div className="flex items-center gap-3 mb-2">
      <div className="flex gap-1">
        <div className="size-2 bg-primary rounded-full animate-bounce"></div>
        <div
          className="size-2 bg-primary rounded-full animate-bounce"
          style={{ animationDelay: '0.1s' }}
        ></div>
        <div
          className="size-2 bg-primary rounded-full animate-bounce"
          style={{ animationDelay: '0.2s' }}
        ></div>
      </div>
      <span className="text-lg">Pensando...</span>
    </div>
  )
}
