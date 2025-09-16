'use client'

export default function LogoPreviewPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-green to-brand-greenDark p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-2xl p-8">
        <h1 className="text-4xl font-bold text-center text-brand-text mb-12">
          🏋️ PORTAL FIT - Variações de Cores
        </h1>
        
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-center text-brand-text mb-4">🎨 Opção 2: Portal com Círculos</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Logo 2A */}
            <div className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-48 h-48 mx-auto mb-4 bg-white rounded-2xl shadow-lg flex items-center justify-center">
                <img src="/icons/portal-fit-logo-2a.svg" alt="Logo 2A" className="w-40 h-40" />
              </div>
              <h3 className="text-xl font-bold text-brand-text mb-2">2A: Verde Escuro + Amarelo Clássico</h3>
              <p className="text-gray-600 text-sm mb-4">
                Fundo verde escuro (#059669) com círculos em amarelo clássico (#FFDF00). 
                Contraste forte e identidade brasileira marcante.
              </p>
              <div className="flex justify-center gap-2">
                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                  <img src="/icons/portal-fit-logo-2a.svg" alt="App Icon 2A" className="w-8 h-8" />
                </div>
              </div>
            </div>

            {/* Logo 2B */}
            <div className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-48 h-48 mx-auto mb-4 bg-white rounded-2xl shadow-lg flex items-center justify-center">
                <img src="/icons/portal-fit-logo-2b.svg" alt="Logo 2B" className="w-40 h-40" />
              </div>
              <h3 className="text-xl font-bold text-brand-text mb-2">2B: Verde Médio + Amarelo Dourado</h3>
              <p className="text-gray-600 text-sm mb-4">
                Fundo verde médio (#10B981) com círculos em amarelo dourado (#FFC107). 
                Mais suave e elegante, mantendo a identidade brasileira.
              </p>
              <div className="flex justify-center gap-2">
                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                  <img src="/icons/portal-fit-logo-2b.svg" alt="App Icon 2B" className="w-8 h-8" />
                </div>
              </div>
            </div>

            {/* Logo 2C */}
            <div className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-48 h-48 mx-auto mb-4 bg-white rounded-2xl shadow-lg flex items-center justify-center">
                <img src="/icons/portal-fit-logo-2c.svg" alt="Logo 2C" className="w-40 h-40" />
              </div>
              <h3 className="text-xl font-bold text-brand-text mb-2">2C: Verde Escuro + Amarelo Suave</h3>
              <p className="text-gray-600 text-sm mb-4">
                Fundo verde escuro (#059669) com círculos em amarelo suave (#F59E0B). 
                Profissional e sofisticado, ideal para uso corporativo.
              </p>
              <div className="flex justify-center gap-2">
                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                  <img src="/icons/portal-fit-logo-2c.svg" alt="App Icon 2C" className="w-8 h-8" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-center text-brand-text mb-4">🇧🇷 Opção 3: Portal com Elementos Brasileiros</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Logo 3A */}
            <div className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-48 h-48 mx-auto mb-4 bg-white rounded-2xl shadow-lg flex items-center justify-center">
                <img src="/icons/portal-fit-logo-3a.svg" alt="Logo 3A" className="w-40 h-40" />
              </div>
              <h3 className="text-xl font-bold text-brand-text mb-2">3A: Verde Escuro + Amarelo Clássico</h3>
              <p className="text-gray-600 text-sm mb-4">
                Fundo verde escuro (#059669) com elementos da bandeira em amarelo clássico (#FFDF00). 
                Identidade brasileira forte e reconhecível.
              </p>
              <div className="flex justify-center gap-2">
                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                  <img src="/icons/portal-fit-logo-3a.svg" alt="App Icon 3A" className="w-8 h-8" />
                </div>
              </div>
            </div>

            {/* Logo 3B */}
            <div className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-48 h-48 mx-auto mb-4 bg-white rounded-2xl shadow-lg flex items-center justify-center">
                <img src="/icons/portal-fit-logo-3b.svg" alt="Logo 3B" className="w-40 h-40" />
              </div>
              <h3 className="text-xl font-bold text-brand-text mb-2">3B: Verde Médio + Amarelo Dourado</h3>
              <p className="text-gray-600 text-sm mb-4">
                Fundo verde médio (#10B981) com elementos da bandeira em amarelo dourado (#FFC107). 
                Mais suave e elegante, mantendo a conexão Brasil-EUA.
              </p>
              <div className="flex justify-center gap-2">
                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                  <img src="/icons/portal-fit-logo-3b.svg" alt="App Icon 3B" className="w-8 h-8" />
                </div>
              </div>
            </div>

            {/* Logo 3C */}
            <div className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-48 h-48 mx-auto mb-4 bg-white rounded-2xl shadow-lg flex items-center justify-center">
                <img src="/icons/portal-fit-logo-3c.svg" alt="Logo 3C" className="w-40 h-40" />
              </div>
              <h3 className="text-xl font-bold text-brand-text mb-2">3C: Verde Escuro + Amarelo Suave</h3>
              <p className="text-gray-600 text-sm mb-4">
                Fundo verde escuro (#059669) com elementos da bandeira em amarelo suave (#F59E0B). 
                Profissional e sofisticado, ideal para uso empresarial.
              </p>
              <div className="flex justify-center gap-2">
                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                  <img src="/icons/portal-fit-logo-3c.svg" alt="App Icon 3C" className="w-8 h-8" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Estratégia de Cores */}
        <div className="bg-gray-50 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-brand-text mb-6 text-center">🎨 Estratégia de Cores</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-brand-text mb-3">Verde Escuro (#059669):</h3>
              <ul className="space-y-2 text-gray-700">
                <li>✅ <strong>Profissional:</strong> Mais sério e corporativo</li>
                <li>✅ <strong>Contraste:</strong> Melhor legibilidade</li>
                <li>✅ <strong>Identidade:</strong> Cor principal do app</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-brand-text mb-3">Verde Médio (#10B981):</h3>
              <ul className="space-y-2 text-gray-700">
                <li>✅ <strong>Moderno:</strong> Mais jovem e dinâmico</li>
                <li>✅ <strong>Suave:</strong> Menos agressivo visualmente</li>
                <li>✅ <strong>Versátil:</strong> Funciona bem em diferentes contextos</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-brand-text mb-3">Amarelos:</h3>
              <ul className="space-y-2 text-gray-700">
                <li>✅ <strong>Clássico (#FFDF00):</strong> Identidade brasileira forte</li>
                <li>✅ <strong>Dourado (#FFC107):</strong> Mais elegante e sofisticado</li>
                <li>✅ <strong>Suave (#F59E0B):</strong> Profissional e discreto</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Recomendação */}
        <div className="mt-8 bg-brand-green text-white rounded-xl p-6 text-center">
          <h3 className="text-xl font-bold mb-2">💡 Recomendação</h3>
          <p className="text-lg">
            <strong>Opção 3A</strong> é a mais estratégica: identidade brasileira forte, 
            cores contrastantes para boa visibilidade, e conceito de "portal" bem representado.
          </p>
        </div>
      </div>
    </div>
  )
}
