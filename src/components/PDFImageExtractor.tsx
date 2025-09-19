'use client'

import { useState, useEffect } from 'react'
import { generatePDFThumbnail, getPDFThumbnailWithFallback } from '@/lib/pdfjs'

interface PDFImageExtractorProps {
  pdfUrl: string
  onImageExtracted: (imageUrl: string) => void
  className?: string
}

export default function PDFImageExtractor({ pdfUrl, onImageExtracted, className = '' }: PDFImageExtractorProps) {
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null)
  const [manualImageUrl, setManualImageUrl] = useState<string>('')
  const [loading, setLoading] = useState(false)

  // Gerar miniatura automaticamente quando o componente carrega
  useEffect(() => {
    if (pdfUrl) {
      const loadThumbnail = async () => {
        setLoading(true)
        try {
          // Tentar método com fallback
          const thumbnail = await getPDFThumbnailWithFallback(pdfUrl)
          setThumbnailUrl(thumbnail)
          onImageExtracted(thumbnail)
        } catch (error) {
          console.error('Erro ao carregar thumbnail:', error)
          // Fallback para método simples
          const thumbnail = generatePDFThumbnail(pdfUrl)
          setThumbnailUrl(thumbnail)
          onImageExtracted(thumbnail)
        } finally {
          setLoading(false)
        }
      }
      
      loadThumbnail()
    }
  }, [pdfUrl]) // Removido onImageExtracted das dependências para evitar loop infinito

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
      {(thumbnailUrl || loading) && (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            📄 Miniatura Automática do PDF
          </label>
          
          <div className="relative">
            {loading ? (
              <div className="w-full h-48 bg-gray-100 rounded-lg border border-gray-300 flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-2"></div>
                  <p className="text-sm text-gray-600">Extraindo capa...</p>
                </div>
              </div>
            ) : (
              <img
                src={thumbnailUrl!}
                alt="Miniatura do PDF"
                className="w-full h-48 object-cover rounded-lg border border-gray-300"
                onError={() => setThumbnailUrl(null)}
              />
            )}
            {thumbnailUrl && !loading && (
              <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs">
                ✅ Aplicada Automaticamente
              </div>
            )}
          </div>
        </div>
      )}

      {/* Área para upload manual */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          📷 Ou Cole uma URL de Imagem Personalizada
        </label>
        
        <input
          type="url"
          value={manualImageUrl}
          onChange={handleManualImageChange}
          placeholder="https://exemplo.com/capa-personalizada.jpg"
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
              📷 Capa Personalizada
            </div>
          </div>
        )}
      </div>

      {/* Instruções simplificadas */}
      <div className="bg-green-50 p-4 rounded-lg">
        <h4 className="font-medium text-green-900 mb-2">✨ Como Funciona:</h4>
        <ul className="text-sm text-green-800 space-y-1">
          <li>• <strong>Automático:</strong> Miniatura é extraída da primeira página do PDF</li>
          <li>• <strong>Personalizada:</strong> Cole uma URL de capa personalizada se preferir</li>
          <li>• <strong>Instantâneo:</strong> A imagem é aplicada automaticamente</li>
          <li>• <strong>Flexível:</strong> Você pode usar qualquer uma das opções</li>
        </ul>
      </div>
    </div>
  )
}
