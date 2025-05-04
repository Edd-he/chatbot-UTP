'use client'

import ReactMarkdown, { Components } from 'react-markdown'

const markdownComponents: Components = {
  h1: ({ ...props }) => {
    return <h1 className="animate-in fade-in ease-in duration-300" {...props} />
  },
  p: ({ ...props }) => {
    return <p className="animate-in fade-in ease-in duration-300" {...props} />
  },
  li: ({ ...props }) => {
    return <li className="animate-in fade-in ease-in duration-300" {...props} />
  },
  strong: ({ ...props }) => {
    return (
      <strong className="animate-in fade-in ease-in duration-300" {...props} />
    )
  },
  em: ({ ...props }) => {
    return <em className="animate-in fade-in ease-in duration-300" {...props} />
  },
}

export default function CustomMarkdown({ children }: { children: string }) {
  return (
    <ReactMarkdown components={markdownComponents}>{children}</ReactMarkdown>
  )
}
