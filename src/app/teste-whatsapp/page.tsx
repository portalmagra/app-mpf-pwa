import WhatsAppTest from '@/components/WhatsAppTest'

export default function TesteWhatsApp() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🧪 Teste do WhatsApp
          </h1>
          <p className="text-gray-600">
            Página para testar e debugar a integração com WhatsApp
          </p>
        </div>
        
        <WhatsAppTest />
        
        <div className="max-w-md mx-auto mt-8 p-4 bg-white rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-3">🔍 Informações de Debug</h3>
          
          <div className="space-y-2 text-sm">
            <div>
              <strong>Número:</strong> +1 (786) 253-5032
            </div>
            <div>
              <strong>URL Principal:</strong> https://wa.me/17862535032
            </div>
            <div>
              <strong>WhatsApp Web:</strong> https://web.whatsapp.com/send?phone=17862535032
            </div>
            <div>
              <strong>Protocolo:</strong> whatsapp://send?phone=17862535032
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
            <h4 className="font-semibold text-sm mb-2">⚠️ Problemas Comuns:</h4>
            <ul className="text-xs space-y-1 text-gray-700">
              <li>• WhatsApp não instalado no dispositivo</li>
              <li>• Bloqueio de pop-ups no navegador</li>
              <li>• PWA não configurado corretamente</li>
              <li>• Número de telefone incorreto</li>
              <li>• Formato da URL incorreto</li>
            </ul>
          </div>
          
          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <h4 className="font-semibold text-sm mb-2">✅ Soluções:</h4>
            <ul className="text-xs space-y-1 text-gray-700">
              <li>• Usar window.location.href em vez de window.open</li>
              <li>• Verificar se o número está correto</li>
              <li>• Testar em diferentes navegadores</li>
              <li>• Adicionar fallback para WhatsApp Web</li>
              <li>• Verificar logs no console</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
