'use client'

import { useState } from 'react'
import Link from 'next/link'
import Logo from '@/components/Logo'
import BottomNavigation from '@/components/BottomNavigation'

export default function AmazonPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchMessage, setSearchMessage] = useState('')

  // Função para buscar produtos na Amazon
  const searchAmazonProducts = async (query: string) => {
    if (!query || query.trim().length < 2) {
      return;
    }
    
    // Construir URL da Amazon com nossa tag
    const amazonSearchUrl = `https://www.amazon.com/s?k=${encodeURIComponent(query.trim())}&tag=portalsolutio-20`;
    
    // Abrir nova aba/janela com a busca na Amazon
    window.open(amazonSearchUrl, '_blank');
    
    // Mostrar mensagem de sucesso
    setSearchMessage(`Buscando os melhores produtos "${query}" para você...`);
  };

  // Buscar produtos quando o usuário pressionar Enter
  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchAmazonProducts(searchTerm);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-brand-greenSoft border-b border-brand-border px-4 py-3">
        <div className="max-w-sm mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Logo />
            <div>
              <h1 className="text-lg font-bold text-brand-text">Portal Fit</h1>
              <p className="text-xs text-brand-textLight">Brasileiros nos EUA</p>
            </div>
          </Link>
          <Link href="/" className="text-brand-textLight text-sm">
            ← Voltar ao App
          </Link>
        </div>
      </header>

      <main className="pb-20">
        {/* Hero Section Simplificado */}
        <section className="px-4 py-8">
          <div className="max-w-sm mx-auto text-center">
            {/* Amazon Logo Header */}
            <div className="mb-6">
              <div className="flex items-center justify-center gap-3 mb-2">
                <img 
                  src="/icons/amazon-logo-official.png" 
                  alt="Amazon" 
                  width="48" 
                  height="48"
                  className="object-contain"
                />
                <h2 className="text-2xl font-bold text-green-800">Busca Amazon</h2>
              </div>
              <p className="text-green-600 text-sm">Encontre os melhores produtos com nossa curadoria especializada</p>
            </div>

            {/* Search Bar */}
            <div className="relative mb-8">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleSearchKeyPress}
                placeholder="Digite o que você procura..."
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent"
              />
              <button
                onClick={() => searchAmazonProducts(searchTerm)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-brand-green text-white p-2 rounded-lg hover:bg-brand-greenDark transition-colors"
              >
                🔍
              </button>
            </div>

            {/* Por Que Comprar Através do MeuPortalFit */}
            <div className="bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-200 text-green-800 p-6 rounded-xl mb-6">
              <h2 className="text-xl font-bold mb-3 text-green-900">
                🛒 Por Que Comprar na Amazon Através do Portal Fit?
              </h2>
              <p className="text-green-700 mb-4">
                Nossa curadoria especializada é <strong>100% gratuita</strong> para você!
              </p>
              
              {/* Benefícios */}
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">🎯</span>
                  <div>
                    <h3 className="font-semibold text-green-900">Curadoria Especializada</h3>
                    <p className="text-sm text-green-700">
                      Selecionamos apenas produtos de qualidade comprovada, testados por brasileiros nos EUA
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">💰</span>
                  <div>
                    <h3 className="font-semibold text-green-900">Sem Custo Adicional</h3>
                    <p className="text-sm text-green-700">
                      Você paga o mesmo preço da Amazon. Nossa comissão vem da Amazon, não do seu bolso!
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">🇧🇷</span>
                  <div>
                    <h3 className="font-semibold text-green-900">Feito para Brasileiros</h3>
                    <p className="text-sm text-green-700">
                      Produtos que funcionam no clima americano e atendem necessidades específicas de brasileiros
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Call-to-Action */}
            <div className="bg-gradient-to-r from-green-100 to-green-200 border-2 border-green-300 text-green-800 p-6 rounded-xl">
              <h3 className="text-lg font-bold mb-2 text-green-900">
                🚀 Pronto para Encontrar os Melhores Produtos?
              </h3>
              <p className="text-green-700 mb-4">
                Digite o que você procura e deixe nossa curadoria trabalhar para você!
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSearchMessage('');
                }}
                className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                🔍 Fazer Nova Busca
              </button>
            </div>

            {/* Mensagem de busca */}
            {searchMessage && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 text-sm">
                  {searchMessage}
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation currentPage="/amazon" />
    </div>
  )
}
