'use client'

import * as React from 'react'
import { Viewer, Worker, ViewMode, ScrollMode } from '@react-pdf-viewer/core'
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'

type Props = {
  className?: string
  url?: string
}

export default function PdfViewer({ className = '', url }: Props) {
  const defaultLayoutPluginInstance = defaultLayoutPlugin()

  if (!url) {
    return (
      <div className={`${className} w-full h-full flex-center text-gray-500`}>
        No se ha proporcionado un archivo PDF.
      </div>
    )
  }

  return (
    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.js">
      <div className={`${className} w-full`}>
        <Viewer
          scrollMode={ScrollMode.Page}
          viewMode={ViewMode.SinglePage}
          fileUrl={url}
          theme={{ theme: 'dark' }}
          plugins={[defaultLayoutPluginInstance]}
        />
      </div>
    </Worker>
  )
}
