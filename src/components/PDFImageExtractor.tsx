'use client'

import { useState, useEffect } from 'react'
import { extractImageFromPDF, generatePDFThumbnail } from '@/lib/pdfjs'

interface PDFImageExtractorProps {
  pdfUrl: string
  onImageExtracted: (imageUrl: string) => void
  className?: string
}

export default function PDFImageExtractor({ pdfUrl, onImageExtracted, className = '' }: PDFImageExtractorProps) {
  const [extracting, setExtracting] = useState(false)
  const [extractedImage, setExtractedImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null)

  // Gerar miniatura automaticamente quando o componente carrega
  useEffect(() => {
    if (pdfUrl) {
      const thumbnail = generatePDFThumbnail(pdfUrl)
      setThumbnailUrl(thumbnail)
    }
  }, [pdfUrl])

  const handleExtractImage = async () => {
    if (!pdfUrl) return

    setExtracting(true)
    setError(null)

    try {
      const imageUrl = await extractImageFromPDF(pdfUrl, 1, 2.0)
      setExtractedImage(imageUrl)
      onImageExtracted(imageUrl)
    } catch (err) {
      console.error('Erro ao extrair imagem do PDF:', err)
      setError('Erro ao extrair imagem do PDF')
    } finally {
      setExtracting(false)
    }
  }

  const handleRemoveImage = () => {
    if (extractedImage) {
      URL.revokeObjectURL(extractedImage)
    }
    setExtractedImage(null)
    onImageExtracted('')
  }

  const handleUseThumbnail = () => {
    if (thumbnailUrl) {
      onImageExtracted(thumbnailUrl)
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        Miniatura do PDF
      </label>
      
      {/* Miniatura automática do Google Drive */}
      {thumbnailUrl && (
        <div className="space-y-3">
          <div className="relative">
            <img
              src={thumbnailUrl}
              alt="Miniatura do PDF"
              className="w-full h-48 object-cover rounded-lg border border-gray-300"
              onError={() => setThumbnailUrl(null)}
            />
            <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs">
              📄 Miniatura Automática
            </div>
          </div>
          
          <button
            onClick={handleUseThumbnail}
            className="w-full py-2 px-4 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
          >
            ✅ Usar Esta Miniatura
          </button>
        </div>
      )}
      
      {/* Preview da imagem extraída manualmente */}
      {extractedImage && (
        <div className="relative">
          <img
            src={extractedImage}
            alt="Imagem extraída do PDF"
            className="w-full h-48 object-cover rounded-lg border border-gray-300"
          />
          <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded text-xs">
            🔧 Extração Manual
          </div>
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
          >
            ×
          </button>
        </div>
      )}

      {/* Botão para extrair */}
      <div className="space-y-2">
        <button
          onClick={handleExtractImage}
          disabled={extracting || !pdfUrl}
          className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
            extracting || !pdfUrl
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-brand-green text-white hover:bg-brand-greenDark'
          }`}
        >
          {extracting ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Extraindo imagem...</span>
            </div>
          ) : (
            '📄 Extrair Imagem do PDF'
          )}
        </button>
        
        {pdfUrl && (
          <p className="text-xs text-gray-500 text-center">
            PDF: {pdfUrl.split('/').pop()}
          </p>
        )}
      </div>

      {/* Mensagem de erro */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Instruções */}
      <div className="bg-green-50 p-4 rounded-lg">
        <h4 className="font-medium text-green-900 mb-2">✨ Miniatura Automática:</h4>
        <ul className="text-sm text-green-800 space-y-1">
          <li>• <strong>Recomendado:</strong> Use a miniatura automática do Google Drive</li>
          <li>• Mostra a primeira página do PDF como preview</li>
          <li>• Clique em &quot;Usar Esta Miniatura&quot; para aplicar</li>
          <li>• <strong>Alternativa:</strong> Use &quot;Extrair Imagem&quot; para processamento manual</li>
        </ul>
      </div>
    </div>
  )
}
