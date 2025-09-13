'use client'

import { useState } from 'react'

interface ImageUploadProps {
  onImageUpload: (imageUrl: string) => void
  currentImage?: string
  className?: string
}

export default function ImageUpload({ onImageUpload, currentImage, className = '' }: ImageUploadProps) {
  const [imageUrl, setImageUrl] = useState(currentImage || '')

  const handleUrlChange = (url: string) => {
    setImageUrl(url)
    onImageUpload(url)
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        Imagem da Receita
      </label>
      
      {/* Preview da imagem */}
      {imageUrl && (
        <div className="relative">
          <img
            src={imageUrl}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg border border-gray-300"
            onError={() => {
              // Se a imagem não carregar, limpar a URL
              setImageUrl('')
              onImageUpload('')
            }}
          />
          <button
            type="button"
            onClick={() => handleUrlChange('')}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
          >
            ×
          </button>
        </div>
      )}

      {/* Campo de URL */}
      <div>
        <input
          type="url"
          value={imageUrl}
          onChange={(e) => handleUrlChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-brand-green focus:outline-none"
          placeholder="https://app.meuportalfit.com/images/recipes/receita-1.jpg"
        />
        <p className="text-xs text-gray-500 mt-1">
          Cole aqui a URL da imagem. Exemplo: https://app.meuportalfit.com/images/recipes/receita-1.jpg
        </p>
      </div>

      {/* Instruções */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">📋 Como adicionar imagens:</h4>
        <ol className="text-sm text-blue-800 space-y-1">
          <li>1. Salve a imagem JPG na pasta <code className="bg-blue-100 px-1 rounded">public/images/recipes/</code></li>
          <li>2. Use o nome: <code className="bg-blue-100 px-1 rounded">receita-{`{id}`}.jpg</code></li>
          <li>3. Cole a URL: <code className="bg-blue-100 px-1 rounded">https://app.meuportalfit.com/images/recipes/receita-{`{id}`}.jpg</code></li>
        </ol>
      </div>
    </div>
  )
}