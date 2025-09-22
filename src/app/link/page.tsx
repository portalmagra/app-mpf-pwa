'use client'

import { useState } from 'react'

export default function LinkConverter() {
  const [amazonUrl, setAmazonUrl] = useState('')
  const [convertedUrl, setConvertedUrl] = useState('')
  const [error, setError] = useState('')

  const extractAsin = (url: string): string | null => {
    // Regex para extrair ASIN de URLs da Amazon
    const patterns = [
      /\/dp\/([A-Z0-9]{10})/,
      /\/product\/([A-Z0-9]{10})/,
      /\/gp\/product\/([A-Z0-9]{10})/,
      /\/exec\/obidos\/ASIN\/([A-Z0-9]{10})/,
      /\/o\/ASIN\/([A-Z0-9]{10})/,
      /\/dp\/[^\/]*\/([A-Z0-9]{10})/,
      /\/[^\/]*\/([A-Z0-9]{10})(?:\/|$|\?)/
    ]
    
    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match) {
        return match[1]
      }
    }
    
    return null
  }

  const handleConvert = () => {
    setError('')
    setConvertedUrl('')
    
    if (!amazonUrl.trim()) {
      setError('Por favor, cole a URL da Amazon')
      return
    }

    const asin = extractAsin(amazonUrl)
    
    if (!asin) {
      setError('URL inválida. Por favor, cole uma URL válida da Amazon')
      return
    }

    const newUrl = `https://meuportalfit.com/link/${asin}`
    setConvertedUrl(newUrl)
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(convertedUrl)
      alert('URL copiada para a área de transferência!')
    } catch (err) {
      console.error('Erro ao copiar:', err)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl max-w-2xl w-full border-2 border-blue-200">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-800 mb-4">
            🔗 Conversor de Links Amazon
          </h1>
          <p className="text-lg text-blue-600">
            Converta URLs da Amazon em links do MeuPortalFit
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cole a URL da Amazon aqui:
            </label>
            <input
              type="url"
              value={amazonUrl}
              onChange={(e) => setAmazonUrl(e.target.value)}
              placeholder="https://www.amazon.com/dp/B0013OULJ4"
              className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            />
            {error && (
              <p className="text-red-500 text-sm mt-2">{error}</p>
            )}
          </div>

          <button
            onClick={handleConvert}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl transition duration-300 shadow-lg transform hover:scale-105"
          >
            🔄 Converter para Link do Portal
          </button>

          {convertedUrl && (
            <div className="bg-green-50 p-6 rounded-xl border border-green-200">
              <h3 className="text-lg font-semibold text-green-800 mb-3">
                ✅ Link convertido com sucesso!
              </h3>
              <div className="bg-white p-4 rounded-lg border border-green-300">
                <p className="text-sm text-gray-600 mb-2">Sua URL do Portal:</p>
                <p className="text-blue-600 font-mono text-sm break-all">
                  {convertedUrl}
                </p>
              </div>
              <button
                onClick={copyToClipboard}
                className="mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
              >
                📋 Copiar URL
              </button>
            </div>
          )}

          <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
            <h4 className="font-semibold text-yellow-800 mb-2">💡 Como usar:</h4>
            <ol className="text-sm text-yellow-700 space-y-1">
              <li>1. Cole qualquer URL da Amazon no campo acima</li>
              <li>2. Clique em "Converter"</li>
              <li>3. Use a URL gerada em seus links</li>
              <li>4. Quando alguém clicar, será redirecionado para a Amazon com sua tag de afiliado</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
