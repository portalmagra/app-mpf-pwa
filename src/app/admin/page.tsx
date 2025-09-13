'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Logo from '@/components/Logo'

interface Receita {
  id: number
  nome: string
  descricao: string
  tipo: 'gratuita' | 'paga'
  preco: number
  link_pdf: string
  status: 'ativa' | 'inativa'
  data_criacao: string
}

export default function AdminPage() {
  const [receitas, setReceitas] = useState<Receita[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    tipo: 'gratuita' as 'gratuita' | 'paga',
    preco: 0,
    link_pdf: '',
    status: 'ativa' as 'ativa' | 'inativa'
  })

  useEffect(() => {
    // Mock data para demonstração
    const mockReceitas: Receita[] = [
      {
        id: 1,
        nome: "Smoothie Verde Detox",
        descricao: "Bebida refrescante rica em clorofila e antioxidantes para desintoxicar o organismo",
        tipo: "gratuita",
        preco: 0,
        link_pdf: "https://drive.google.com/file/d/abc123",
        status: "ativa",
        data_criacao: "2024-01-15"
      },
      {
        id: 2,
        nome: "Bowl Energético com Quinoa",
        descricao: "Refeição completa e nutritiva perfeita para dar energia durante o dia",
        tipo: "paga",
        preco: 1.99,
        link_pdf: "https://drive.google.com/file/d/def456",
        status: "ativa",
        data_criacao: "2024-01-16"
      },
      {
        id: 3,
        nome: "Sopa Anti-inflamatória",
        descricao: "Sopa reconfortante com ingredientes que combatem inflamações",
        tipo: "paga",
        preco: 2.99,
        link_pdf: "https://drive.google.com/file/d/ghi789",
        status: "ativa",
        data_criacao: "2024-01-17"
      }
    ]
    
    setTimeout(() => {
      setReceitas(mockReceitas)
      setLoading(false)
    }, 1000)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const novaReceita: Receita = {
      id: receitas.length + 1,
      ...formData,
      data_criacao: new Date().toISOString().split('T')[0]
    }
    
    setReceitas([...receitas, novaReceita])
    setFormData({
      nome: '',
      descricao: '',
      tipo: 'gratuita',
      preco: 0,
      link_pdf: '',
      status: 'ativa'
    })
    setShowForm(false)
  }

  const generateLink = (receita: Receita) => {
    const linkUnico = `app.meuportalfit.com/receita/${receita.id}-${receita.nome.toLowerCase().replace(/\s+/g, '-')}`
    navigator.clipboard.writeText(linkUnico)
    alert(`Link único copiado: ${linkUnico}`)
  }

  const toggleStatus = (id: number) => {
    setReceitas(receitas.map(receita => 
      receita.id === id 
        ? { ...receita, status: receita.status === 'ativa' ? 'inativa' : 'ativa' }
        : receita
    ))
  }

  return (
    <div className="min-h-screen bg-brand-cream">
      {/* Header */}
      <header className="bg-white shadow-soft sticky top-0 z-50">
        <div className="max-w-sm mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <Logo variant="horizontal" size="md" />
            <Link href="/">
              <button className="bg-brand-green text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-greenDark transition-colors">
                🏠 Início
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="max-w-sm mx-auto px-4 py-6">
        {/* Título */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-brand-text mb-2">
            🔧 Área Administrativa
          </h1>
          <p className="text-brand-textLight text-sm">
            Gerencie suas receitas e protocolos nutricionais
          </p>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-soft text-center">
            <div className="text-2xl font-bold text-brand-green">
              {receitas.length}
            </div>
            <div className="text-sm text-brand-textLight">
              Total de Receitas
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-soft text-center">
            <div className="text-2xl font-bold text-brand-green">
              {receitas.filter(r => r.status === 'ativa').length}
            </div>
            <div className="text-sm text-brand-textLight">
              Receitas Ativas
            </div>
          </div>
        </div>

        {/* Botão Adicionar Receita */}
        <div className="mb-6">
          <button
            onClick={() => setShowForm(!showForm)}
            className="w-full bg-brand-green text-white py-3 rounded-xl font-bold hover:bg-brand-greenDark transition-colors"
          >
            {showForm ? 'Cancelar' : '+ Adicionar Nova Receita'}
          </button>
        </div>

        {/* Formulário de Cadastro */}
        {showForm && (
          <div className="bg-white rounded-xl p-4 shadow-soft mb-6">
            <h3 className="font-bold text-brand-text mb-4">Cadastrar Nova Receita</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-brand-text mb-1">
                  Nome da Receita
                </label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                  className="w-full px-3 py-2 border border-brand-green/20 rounded-lg focus:outline-none focus:border-brand-green"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-text mb-1">
                  Descrição
                </label>
                <textarea
                  value={formData.descricao}
                  onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                  className="w-full px-3 py-2 border border-brand-green/20 rounded-lg focus:outline-none focus:border-brand-green"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-text mb-1">
                  Tipo
                </label>
                <select
                  value={formData.tipo}
                  onChange={(e) => setFormData({...formData, tipo: e.target.value as 'gratuita' | 'paga'})}
                  className="w-full px-3 py-2 border border-brand-green/20 rounded-lg focus:outline-none focus:border-brand-green"
                >
                  <option value="gratuita">Gratuita</option>
                  <option value="paga">Paga</option>
                </select>
              </div>

              {formData.tipo === 'paga' && (
                <div>
                  <label className="block text-sm font-medium text-brand-text mb-1">
                    Preço ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.preco}
                    onChange={(e) => setFormData({...formData, preco: parseFloat(e.target.value)})}
                    className="w-full px-3 py-2 border border-brand-green/20 rounded-lg focus:outline-none focus:border-brand-green"
                    required={formData.tipo === 'paga'}
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-brand-text mb-1">
                  Link do PDF (Google Drive)
                </label>
                <input
                  type="url"
                  value={formData.link_pdf}
                  onChange={(e) => setFormData({...formData, link_pdf: e.target.value})}
                  className="w-full px-3 py-2 border border-brand-green/20 rounded-lg focus:outline-none focus:border-brand-green"
                  placeholder="https://drive.google.com/file/d/..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-text mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value as 'ativa' | 'inativa'})}
                  className="w-full px-3 py-2 border border-brand-green/20 rounded-lg focus:outline-none focus:border-brand-green"
                >
                  <option value="ativa">Ativa</option>
                  <option value="inativa">Inativa</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-brand-green text-white py-3 rounded-lg font-bold hover:bg-brand-greenDark transition-colors"
              >
                Salvar Receita
              </button>
            </form>
          </div>
        )}

        {/* Lista de Receitas */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl p-4 shadow-soft animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-4"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {receitas.map((receita) => (
              <div key={receita.id} className="bg-white rounded-xl p-4 shadow-soft">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-brand-text text-lg">
                        {receita.nome}
                      </h3>
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                        receita.status === 'ativa' 
                          ? 'bg-brand-green text-white' 
                          : 'bg-gray-400 text-white'
                      }`}>
                        {receita.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-brand-textLight text-sm leading-relaxed mb-2">
                      {receita.descricao}
                    </p>
                    <div className="text-sm text-brand-textLight">
                      <strong>Tipo:</strong> {receita.tipo === 'gratuita' ? 'Gratuita' : `Paga - $${receita.preco.toFixed(2)}`}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => generateLink(receita)}
                    className="flex-1 bg-brand-blue text-white py-2 rounded-lg text-sm font-medium hover:bg-brand-blueDark transition-colors"
                  >
                    🔗 Gerar Link
                  </button>
                  <button
                    onClick={() => toggleStatus(receita.id)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                      receita.status === 'ativa'
                        ? 'bg-red-500 text-white hover:bg-red-600'
                        : 'bg-brand-green text-white hover:bg-brand-greenDark'
                    }`}
                  >
                    {receita.status === 'ativa' ? 'Desativar' : 'Ativar'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
