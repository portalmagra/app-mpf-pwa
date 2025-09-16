'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Logo from '@/components/Logo'

interface ProtocoloSalvo {
  id: number
  nome: string
  descricao: string
  categoria: string
  link_pdf: string
  data_salvamento: string
  emoji: string
}

// Função para gerar emoji baseado no nome do protocolo
const getProtocoloEmoji = (nome: string, categoria: string): string => {
  const nomeLower = nome.toLowerCase()
  const categoriaLower = categoria.toLowerCase()
  
  if (categoriaLower.includes('emagrecimento') || categoriaLower.includes('perda')) return '🔥'
  if (categoriaLower.includes('energia') || categoriaLower.includes('energético')) return '⚡'
  if (categoriaLower.includes('imunidade') || categoriaLower.includes('imune')) return '🛡️'
  if (categoriaLower.includes('ansiedade') || categoriaLower.includes('stress')) return '🧘'
  if (categoriaLower.includes('sono') || categoriaLower.includes('sleep')) return '😴'
  if (categoriaLower.includes('digestão') || categoriaLower.includes('digestivo')) return '🌿'
  if (categoriaLower.includes('musculação') || categoriaLower.includes('muscular')) return '💪'
  if (categoriaLower.includes('detox') || categoriaLower.includes('limpeza')) return '🧹'
  
  if (nomeLower.includes('emagrecimento') || nomeLower.includes('perda')) return '🔥'
  if (nomeLower.includes('energia') || nomeLower.includes('energético')) return '⚡'
  if (nomeLower.includes('imunidade') || nomeLower.includes('imune')) return '🛡️'
  if (nomeLower.includes('ansiedade') || nomeLower.includes('stress')) return '🧘'
  if (nomeLower.includes('sono') || nomeLower.includes('sleep')) return '😴'
  if (nomeLower.includes('digestão') || nomeLower.includes('digestivo')) return '🌿'
  if (nomeLower.includes('musculação') || nomeLower.includes('muscular')) return '💪'
  if (nomeLower.includes('detox') || nomeLower.includes('limpeza')) return '🧹'
  
  return '📋'
}

export default function MeusProtocolosPage() {
  const [protocolosSalvos, setProtocolosSalvos] = useState<ProtocoloSalvo[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    // Carregar protocolos salvos do localStorage
    const loadSavedProtocols = () => {
      try {
        const savedProtocols = localStorage.getItem('meusProtocolos')
        if (savedProtocols) {
          const protocols = JSON.parse(savedProtocols)
          setProtocolosSalvos(protocols)
        }
        setLoading(false)
      } catch (error) {
        console.error('❌ Erro ao carregar protocolos salvos:', error)
        setLoading(false)
      }
    }

    loadSavedProtocols()
  }, [])

  // Filtrar protocolos baseado no termo de busca
  const filteredProtocolos = protocolosSalvos.filter(protocolo =>
    protocolo.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    protocolo.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
    protocolo.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleRemoverProtocolo = (id: number) => {
    const novosProtocolos = protocolosSalvos.filter(protocolo => protocolo.id !== id)
    setProtocolosSalvos(novosProtocolos)
    localStorage.setItem('meusProtocolos', JSON.stringify(novosProtocolos))
  }

  const handleCompartilharWhatsApp = (protocolo: ProtocoloSalvo) => {
    const mensagem = `📋 *${protocolo.nome}*\n\n${protocolo.descricao}\n\n📖 Veja o protocolo completo: ${protocolo.link_pdf}\n\n✨ Protocolo salvo do MeuPortalFit`
    const url = `https://wa.me/?text=${encodeURIComponent(mensagem)}`
    window.open(url, '_blank')
  }

  const handleAcessarProtocolo = (protocolo: ProtocoloSalvo) => {
    window.open(protocolo.link_pdf, '_blank')
  }

  return (
    <div className="min-h-screen bg-brand-cream">
      {/* Header */}
      <header className="bg-white shadow-soft sticky top-0 z-50">
        <div className="max-w-sm mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <Logo variant="horizontal" size="md" />
            <Link href="/protocolos">
              <button className="bg-brand-green text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-greenDark transition-colors">
                ← Voltar
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="max-w-sm mx-auto px-4 py-6">
        {/* Título */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-brand-text">
            📋 Meus Protocolos
          </h1>
          <p className="text-brand-text2 mt-2">
            Seus protocolos de bem-estar salvos
          </p>
        </div>

        {/* Busca */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Buscar nos seus protocolos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green"
          />
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-green mx-auto mb-4"></div>
            <p className="text-brand-text2">Carregando seus protocolos...</p>
          </div>
        )}

        {/* Lista de Protocolos Salvos */}
        {!loading && (
          <div className="space-y-4">
            {filteredProtocolos.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-lg font-semibold text-brand-text mb-2">
                  {searchTerm ? 'Nenhum protocolo encontrado' : 'Nenhum protocolo salvo ainda'}
                </h3>
                <p className="text-brand-text2 mb-6">
                  {searchTerm 
                    ? 'Tente buscar com outros termos'
                    : 'Salve protocolos que você gostar para acessá-los facilmente aqui'
                  }
                </p>
                {!searchTerm && (
                  <Link href="/protocolos">
                    <button className="bg-brand-green text-white px-6 py-3 rounded-lg font-medium hover:bg-brand-greenDark transition-colors">
                      Explorar Protocolos
                    </button>
                  </Link>
                )}
              </div>
            ) : (
              filteredProtocolos.map((protocolo) => (
                <div
                  key={protocolo.id}
                  className="bg-white rounded-xl p-4 shadow-soft border border-brand-border"
                >
                  <div className="flex items-start space-x-4">
                    {/* Emoji do Protocolo */}
                    <div className="text-3xl flex-shrink-0">
                      {getProtocoloEmoji(protocolo.nome, protocolo.categoria)}
                    </div>

                    {/* Conteúdo do Protocolo */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-brand-text text-lg">
                          {protocolo.nome}
                        </h3>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-brand-purple text-white">
                          {protocolo.categoria}
                        </span>
                      </div>

                      <p className="text-brand-text2 text-sm mb-3 line-clamp-2">
                        {protocolo.descricao}
                      </p>

                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs text-brand-text2">
                          Salvo em: {protocolo.data_salvamento}
                        </span>
                      </div>

                      {/* Botões de Ação */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAcessarProtocolo(protocolo)}
                          className="flex-1 bg-brand-purple text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-brand-purpleDark transition-colors"
                        >
                          📖 Ver Protocolo
                        </button>
                        <button
                          onClick={() => handleCompartilharWhatsApp(protocolo)}
                          className="flex-1 bg-green-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
                        >
                          📱 WhatsApp
                        </button>
                        <button
                          onClick={() => handleRemoverProtocolo(protocolo.id)}
                          className="bg-red-100 text-red-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Estatísticas */}
        {!loading && protocolosSalvos.length > 0 && (
          <div className="mt-8 p-4 bg-white rounded-xl shadow-soft border border-brand-border">
            <h3 className="font-semibold text-brand-text mb-2">📊 Suas Estatísticas</h3>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-brand-purple">{protocolosSalvos.length}</div>
                <div className="text-sm text-brand-text2">Protocolos Salvos</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-brand-green">
                  {new Set(protocolosSalvos.map(p => p.categoria)).size}
                </div>
                <div className="text-sm text-brand-text2">Categorias</div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
