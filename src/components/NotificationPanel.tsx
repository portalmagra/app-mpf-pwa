'use client'

import { useState } from 'react'
import { useNotifications } from '@/hooks/useNotifications'
import { NOTIFICATION_MESSAGES, WHATSAPP_MESSAGES, openWhatsAppWithMessage } from '@/lib/messages'

interface NotificationPanelProps {
  onClose: () => void
}

export default function NotificationPanel({ onClose }: NotificationPanelProps) {
  const { isSupported, permission, requestPermission, isSubscribed, unsubscribeFromPush } = useNotifications()
  const [message, setMessage] = useState('')
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSendNotification = async () => {
    if (!title || !message) {
      alert('Preencha título e mensagem')
      return
    }

    setLoading(true)
    try {
      // Simular envio de notificação
      // TODO: Implementar envio real via OneSignal
      console.log('Enviando notificação:', { title, message })
      
      // Simular delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      alert('Notificação enviada com sucesso!')
      setTitle('')
      setMessage('')
    } catch (error) {
      console.error('Erro ao enviar notificação:', error)
      alert('Erro ao enviar notificação')
    } finally {
      setLoading(false)
    }
  }

  const handlePermissionRequest = async () => {
    const success = await requestPermission()
    if (success) {
      alert('✅ Notificações ativadas com sucesso!')
    } else {
      alert('❌ Falha ao ativar notificações')
    }
  }

  const handleUnsubscribe = async () => {
    const success = await unsubscribeFromPush()
    if (success) {
      alert('✅ Notificações desativadas')
    } else {
      alert('❌ Falha ao desativar notificações')
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">🔔 Notificações Push</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Status das notificações */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-2">Status Atual</h3>
            
            {!isSupported ? (
              <p className="text-red-600 text-sm">❌ Navegador não suporta notificações</p>
            ) : permission === 'granted' && isSubscribed ? (
              <p className="text-green-600 text-sm">✅ Notificações ativadas e funcionando</p>
            ) : permission === 'granted' ? (
              <p className="text-yellow-600 text-sm">⚠️ Permissão concedida, mas não inscrito</p>
            ) : permission === 'denied' ? (
              <p className="text-red-600 text-sm">❌ Notificações bloqueadas</p>
            ) : (
              <p className="text-yellow-600 text-sm">⚠️ Permissão não solicitada</p>
            )}
          </div>

          {/* Controles de permissão */}
          {isSupported && (
            <div className="space-y-3 mb-6">
              {permission !== 'granted' ? (
                <button
                  onClick={handlePermissionRequest}
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  🔔 Solicitar Permissão
                </button>
              ) : !isSubscribed ? (
                <button
                  onClick={handlePermissionRequest}
                  className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
                >
                  📱 Inscrever-se para Notificações
                </button>
              ) : (
                <button
                  onClick={handleUnsubscribe}
                  className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
                >
                  🔕 Desativar Notificações
                </button>
              )}
            </div>
          )}

          {/* Mensagens pré-definidas */}
          {permission === 'granted' && (
            <div className="space-y-4 mb-6">
              <h3 className="font-semibold text-gray-800">📝 Mensagens Pré-definidas</h3>
              
              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={() => {
                    setTitle(NOTIFICATION_MESSAGES.welcome.title)
                    setMessage(NOTIFICATION_MESSAGES.welcome.body)
                  }}
                  className="text-left p-3 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <div className="font-medium text-green-800">🎉 Boas-vindas</div>
                  <div className="text-sm text-green-600">Bem-vindo ao MeuPortalFit!</div>
                </button>
                
                <button
                  onClick={() => {
                    setTitle(NOTIFICATION_MESSAGES.newEbook('Novo eBook de Receitas').title)
                    setMessage(NOTIFICATION_MESSAGES.newEbook('Novo eBook de Receitas').body)
                  }}
                  className="text-left p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <div className="font-medium text-blue-800">📚 Novo eBook</div>
                  <div className="text-sm text-blue-600">Anunciar novo eBook disponível</div>
                </button>
                
                <button
                  onClick={() => {
                    setTitle(NOTIFICATION_MESSAGES.promotion(20).title)
                    setMessage(NOTIFICATION_MESSAGES.promotion(20).body)
                  }}
                  className="text-left p-3 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors"
                >
                  <div className="font-medium text-orange-800">🔥 Promoção</div>
                  <div className="text-sm text-orange-600">Desconto especial em eBooks</div>
                </button>
                
                <button
                  onClick={() => {
                    setTitle(NOTIFICATION_MESSAGES.newProducts.title)
                    setMessage(NOTIFICATION_MESSAGES.newProducts.body)
                  }}
                  className="text-left p-3 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  <div className="font-medium text-purple-800">🛒 Novos Produtos</div>
                  <div className="text-sm text-purple-600">Produtos curados na Amazon</div>
                </button>
              </div>
            </div>
          )}

          {/* Formulário de envio */}
          {permission === 'granted' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800">Enviar Notificação</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Novo eBook disponível!"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mensagem
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Ex: Confira nosso novo eBook de receitas low carb por apenas $9.99!"
                />
              </div>

              <button
                onClick={handleSendNotification}
                disabled={loading || !title || !message}
                className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {loading ? 'Enviando...' : '📤 Enviar Notificação'}
              </button>
            </div>
          )}

          {/* Informações sobre OneSignal */}
          <div className="mt-6 bg-blue-50 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">ℹ️ Sobre OneSignal</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Gratuito até 30k usuários</li>
              <li>• 30k notificações por mês</li>
              <li>• Dashboard para envio em massa</li>
              <li>• Segmentação por comportamento</li>
              <li>• Analytics de engajamento</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
