'use client'

import { useState, useEffect } from 'react'
import { generatePDFThumbnail } from '@/lib/pdfjs'

interface PDFImageExtractorProps {
  pdfUrl: string
  onImageExtracted: (imageUrl: string) => void
  className?: string
}

export default function PDFImageExtractor({ pdfUrl, onImageExtracted, className = '' }: PDFImageExtractorProps) {
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null)
  const [manualImageUrl, setManualImageUrl] = useState<string>('')

  // Gerar miniatura automaticamente quando o componente carrega
  useEffect(() => {
    if (pdfUrl) {
      const thumbnail = generatePDFThumbnail(pdfUrl)
      setThumbnailUrl(thumbnail)
    }
  }, [pdfUrl])

  const handleUseThumbnail = () => {
    if (thumbnailUrl) {
      onImageExtracted(thumbnailUrl)
    }
  }

  const handleManualImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value
    setManualImageUrl(url)
    if (url) {
      onImageExtracted(url)
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Miniatura automática do Google Drive */}
      {thumbnailUrl && (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            📄 Miniatura Automática do PDF
          </label>
          
          <div className="relative">
            <img
              src={thumbnailUrl}
              alt="Miniatura do PDF"
              className="w-full h-48 object-cover rounded-lg border border-gray-300"
              onError={() => setThumbnailUrl(null)}
            />
            <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs">
              ✅ Automática
            </div>
          </div>
          
          <button
            type="button"
            onClick={handleUseThumbnail}
            className="w-full py-2 px-4 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
          >
            ✅ Usar Esta Miniatura
          </button>
        </div>
      )}

      {/* Área para upload manual */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          📷 Ou Cole uma URL de Imagem
        </label>
        
        <input
          type="url"
          value={manualImageUrl}
          onChange={handleManualImageChange}
          placeholder="https://exemplo.com/imagem.jpg"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent"
        />
        
        {manualImageUrl && (
          <div className="relative">
            <img
              src={manualImageUrl}
              alt="Imagem manual"
              className="w-full h-48 object-cover rounded-lg border border-gray-300"
              onError={() => {
                // Se a imagem não carregar, limpar o campo
                setManualImageUrl('')
                onImageExtracted('')
              }}
            />
            <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded text-xs">
              📷 Manual
            </div>
          </div>
        )}
      </div>

      {/* Instruções simplificadas */}
      <div className="bg-green-50 p-4 rounded-lg">
        <h4 className="font-medium text-green-900 mb-2">✨ Como Funciona:</h4>
        <ul className="text-sm text-green-800 space-y-1">
          <li>• <strong>Automático:</strong> Miniatura aparece automaticamente do PDF</li>
          <li>• <strong>Manual:</strong> Cole uma URL de imagem se preferir</li>
          <li>• <strong>Simples:</strong> Um clique para aplicar a imagem</li>
        </ul>
      </div>
    </div>
  )
}
