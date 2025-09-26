import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Teste Meta Tags WhatsApp - MeuPortalFit',
  description: 'Página para testar as meta tags do WhatsApp',
  openGraph: {
    title: 'MeuPortalFit - Wellness para Brasileiros nos EUA',
    description: '🇧🇷 App brasileiro para sua saúde e bem-estar nos Estados Unidos! ✨ Avaliação gratuita por IA • 📚 eBooks exclusivos • 🍽️ Receitas brasileiras • 👩‍⚕️ Coach especializada • 💬 WhatsApp: (786) 253-5032',
    type: 'website',
    locale: 'pt_BR',
    url: 'https://app.meuportalfit.com',
    siteName: 'MeuPortalFit',
    images: [
      {
        url: 'https://app.meuportalfit.com/whatsapp-preview.svg',
        width: 400,
        height: 300,
        alt: 'MeuPortalFit - Brasileiros nos EUA',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MeuPortalFit - Wellness para Brasileiros nos EUA',
    description: '🇧🇷 App brasileiro para sua saúde e bem-estar nos Estados Unidos! ✨ Avaliação gratuita por IA • 📚 eBooks exclusivos • 🍽️ Receitas brasileiras • 👩‍⚕️ Coach especializada • 💬 WhatsApp: (786) 253-5032',
    images: ['https://app.meuportalfit.com/whatsapp-preview.svg'],
  },
}

export default function TesteMetaTags() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            🧪 Teste de Meta Tags para WhatsApp
          </h1>
          
          <div className="space-y-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 text-blue-800">
                📱 Como Testar no WhatsApp
              </h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>Copie esta URL: <code className="bg-gray-200 px-2 py-1 rounded">https://app.meuportalfit.com/teste-meta-tags</code></li>
                <li>Abra o WhatsApp no seu celular</li>
                <li>Cole a URL em qualquer conversa</li>
                <li>Verifique se aparece a prévia com:</li>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>✅ Título: "MeuPortalFit - Wellness para Brasileiros nos EUA"</li>
                  <li>✅ Descrição com emojis e informações</li>
                  <li>✅ Imagem personalizada</li>
                  <li>✅ Número do WhatsApp: (786) 253-5032</li>
                </ul>
              </ol>
            </div>

            <div className="bg-green-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 text-green-800">
                ✅ Meta Tags Configuradas
              </h2>
              <div className="space-y-3 text-sm">
                <div>
                  <strong>og:title:</strong> MeuPortalFit - Wellness para Brasileiros nos EUA
                </div>
                <div>
                  <strong>og:description:</strong> 🇧🇷 App brasileiro para sua saúde e bem-estar nos Estados Unidos! ✨ Avaliação gratuita por IA • 📚 eBooks exclusivos • 🍽️ Receitas brasileiras • 👩‍⚕️ Coach especializada • 💬 WhatsApp: (786) 253-5032
                </div>
                <div>
                  <strong>og:image:</strong> https://app.meuportalfit.com/whatsapp-preview.svg
                </div>
                <div>
                  <strong>og:url:</strong> https://app.meuportalfit.com
                </div>
                <div>
                  <strong>og:type:</strong> website
                </div>
                <div>
                  <strong>og:site_name:</strong> MeuPortalFit
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 text-yellow-800">
                ⚠️ Importante
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>O WhatsApp pode demorar algumas horas para atualizar o cache</li>
                <li>Teste em diferentes dispositivos (iOS e Android)</li>
                <li>Verifique se a imagem está acessível publicamente</li>
                <li>Use o <a href="https://developers.facebook.com/tools/debug/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Facebook Debugger</a> para forçar atualização</li>
              </ul>
            </div>

            <div className="bg-purple-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 text-purple-800">
                🔗 Links para Testar
              </h2>
              <div className="space-y-2">
                <div>
                  <strong>Página Principal:</strong> 
                  <a href="https://app.meuportalfit.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-2">
                    https://app.meuportalfit.com
                  </a>
                </div>
                <div>
                  <strong>Esta Página:</strong> 
                  <a href="https://app.meuportalfit.com/teste-meta-tags" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-2">
                    https://app.meuportalfit.com/teste-meta-tags
                  </a>
                </div>
                <div>
                  <strong>Imagem:</strong> 
                  <a href="https://app.meuportalfit.com/whatsapp-preview.svg" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-2">
                    https://app.meuportalfit.com/whatsapp-preview.svg
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-red-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 text-red-800">
                🚨 Se Não Funcionar
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Verifique se a URL está correta</li>
                <li>Confirme se a imagem está acessível</li>
                <li>Aguarde algumas horas para o cache atualizar</li>
                <li>Teste com o Facebook Debugger</li>
                <li>Verifique se não há caracteres especiais na URL</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
