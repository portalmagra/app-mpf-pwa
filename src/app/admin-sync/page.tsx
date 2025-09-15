'use client'

import { useState, useEffect } from 'react'
import Logo from '@/components/Logo'

export default function AdminSyncPage() {
  const [syncStatus, setSyncStatus] = useState<{
    hasDataFiles: boolean
    dataStats: {
      products: number
      categories: number
      mercadoProducts: number
    } | null
    message: string
  } | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    checkSyncStatus()
  }, [])

  const checkSyncStatus = async () => {
    try {
      const response = await fetch('/api/sync-meuportalfit')
      const data = await response.json()
      setSyncStatus(data)
    } catch (error) {
      console.error('Erro ao verificar status:', error)
      setMessage('Erro ao verificar status da sincronização')
    }
  }

  const handleSync = async () => {
    try {
      setLoading(true)
      setMessage('')
      
      const response = await fetch('/api/sync-meuportalfit', {
        method: 'POST'
      })
      
      const data = await response.json()
      
      if (data.success) {
        setMessage(`✅ Sincronização concluída! ${data.stats.products.synced} produtos e ${data.stats.categories.synced} categorias sincronizados.`)
        await checkSyncStatus() // Atualizar status
      } else {
        setMessage(`❌ Erro: ${data.error}`)
      }
    } catch (error) {
      console.error('Erro na sincronização:', error)
      setMessage('❌ Erro durante a sincronização')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-brand-greenSoft shadow-soft sticky top-0 z-50 border-b border-brand-border">
        <div className="max-w-sm mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <Logo variant="horizontal" size="md" />
            <a href="/admin" className="text-sm text-gray-600 hover:text-brand-green transition-colors">
              ← Voltar ao Admin
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">🔄 Sincronização com MeuPortalFit</h1>
          
          {/* Status atual */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">📊 Status Atual</h2>
            
            {syncStatus ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${syncStatus.hasDataFiles ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  <span className="text-sm text-gray-600">
                    {syncStatus.hasDataFiles ? 'Arquivos de dados encontrados' : 'Arquivos de dados não encontrados'}
                  </span>
                </div>
                
                {syncStatus.dataStats && (
                  <div className="ml-5 space-y-1 text-sm text-gray-600">
                    <div>• Produtos: {syncStatus.dataStats.products}</div>
                    <div>• Categorias: {syncStatus.dataStats.categories}</div>
                    <div>• Produtos no mercado: {syncStatus.dataStats.mercadoProducts}</div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-sm text-gray-500">Carregando status...</div>
            )}
          </div>

          {/* Instruções */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h2 className="text-lg font-semibold text-blue-800 mb-3">📋 Como sincronizar</h2>
            <div className="text-sm text-blue-700 space-y-2">
              <p><strong>1.</strong> Execute o script de sincronização:</p>
              <code className="block bg-blue-100 p-2 rounded text-xs">
                node sync-meuportalfit.js
              </code>
              <p><strong>2.</strong> Clique no botão &quot;Sincronizar Agora&quot; abaixo</p>
              <p><strong>3.</strong> Verifique os produtos na área administrativa</p>
            </div>
          </div>

          {/* Botão de sincronização */}
          <div className="mb-6">
            <button
              onClick={handleSync}
              disabled={loading || !syncStatus?.hasDataFiles}
              className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                loading || !syncStatus?.hasDataFiles
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-brand-green text-white hover:bg-brand-greenDark'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Sincronizando...
                </span>
              ) : (
                '🔄 Sincronizar Agora'
              )}
            </button>
          </div>

          {/* Mensagem de resultado */}
          {message && (
            <div className={`p-4 rounded-lg ${
              message.includes('✅') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}>
              {message}
            </div>
          )}

          {/* Informações adicionais */}
          <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
            <h3 className="text-sm font-semibold text-yellow-800 mb-2">⚠️ Importante</h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• A sincronização irá criar/atualizar produtos e categorias no Supabase</li>
              <li>• Produtos marcados como "mercado" (is_mentoria: true) aparecerão na página /mercado</li>
              <li>• Use a área administrativa para gerenciar quais produtos ficam no mercado</li>
              <li>• A sincronização é incremental - não duplica dados existentes</li>
            </ul>
          </div>

          {/* Links úteis */}
          <div className="mt-6 flex gap-4">
            <a
              href="/admin-produtos"
              className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-center hover:bg-gray-200 transition-colors"
            >
              📦 Gerenciar Produtos
            </a>
            <a
              href="/admin-categorias"
              className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-center hover:bg-gray-200 transition-colors"
            >
              🏷️ Gerenciar Categorias
            </a>
            <a
              href="/mercado"
              className="flex-1 bg-orange-100 text-orange-700 py-2 px-4 rounded-lg text-center hover:bg-orange-200 transition-colors"
            >
              🛒 Ver Mercado
            </a>
          </div>
        </div>
      </main>
    </div>
  )
}
