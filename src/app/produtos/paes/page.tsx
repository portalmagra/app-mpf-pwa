import React from 'react';
import Link from 'next/link';

export default function PaesProdutosPage() {
  const paesFit = [
    {
      id: 1,
      nome: "Pão de Aveia e Banana",
      preco: "R$ 12,90",
      descricao: "Pão integral com aveia, banana e mel, rico em fibras e proteínas",
      ingredientes: ["Aveia", "Banana", "Mel", "Farinha integral", "Fermento"],
      beneficios: ["Rico em fibras", "Fonte de energia", "Sem açúcar refinado", "Proteína vegetal"]
    },
    {
      id: 2,
      nome: "Pão de Quinoa e Chia",
      preco: "R$ 15,90",
      descricao: "Pão super nutritivo com quinoa, chia e linhaça, ideal para quem busca mais proteína",
      ingredientes: ["Quinoa", "Chia", "Linhaça", "Farinha de amêndoa", "Azeite"],
      beneficios: ["Alto teor proteico", "Ômega 3", "Sem glúten", "Antioxidantes"]
    },
    {
      id: 3,
      nome: "Pão de Batata Doce",
      preco: "R$ 11,90",
      descricao: "Pão macio e saboroso feito com batata doce, perfeito para lanches saudáveis",
      ingredientes: ["Batata doce", "Farinha integral", "Azeite", "Ervas", "Fermento"],
      beneficios: ["Carboidrato complexo", "Vitamina A", "Baixo índice glicêmico", "Sabor natural"]
    },
    {
      id: 4,
      nome: "Pão de Coco e Amêndoas",
      preco: "R$ 16,90",
      descricao: "Pão low-carb com coco e amêndoas, ideal para dietas cetogênicas",
      ingredientes: ["Coco ralado", "Amêndoas", "Ovos", "Azeite", "Eritritol"],
      beneficios: ["Low-carb", "Gordura boa", "Sem açúcar", "Saciedade prolongada"]
    },
    {
      id: 5,
      nome: "Pão de Espinafre e Ricota",
      preco: "R$ 14,90",
      descricao: "Pão verde nutritivo com espinafre e ricota, rico em ferro e cálcio",
      ingredientes: ["Espinafre", "Ricota", "Farinha integral", "Azeite", "Fermento"],
      beneficios: ["Rico em ferro", "Cálcio", "Vitamina K", "Proteína animal"]
    },
    {
      id: 6,
      nome: "Pão de Cenoura e Gergelim",
      preco: "R$ 13,90",
      descricao: "Pão colorido e nutritivo com cenoura e gergelim, fonte de betacaroteno",
      ingredientes: ["Cenoura", "Gergelim", "Farinha integral", "Azeite", "Mel"],
      beneficios: ["Betacaroteno", "Vitamina A", "Cálcio", "Fibras"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🥖 Pães Fit
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Descubra nossa linha de pães saudáveis e nutritivos, feitos com ingredientes naturais 
            e sem conservantes. Cada pão é cuidadosamente elaborado para oferecer sabor e saúde 
            em cada mordida.
          </p>
        </div>

        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li><Link href="/" className="hover:text-green-600">Início</Link></li>
            <li>›</li>
            <li><Link href="/produtos" className="hover:text-green-600">Produtos</Link></li>
            <li>›</li>
            <li className="text-gray-800 font-medium">Pães Fit</li>
          </ol>
        </nav>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paesFit.map((pao) => (
            <div key={pao.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{pao.nome}</h3>
                <p className="text-green-600 text-2xl font-bold mb-3">{pao.preco}</p>
                <p className="text-gray-600 mb-4">{pao.descricao}</p>
                
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Ingredientes:</h4>
                  <div className="flex flex-wrap gap-1">
                    {pao.ingredientes.map((ingrediente, index) => (
                      <span key={index} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        {ingrediente}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Benefícios:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {pao.beneficios.map((beneficio, index) => (
                      <li key={index} className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        {beneficio}
                      </li>
                    ))}
                  </ul>
                </div>

                <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-300">
                  📱 Comprar via WhatsApp
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Info Section */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            🌟 Por que escolher nossos Pães Fit?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-3">🌱</div>
              <h3 className="font-semibold text-gray-800 mb-2">Ingredientes Naturais</h3>
              <p className="text-gray-600 text-sm">
                Utilizamos apenas ingredientes frescos e naturais, sem conservantes ou aditivos químicos.
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">⚡</div>
              <h3 className="font-semibold text-gray-800 mb-2">Alto Valor Nutricional</h3>
              <p className="text-gray-600 text-sm">
                Cada pão é rico em fibras, proteínas e vitaminas essenciais para uma alimentação saudável.
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="font-semibold text-gray-800 mb-2">Feito na Hora</h3>
              <p className="text-gray-600 text-sm">
                Todos os pães são preparados frescos, garantindo sabor e qualidade superiores.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-2">
            💬 Dúvidas sobre nossos produtos?
          </p>
          <p className="text-sm text-gray-500">
            Entre em contato conosco via WhatsApp para mais informações sobre ingredientes, 
            valores nutricionais e disponibilidade.
          </p>
        </div>
      </div>
    </div>
  );
}
