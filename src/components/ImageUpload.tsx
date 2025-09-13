'use client'

import { useState } from 'react'
import { getCloudinaryUploadUrl } from '@/lib/cloudinary'

interface ImageUploadProps {
  onImageUpload: (imageUrl: string) => void
  currentImage?: string
  className?: string
}

export default function ImageUpload({ onImageUpload, currentImage, className = '' }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(currentImage || null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione apenas arquivos de imagem')
      return
    }

    // Validar tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('A imagem deve ter no máximo 5MB')
      return
    }

    setUploading(true)

    try {
      // Criar FormData
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', 'meuportalfit_recipes') // Preset do Cloudinary

      // Upload para Cloudinary
      const response = await fetch(getCloudinaryUploadUrl(), {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Erro no upload')
      }

      const data = await response.json()
      const imageUrl = data.secure_url

      setPreview(imageUrl)
      onImageUpload(imageUrl)
    } catch (error) {
      console.error('Erro no upload:', error)
      alert('Erro ao fazer upload da imagem. Tente novamente.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        Imagem da Receita
      </label>
      
      {/* Preview da imagem */}
      {preview && (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg border border-gray-300"
          />
          <button
            type="button"
            onClick={() => {
              setPreview(null)
              onImageUpload('')
            }}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
          >
            ×
          </button>
        </div>
      )}

      {/* Input de upload */}
      <div className="relative">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          disabled={uploading}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-brand-green file:text-white hover:file:bg-brand-greenDark disabled:opacity-50"
        />
        {uploading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
            <div className="text-brand-green font-medium">Enviando...</div>
          </div>
        )}
      </div>

      <p className="text-xs text-gray-500">
        Formatos aceitos: JPG, PNG, GIF. Tamanho máximo: 5MB
      </p>
    </div>
  )
}
