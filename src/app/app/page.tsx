export default function AppPage() {
  return (
    <div className="min-h-screen bg-[#FBF7F1] pb-20">
      {/* Header do App */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-sm mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#1B6B57] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <h1 className="text-lg font-bold text-[#1F2937]">MeuPortalFit</h1>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-[#6B7280]">👤</span>
              <span className="text-xs text-[#6B7280]">🔔</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero do App */}
      <section className="px-4 py-6">
        <div className="max-w-sm mx-auto text-center">
          <h2 className="text-xl font-bold text-[#1F2937] mb-2">
            Olá! 👋
          </h2>
          <p className="text-[#6B7280] text-sm">
            Bem-vinda ao seu app de Coach Brasileira
          </p>
        </div>
      </section>

      {/* Botão Principal - Avaliação Gratuita */}
      <section className="px-4 mb-6">
        <div className="max-w-sm mx-auto">
          <button className="w-full bg-gradient-to-r from-[#1B6B57] to-[#155E4D] rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all">
            <div className="text-center">
              <div className="text-4xl mb-3">🧪</div>
              <h3 className="font-bold text-lg mb-2">Avaliação Gratuita</h3>
              <p className="text-green-100 text-sm mb-3">Descubra seu plano ideal em 60s</p>
              <div className="bg-white/20 rounded-xl p-3">
                <p className="text-sm font-semibold">
                  Fazer meu diagnóstico agora
                </p>
                <p className="text-xs text-green-100 mt-1">
                  Receba indicações de produtos Amazon + análise personalizada
                </p>
              </div>
            </div>
          </button>
        </div>
      </section>

      {/* Cards de Funcionalidades */}
      <section className="px-4 mb-6">
        <div className="max-w-sm mx-auto">
          <div className="grid grid-cols-2 gap-3">
            {/* Receitas */}
            <button className="bg-white rounded-xl p-4 shadow-sm border border-[#E5E7EB] hover:shadow-md transition-all">
              <div className="text-center">
                <div className="text-3xl mb-2">🍲</div>
                <h4 className="font-semibold text-[#1F2937] text-sm">Receitas</h4>
                <p className="text-xs text-[#6B7280] mt-1">3 ideias pra hoje</p>
              </div>
            </button>

            {/* Mercado */}
            <button className="bg-white rounded-xl p-4 shadow-sm border border-[#E5E7EB] hover:shadow-md transition-all">
              <div className="text-center">
                <div className="text-3xl mb-2">🛒</div>
                <h4 className="font-semibold text-[#1F2937] text-sm">Mercado</h4>
                <p className="text-xs text-[#6B7280] mt-1">Onde comprar</p>
              </div>
            </button>

            {/* Progresso */}
            <button className="bg-white rounded-xl p-4 shadow-sm border border-[#E5E7EB] hover:shadow-md transition-all">
              <div className="text-center">
                <div className="text-3xl mb-2">📊</div>
                <h4 className="font-semibold text-[#1F2937] text-sm">Progresso</h4>
                <p className="text-xs text-[#6B7280] mt-1">Suas metas</p>
              </div>
            </button>

            {/* Perfil */}
            <button className="bg-white rounded-xl p-4 shadow-sm border border-[#E5E7EB] hover:shadow-md transition-all">
              <div className="text-center">
                <div className="text-3xl mb-2">👤</div>
                <h4 className="font-semibold text-[#1F2937] text-sm">Perfil</h4>
                <p className="text-xs text-[#6B7280] mt-1">Configurações</p>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Dica do Dia */}
      <section className="px-4 mb-6">
        <div className="max-w-sm mx-auto">
          <div className="bg-gradient-to-r from-[#F59E0B] to-[#F59E0B] rounded-xl p-4 text-white">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">💡</span>
              <h3 className="font-bold text-sm">Dica do Dia</h3>
            </div>
            <p className="text-xs text-amber-100">
              Beba água com limão em jejum para acelerar o metabolismo e desintoxicar o corpo!
            </p>
          </div>
        </div>
      </section>

      {/* CTA Coach */}
      <section className="px-4 mb-6">
        <div className="max-w-sm mx-auto">
          <button className="w-full bg-[#F59E0B] text-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl">👩‍💼</span>
              <div className="text-center">
                <p className="font-bold text-sm">Coach Brasileira por $10</p>
                <p className="text-xs text-amber-100">Avaliação personalizada</p>
              </div>
            </div>
          </button>
        </div>
      </section>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] px-4 py-2">
        <div className="max-w-sm mx-auto flex justify-around">
          <button className="flex flex-col items-center py-2 text-[#1B6B57]">
            <span className="text-xl">🏠</span>
            <span className="text-xs font-semibold">Home</span>
          </button>
          <button className="flex flex-col items-center py-2 text-[#6B7280]">
            <span className="text-xl">🍲</span>
            <span className="text-xs">Receitas</span>
          </button>
          <button className="flex flex-col items-center py-2 text-[#6B7280]">
            <span className="text-xl">🛒</span>
            <span className="text-xs">Mercado</span>
          </button>
          <button className="flex flex-col items-center py-2 text-[#6B7280]">
            <span className="text-xl">👤</span>
            <span className="text-xs">Perfil</span>
          </button>
        </div>
      </div>
    </div>
  );
}
