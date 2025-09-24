'use client'

import { useState, useEffect } from 'react'
import { X, Download, ArrowLeft, ArrowRight } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface ProtocolPreviewProps {
  protocol: {
    id: string
    name: string
    description: string
    category: string
  }
  onClose: () => void
  onDownload: () => void
}

export default function ProtocolPreview({ protocol, onClose, onDownload }: ProtocolPreviewProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadPreview()
  }, [protocol.id])

  const loadPreview = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Em produção, isso carregaria o PDF do Supabase Storage
      // Por enquanto, vamos simular um preview
      setTimeout(() => {
        setPreviewUrl('/api/protocol-preview/' + protocol.id)
        setLoading(false)
      }, 1000)
    } catch (err) {
      setError('Erro ao carregar preview')
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-brand-green text-white p-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">{protocol.name}</h2>
            <p className="text-sm text-green-100">{protocol.category}</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onDownload}
              className="p-2 bg-white text-brand-green rounded-lg hover:bg-gray-100 transition-colors"
              title="Download"
            >
              <Download className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 bg-white text-brand-green rounded-lg hover:bg-gray-100 transition-colors"
              title="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading && (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-green mx-auto mb-4"></div>
                <p className="text-brand-text2">Carregando preview...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="text-center h-64 flex items-center justify-center">
              <div>
                <p className="text-red-500 mb-4">{error}</p>
                <button
                  onClick={loadPreview}
                  className="px-4 py-2 bg-brand-green text-white rounded-lg hover:bg-brand-greenDark transition-colors"
                >
                  Tentar Novamente
                </button>
              </div>
            </div>
          )}

          {previewUrl && !loading && !error && (
            <div className="space-y-4">
              {/* Preview Placeholder */}
              <div className="bg-gray-100 rounded-lg p-8 text-center border-2 border-dashed border-gray-300">
                <div className="text-6xl mb-4">📄</div>
                <h3 className="text-lg font-bold text-brand-text mb-2">Preview do Protocolo</h3>
                <p className="text-brand-text2 mb-4">{protocol.description}</p>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Conteúdo do Protocolo:</strong>
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1 text-left">
                    <li>• Introdução e objetivos</li>
                    <li>• Plano nutricional detalhado</li>
                    <li>• Cronograma de suplementação</li>
                    <li>• Exercícios recomendados</li>
                    <li>• Acompanhamento e métricas</li>
                    <li>• FAQ e dúvidas comuns</li>
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center space-x-4">
                <button
                  onClick={onDownload}
                  className="px-6 py-3 bg-brand-green text-white rounded-lg font-bold hover:bg-brand-greenDark transition-colors flex items-center"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download Completo
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-colors"
                >
                  Fechar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
