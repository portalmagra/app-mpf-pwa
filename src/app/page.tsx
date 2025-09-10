export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 pb-20">
      {/* Header Compacto */}
      <header className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-green-500 to-blue-600 bg-clip-text text-transparent">
                MeuPortalFit
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-lg">🔔</span>
              </div>
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-lg">👤</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Compacto */}
      <section className="px-4 py-6">
        <div className="max-w-md mx-auto text-center">
          <div className="inline-flex items-center bg-white/95 backdrop-blur-sm border border-white/30 rounded-full px-3 py-1 mb-4 shadow-sm">
            <span className="text-xs font-semibold text-gray-700">🛡️ +2.847 brasileiros confiam</span>
            <span className="ml-1">⭐⭐⭐⭐⭐</span>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Sua Coach Brasileira nos
            <span className="bg-gradient-to-r from-green-500 to-blue-600 bg-clip-text text-transparent block">
              Estados Unidos
            </span>
          </h2>
          
          <p className="text-sm text-gray-600 mb-6">
            Análise IA + Produtos Amazon + Coach WhatsApp
          </p>
        </div>
      </section>

      {/* Dica do Dia / Promoção */}
      <section className="px-4 mb-6">
        <div className="max-w-md mx-auto">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-4 text-white">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">💡</span>
              <h3 className="font-bold text-sm">Dica do Dia</h3>
            </div>
            <p className="text-xs text-yellow-100">
              Beba água com limão em jejum para acelerar o metabolismo e desintoxicar o corpo!
            </p>
          </div>
        </div>
      </section>

      {/* 3 Cards Principais - Compactos */}
      <section className="px-4 mb-6">
        <div className="max-w-md mx-auto">
          <div className="grid grid-cols-1 gap-4">
            {/* 1. Análise IA */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-4 text-white shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🧠</span>
                  <div>
                    <h3 className="font-bold text-lg">Análise Inteligente</h3>
                    <p className="text-green-100 text-xs">Quiz personalizado com IA</p>
                  </div>
                </div>
                <span className="text-2xl">→</span>
              </div>
              <button className="w-full bg-white/20 backdrop-blur-sm rounded-xl py-2 font-bold text-sm">
                🚀 COMEÇAR AGORA
              </button>
            </div>

            {/* 2. Produtos */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-4 text-white shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🛍️</span>
                  <div>
                    <h3 className="font-bold text-lg">Produtos Amazon</h3>
                    <p className="text-blue-100 text-xs">Selecionados para você</p>
                  </div>
                </div>
                <span className="text-2xl">→</span>
              </div>
              <button className="w-full bg-white/20 backdrop-blur-sm rounded-xl py-2 font-bold text-sm">
                🔍 VER PRODUTOS
              </button>
            </div>

            {/* 3. Coach WhatsApp */}
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-4 text-white shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">💬</span>
                  <div>
                    <h3 className="font-bold text-lg">Coach WhatsApp</h3>
                    <p className="text-purple-100 text-xs">Avaliação personalizada</p>
                  </div>
                </div>
                <span className="text-2xl">→</span>
              </div>
              <button className="w-full bg-white/20 backdrop-blur-sm rounded-xl py-2 font-bold text-sm">
                📞 FALAR COM COACH
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Funcionalidades Rápidas */}
      <section className="px-4 mb-6">
        <div className="max-w-md mx-auto">
          <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">Funcionalidades</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-xl p-4 shadow-sm text-center">
              <div className="text-2xl mb-2">🍽️</div>
              <h4 className="font-semibold text-sm text-gray-900">Receitas</h4>
              <p className="text-xs text-gray-600">Brasileiras adaptadas</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm text-center">
              <div className="text-2xl mb-2">🛒</div>
              <h4 className="font-semibold text-sm text-gray-900">Lista Supermercado</h4>
              <p className="text-xs text-gray-600">Básica + VIP</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm text-center">
              <div className="text-2xl mb-2">🎯</div>
              <h4 className="font-semibold text-sm text-gray-900">Metas</h4>
              <p className="text-xs text-gray-600">Acompanhe progresso</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm text-center">
              <div className="text-2xl mb-2">🏆</div>
              <h4 className="font-semibold text-sm text-gray-900">Gamificação</h4>
              <p className="text-xs text-gray-600">Conquistas e badges</p>
            </div>
          </div>
        </div>
      </section>

      {/* Perfil Rápido */}
      <section className="px-4 mb-6">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">👤</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Seu Perfil</h3>
                <p className="text-xs text-gray-600">Personalize sua experiência</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button className="bg-gray-100 rounded-lg py-2 text-xs font-semibold text-gray-700">
                📊 Ver Progresso
              </button>
              <button className="bg-green-100 rounded-lg py-2 text-xs font-semibold text-green-700">
                💬 WhatsApp Coach
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Principal Compacto */}
      <section className="px-4 mb-6">
        <div className="max-w-md mx-auto">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-4 text-center">
            <h3 className="font-bold text-white mb-2 text-sm">
              🎯 Pronto para Transformar sua Vida?
            </h3>
            <p className="text-yellow-100 text-xs mb-3">
              30 minutos que podem mudar tudo!
            </p>
            <button className="bg-white text-orange-500 px-6 py-2 rounded-full text-sm font-bold">
              🚀 AGENDAR AVALIAÇÃO
            </button>
          </div>
        </div>
      </section>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="max-w-md mx-auto flex justify-around">
          <button className="flex flex-col items-center py-2 text-green-500">
            <span className="text-xl">🏠</span>
            <span className="text-xs">Home</span>
          </button>
          <button className="flex flex-col items-center py-2 text-gray-400">
            <span className="text-xl">🧠</span>
            <span className="text-xs">Análise</span>
          </button>
          <button className="flex flex-col items-center py-2 text-gray-400">
            <span className="text-xl">🛍️</span>
            <span className="text-xs">Produtos</span>
          </button>
          <button className="flex flex-col items-center py-2 text-gray-400">
            <span className="text-xl">👤</span>
            <span className="text-xs">Perfil</span>
          </button>
        </div>
      </div>
    </div>
  );
}
