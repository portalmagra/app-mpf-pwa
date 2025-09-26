'use client'

import { useState } from 'react'
import { openWhatsApp, openWhatsAppSimple, openWhatsAppIOS, openWhatsAppRobust } from '@/utils/whatsapp'

export default function WhatsAppTest() {
  const [testResults, setTestResults] = useState<string[]>([])
  const [isTesting, setIsTesting] = useState(false)

  const addResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`])
  }

  const runTests = async () => {
    setIsTesting(true)
    setTestResults([])
    
    const phoneNumber = '17862535032'
    const message = 'Teste do MeuPortalFit - WhatsApp funcionando!'
    
    addResult('🧪 Iniciando testes do WhatsApp...')
    
    // Teste 1: Função principal
    try {
      addResult('📱 Teste 1: openWhatsApp')
      openWhatsApp(phoneNumber, message)
      addResult('✅ openWhatsApp executada')
    } catch (error) {
      addResult(`❌ Erro em openWhatsApp: ${error}`)
    }
    
    // Aguardar um pouco
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Teste 2: Função simples
    try {
      addResult('📱 Teste 2: openWhatsAppSimple')
      openWhatsAppSimple(phoneNumber, message)
      addResult('✅ openWhatsAppSimple executada')
    } catch (error) {
      addResult(`❌ Erro em openWhatsAppSimple: ${error}`)
    }
    
    // Aguardar um pouco
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Teste 3: Função iOS
    try {
      addResult('📱 Teste 3: openWhatsAppIOS')
      openWhatsAppIOS(phoneNumber, message)
      addResult('✅ openWhatsAppIOS executada')
    } catch (error) {
      addResult(`❌ Erro em openWhatsAppIOS: ${error}`)
    }
    
    // Aguardar um pouco
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Teste 4: Função robusta
    try {
      addResult('📱 Teste 4: openWhatsAppRobust')
      openWhatsAppRobust(phoneNumber, message)
      addResult('✅ openWhatsAppRobust executada')
    } catch (error) {
      addResult(`❌ Erro em openWhatsAppRobust: ${error}`)
    }
    
    addResult('🎉 Testes concluídos! Verifique o console do navegador para logs detalhados.')
    setIsTesting(false)
  }

  const clearResults = () => {
    setTestResults([])
  }

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-center">🧪 Teste do WhatsApp</h2>
      
      <div className="space-y-3 mb-4">
        <button
          onClick={runTests}
          disabled={isTesting}
          className="w-full bg-green-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isTesting ? '🔄 Testando...' : '🚀 Executar Testes'}
        </button>
        
        <button
          onClick={clearResults}
          className="w-full bg-gray-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-gray-600"
        >
          🗑️ Limpar Resultados
        </button>
      </div>
      
      <div className="bg-gray-100 p-3 rounded-lg max-h-64 overflow-y-auto">
        <h3 className="font-semibold mb-2">📋 Resultados:</h3>
        {testResults.length === 0 ? (
          <p className="text-gray-500 text-sm">Nenhum teste executado ainda.</p>
        ) : (
          <div className="space-y-1">
            {testResults.map((result, index) => (
              <div key={index} className="text-xs font-mono bg-white p-2 rounded border">
                {result}
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-sm mb-2">💡 Instruções:</h4>
        <ul className="text-xs space-y-1 text-gray-700">
          <li>• Clique em "Executar Testes"</li>
          <li>• Verifique se o WhatsApp abre</li>
          <li>• Abra o console do navegador (F12)</li>
          <li>• Veja os logs detalhados</li>
          <li>• Teste em diferentes dispositivos</li>
        </ul>
      </div>
    </div>
  )
}
