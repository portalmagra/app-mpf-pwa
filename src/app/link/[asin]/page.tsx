'use client'

import { useEffect } from 'react'
import { useParams } from 'next/navigation'

export default function LinkAmazon() {
  const params = useParams()
  const asin = params.asin as string

  useEffect(() => {
    if (asin) {
      // Redirecionar para Amazon com tag de afiliado
      const amazonUrl = `https://www.amazon.com/dp/${asin}?tag=portalsolutio-20`
      window.location.href = amazonUrl
    }
  }, [asin])

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-md w-full border-2 border-orange-200">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500 mx-auto mb-6"></div>
        <h2 className="text-2xl font-bold text-orange-800 mb-3">Redirecionando para Amazon...</h2>
        <p className="text-orange-600 mb-4">
          Você será redirecionado para o produto na Amazon em alguns segundos.
        </p>
        <p className="text-sm text-gray-500">
          Se não for redirecionado automaticamente, 
          <a 
            href={`https://www.amazon.com/dp/${asin}?tag=portalsolutio-20`}
            className="text-orange-600 hover:text-orange-800 underline ml-1"
          >
            clique aqui
          </a>
        </p>
      </div>
    </div>
  )
}
