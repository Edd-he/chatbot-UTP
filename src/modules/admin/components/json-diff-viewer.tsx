'use client'
import React from 'react'
import DiffViewer from 'react-diff-viewer-continued'

type JsonCompareProps = {
  before: Record<string, any>
  after: Record<string, any>
  title?: string
}

export const JsonCompare: React.FC<JsonCompareProps> = ({ before, after }) => {
  const oldValue = JSON.stringify(before, null, 2)
  const newValue = JSON.stringify(after, null, 2)

  return (
    <div className="bg-card text-card-foreground">
      <DiffViewer
        oldValue={oldValue}
        newValue={newValue}
        splitView={false}
        hideLineNumbers
        showDiffOnly={true}
        extraLinesSurroundingDiff={1000}
        styles={{
          variables: {
            light: {
              diffViewerBackground: 'transparent',
              addedBackground: 'rgba(34,197,94,0.1)', // Tailwind green-500/10
              removedBackground: 'rgba(239,68,68,0.1)', // Tailwind red-500/10
              wordAddedBackground: 'rgba(34,197,94,0.3)',
              wordRemovedBackground: 'rgba(239,68,68,0.3)',
            },
          },
        }}
      />
    </div>
  )
}
