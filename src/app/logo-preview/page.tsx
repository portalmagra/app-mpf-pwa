'use client'

export default function LogoPreviewPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-green to-brand-greenDark p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl p-8">
        <h1 className="text-4xl font-bold text-center text-brand-text mb-12">
          🏋️ PORTAL FIT - Opções de Logotipo
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Logo 1 */}
          <div className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-48 h-48 mx-auto mb-4 bg-white rounded-2xl shadow-lg flex items-center justify-center">
              <img src="/icons/portal-fit-logo-1.svg" alt="Logo 1" className="w-40 h-40" />
            </div>
            <h3 className="text-xl font-bold text-brand-text mb-2">Opção 1: Clássico Circular</h3>
            <p className="text-gray-600 text-sm mb-4">
              Design circular com elementos da bandeira brasileira integrados. 
              Simples, reconhecível e profissional.
            </p>
            <div className="flex justify-center gap-2">
              <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                <img src="/icons/portal-fit-logo-1.svg" alt="App Icon 1" className="w-8 h-8" />
              </div>
            </div>
          </div>

          {/* Logo 2 */}
          <div className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-48 h-48 mx-auto mb-4 bg-white rounded-2xl shadow-lg flex items-center justify-center">
              <img src="/icons/portal-fit-logo-2.svg" alt="Logo 2" className="w-40 h-40" />
            </div>
            <h3 className="text-xl font-bold text-brand-text mb-2">Opção 2: Moderno Retangular</h3>
            <p className="text-gray-600 text-sm mb-4">
              Layout retangular com gradiente verde. Bandeira brasileira centralizada 
              com elementos de fitness nos cantos.
            </p>
            <div className="flex justify-center gap-2">
              <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                <img src="/icons/portal-fit-logo-2.svg" alt="App Icon 2" className="w-8 h-8" />
              </div>
            </div>
          </div>

          {/* Logo 3 */}
          <div className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-48 h-48 mx-auto mb-4 bg-white rounded-2xl shadow-lg flex items-center justify-center">
              <img src="/icons/portal-fit-logo-3.svg" alt="Logo 3" className="w-40 h-40" />
            </div>
            <h3 className="text-xl font-bold text-brand-text mb-2">Opção 3: Portal com Conexão</h3>
            <p className="text-gray-600 text-sm mb-4">
              Conceito de "portal" com círculos concêntricos. Inclui "BR • US" 
              sutilmente para conectar brasileiros nos EUA.
            </p>
            <div className="flex justify-center gap-2">
              <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                <img src="/icons/portal-fit-logo-3.svg" alt="App Icon 3" className="w-8 h-8" />
              </div>
            </div>
          </div>

          {/* Logo 4 */}
          <div className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-48 h-48 mx-auto mb-4 bg-white rounded-2xl shadow-lg flex items-center justify-center">
              <img src="/icons/portal-fit-logo-4.svg" alt="Logo 4" className="w-40 h-40" />
            </div>
            <h3 className="text-xl font-bold text-brand-text mb-2">Opção 4: Anéis de Portal</h3>
            <p className="text-gray-600 text-sm mb-4">
              Múltiplos anéis criando efeito de portal dimensional. Bandeira brasileira 
              centralizada com elementos de fitness nos cantos.
            </p>
            <div className="flex justify-center gap-2">
              <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                <img src="/icons/portal-fit-logo-4.svg" alt="App Icon 4" className="w-8 h-8" />
              </div>
            </div>
          </div>

          {/* Logo 5 */}
          <div className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-48 h-48 mx-auto mb-4 bg-white rounded-2xl shadow-lg flex items-center justify-center">
              <img src="/icons/portal-fit-logo-5.svg" alt="Logo 5" className="w-40 h-40" />
            </div>
            <h3 className="text-xl font-bold text-brand-text mb-2">Opção 5: Conexão Global</h3>
            <p className="text-gray-600 text-sm mb-4">
              Design com elementos conectados por linhas sutis. Representa a conexão 
              entre Brasil e EUA com elementos de rede.
            </p>
            <div className="flex justify-center gap-2">
              <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                <img src="/icons/portal-fit-logo-5.svg" alt="App Icon 5" className="w-8 h-8" />
              </div>
            </div>
          </div>
        </div>

        {/* Estratégia */}
        <div className="bg-gray-50 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-brand-text mb-6 text-center">🎯 Estratégia de Marca</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-brand-text mb-3">Elementos Visuais:</h3>
              <ul className="space-y-2 text-gray-700">
                <li>✅ <strong>Cores:</strong> Verde (#10B981) como cor principal</li>
                <li>✅ <strong>Brasil:</strong> Elementos da bandeira para conectar</li>
                <li>✅ <strong>Portal:</strong> Conceito de conexão entre países</li>
                <li>✅ <strong>Fitness:</strong> Elementos sutis de wellness</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-brand-text mb-3">Aplicações:</h3>
              <ul className="space-y-2 text-gray-700">
                <li>✅ <strong>Apps:</strong> Ícones de instalação</li>
                <li>✅ <strong>WhatsApp:</strong> Preview de links</li>
                <li>✅ <strong>Materiais:</strong> Cartões, banners</li>
                <li>✅ <strong>Profissional:</strong> Uso empresarial</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Recomendação */}
        <div className="mt-8 bg-brand-green text-white rounded-xl p-6 text-center">
          <h3 className="text-xl font-bold mb-2">💡 Recomendação</h3>
          <p className="text-lg">
            <strong>Opção 3</strong> é a mais estratégica: conecta explicitamente Brasil e EUA, 
            conceito de "portal" bem representado, elegante e profissional.
          </p>
        </div>
      </div>
    </div>
  )
}
