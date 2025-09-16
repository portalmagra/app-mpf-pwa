'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Logo from '@/components/Logo'
import ImageUpload from '@/components/ImageUpload'
import PDFImageExtractor from '@/components/PDFImageExtractor'
import { recipeService, Recipe } from '@/lib/supabase'

export default function AdminReceitasPage() {
  const [receitas, setReceitas] = useState<Recipe[]>([])
  const [filteredReceitas, setFilteredReceitas] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('todas')
  const [selectedStatus, setSelectedStatus] = useState('todas')
  const [showAddForm, setShowAddForm] = useState(false)
  const [newReceita, setNewReceita] = useState({
    name: '',
    description: '',
    type: '',
    price: 0,
    pdf_link: '',
    image_url: '',
    status: 'active' as 'active' | 'inactive'
  })

  useEffect(() => {
    loadReceitas()
  }, [])

  useEffect(() => {
    filterReceitas()
  }, [receitas, searchTerm, selectedCategory, selectedStatus])

  const loadReceitas = async () => {
    try {
      setLoading(true)
      const allRecipes = await recipeService.getAllRecipes()
      setReceitas(allRecipes)
    } catch (error) {
      console.error('Erro ao carregar receitas:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterReceitas = () => {
    let filtered = receitas

    // Filtro por busca
    if (searchTerm) {
      filtered = filtered.filter(receita =>
        receita.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        receita.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtro por categoria
    if (selectedCategory !== 'todas') {
      filtered = filtered.filter(receita =>
        receita.type?.toLowerCase() === selectedCategory.toLowerCase()
      )
    }

    // Filtro por status
    if (selectedStatus !== 'todas') {
      filtered = filtered.filter(receita =>
        receita.status === selectedStatus
      )
    }

    setFilteredReceitas(filtered)
  }

  const getCategoryOptions = () => {
    const categories = [...new Set(receitas.map(r => r.type).filter(Boolean))]
    return categories
  }

  const handleEditReceita = (receita: Recipe) => {
    // Implementar edição
    alert(`Editar receita: ${receita.name}`)
  }

  const handleDeleteReceita = async (receita: Recipe) => {
    if (confirm(`Tem certeza que deseja excluir a receita "${receita.name}"?`)) {
      try {
        // Implementar exclusão
        alert(`Excluir receita: ${receita.name}`)
        await loadReceitas() // Recarregar lista
      } catch (error) {
        console.error('Erro ao excluir receita:', error)
        alert('Erro ao excluir receita')
      }
    }
  }

  const handleToggleStatus = async (receita: Recipe) => {
    try {
      // Implementar toggle de status
      alert(`Alterar status da receita: ${receita.name}`)
      await loadReceitas() // Recarregar lista
    } catch (error) {
      console.error('Erro ao alterar status:', error)
      alert('Erro ao alterar status')
    }
  }

  const handleAddReceita = async () => {
    try {
      if (!newReceita.name || !newReceita.type || !newReceita.pdf_link) {
        alert('Preencha todos os campos obrigatórios')
        return
      }

      const receitaData = {
        ...newReceita,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      // Implementar criação da receita
      alert(`Cadastrar nova receita: ${newReceita.name}`)
      
      // Limpar formulário
      setNewReceita({
        name: '',
        description: '',
        type: '',
        price: 0,
        pdf_link: '',
        image_url: '',
        status: 'active'
      })
      setShowAddForm(false)
      
      await loadReceitas() // Recarregar lista
    } catch (error) {
      console.error('Erro ao cadastrar receita:', error)
      alert('Erro ao cadastrar receita')
    }
  }

  const resetForm = () => {
    setNewReceita({
      name: '',
      description: '',
      type: '',
      price: 0,
      pdf_link: '',
      image_url: '',
      status: 'active'
    })
    setShowAddForm(false)
    // Limpar filtros quando fechar o formulário
    setSearchTerm('')
    setSelectedCategory('todas')
    setSelectedStatus('todas')
  }

  const openAddForm = () => {
    setShowAddForm(true)
    // Limpar filtros quando abrir o formulário
    setSearchTerm('')
    setSelectedCategory('todas')
    setSelectedStatus('todas')
  }

  return (
    <div className="min-h-screen bg-brand-cream">
      {/* Header */}
      <header className="bg-white shadow-soft sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <Logo variant="horizontal" size="md" />
            <Link href="/admin">
              <button className="bg-brand-green text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-greenDark transition-colors">
                ← Voltar ao Admin
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Título */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-brand-text">
            🍽️ Administração de Receitas
          </h1>
          <p className="text-brand-text2 mt-2">
            Gerencie todas as receitas cadastradas
          </p>
          
          {/* Botão Nova Receita */}
          <div className="mt-4">
            <button
              onClick={showAddForm ? resetForm : openAddForm}
              className="bg-brand-green text-white px-6 py-3 rounded-lg font-medium hover:bg-brand-greenDark transition-colors shadow-lg"
            >
              {showAddForm ? '❌ Cancelar' : '➕ Nova Receita'}
            </button>
          </div>
        </div>

        {/* Filtros e Busca - Apenas quando não está no formulário */}
        {!showAddForm && (
          <div className="bg-white rounded-xl p-6 shadow-soft mb-6">
            <h2 className="text-xl font-bold text-brand-text mb-4">
              🔍 Buscar e Filtrar Receitas
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Busca */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-brand-text mb-2">
                  🔍 Buscar Receita
                </label>
                <input
                  type="text"
                  placeholder="Digite o nome da receita..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green"
                />
              </div>

              {/* Filtro por Categoria */}
              <div>
                <label className="block text-sm font-medium text-brand-text mb-2">
                  📂 Categoria
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green"
                >
                  <option value="todas">Todas as categorias</option>
                  {getCategoryOptions().map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtro por Status */}
              <div>
                <label className="block text-sm font-medium text-brand-text mb-2">
                  📊 Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-4 py-3 border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green"
                >
                  <option value="todas">Todos os status</option>
                  <option value="active">Ativo</option>
                  <option value="inactive">Inativo</option>
                </select>
              </div>
            </div>

            {/* Estatísticas */}
            <div className="mt-4 flex justify-between items-center text-sm text-brand-text2">
              <span>Total: {receitas.length} receitas</span>
              <span>Filtradas: {filteredReceitas.length} receitas</span>
            </div>
          </div>
        )}

        {/* Formulário de Nova Receita */}
        {showAddForm && (
          <div className="bg-white rounded-xl p-6 shadow-soft mb-6">
            <h2 className="text-xl font-bold text-brand-text mb-4">
              ➕ Cadastrar Nova Receita
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nome da Receita */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-brand-text mb-2">
                  Nome da Receita *
                </label>
                <input
                  type="text"
                  value={newReceita.name}
                  onChange={(e) => setNewReceita({...newReceita, name: e.target.value})}
                  placeholder="Ex: Bolo de Chocolate Fit"
                  className="w-full px-4 py-3 border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green"
                />
              </div>

              {/* Descrição */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-brand-text mb-2">
                  Descrição
                </label>
                <textarea
                  value={newReceita.description}
                  onChange={(e) => setNewReceita({...newReceita, description: e.target.value})}
                  placeholder="Descrição da receita..."
                  rows={3}
                  className="w-full px-4 py-3 border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green"
                />
              </div>

              {/* Tipo/Categoria */}
              <div>
                <label className="block text-sm font-medium text-brand-text mb-2">
                  Categoria *
                </label>
                <select
                  value={newReceita.type}
                  onChange={(e) => setNewReceita({...newReceita, type: e.target.value})}
                  className="w-full px-4 py-3 border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green"
                >
                  <option value="">Selecione uma categoria</option>
                  <option value="doces">Doces</option>
                  <option value="salgadas">Salgadas</option>
                  <option value="sucos">Sucos</option>
                  <option value="saladas">Saladas</option>
                  <option value="sopas">Sopas</option>
                  <option value="shots">Shots</option>
                  <option value="low-carb">Low Carb</option>
                </select>
              </div>

              {/* Tipo e Valor */}
              <div className="md:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Tipo */}
                  <div>
                    <label className="block text-sm font-medium text-brand-text mb-2">
                      Tipo
                    </label>
                    <select
                      value={newReceita.price === 0 ? 'gratuita' : 'paga'}
                      onChange={(e) => {
                        if (e.target.value === 'gratuita') {
                          setNewReceita({...newReceita, price: 0})
                        } else {
                          setNewReceita({...newReceita, price: 9.99})
                        }
                      }}
                      className="w-full px-4 py-3 border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green"
                    >
                      <option value="gratuita">Gratuita</option>
                      <option value="paga">Paga</option>
                    </select>
                  </div>

                  {/* Valor (apenas se for paga) */}
                  {newReceita.price > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-brand-text mb-2">
                        Valor (USD)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={newReceita.price}
                        onChange={(e) => setNewReceita({...newReceita, price: parseFloat(e.target.value) || 0.01})}
                        placeholder="9.99"
                        className="w-full px-4 py-3 border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-brand-text mb-2">
                  Status
                </label>
                <select
                  value={newReceita.status}
                  onChange={(e) => setNewReceita({...newReceita, status: e.target.value as 'active' | 'inactive'})}
                  className="w-full px-4 py-3 border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green"
                >
                  <option value="active">Ativo</option>
                  <option value="inactive">Inativo</option>
                </select>
              </div>

              {/* Link PDF */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-brand-text mb-2">
                  Link do PDF *
                </label>
                <input
                  type="url"
                  value={newReceita.pdf_link}
                  onChange={(e) => setNewReceita({...newReceita, pdf_link: e.target.value})}
                  placeholder="https://drive.google.com/file/d/..."
                  className="w-full px-4 py-3 border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green"
                />
              </div>

              {/* Extrator de Imagem do PDF */}
              {newReceita.pdf_link && (
                <div className="md:col-span-2">
                  <PDFImageExtractor
                    pdfUrl={newReceita.pdf_link}
                    onImageExtracted={(imageUrl) => setNewReceita({...newReceita, image_url: imageUrl})}
                  />
                </div>
              )}

              {/* Upload Manual de Imagem */}
              <div className="md:col-span-2">
                <ImageUpload
                  onImageUpload={(imageUrl) => setNewReceita({...newReceita, image_url: imageUrl})}
                  currentImage={newReceita.image_url}
                />
              </div>

            </div>

            {/* Botões do Formulário */}
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={resetForm}
                className="px-6 py-3 border border-brand-border rounded-lg text-brand-text hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddReceita}
                className="px-6 py-3 bg-brand-green text-white rounded-lg font-medium hover:bg-brand-greenDark transition-colors"
              >
                Cadastrar Receita
              </button>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-green mx-auto mb-4"></div>
            <p className="text-brand-text2">Carregando receitas...</p>
          </div>
        )}

        {/* Lista de Receitas */}
        {!loading && (
          <div className="bg-white rounded-xl shadow-soft overflow-hidden">
            {filteredReceitas.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🍽️</div>
                <h3 className="text-lg font-semibold text-brand-text mb-2">
                  Nenhuma receita encontrada
                </h3>
                <p className="text-brand-text2">
                  {searchTerm || selectedCategory !== 'todas' || selectedStatus !== 'todas'
                    ? 'Tente ajustar os filtros de busca'
                    : 'Nenhuma receita cadastrada ainda'
                  }
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-brand-greenSoft">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-brand-text">Receita</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-brand-text">Tipo</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-brand-text">Preço</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-brand-text">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-brand-text">Criado em</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-brand-text">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-border">
                    {filteredReceitas.map((receita) => (
                      <tr key={receita.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium text-brand-text">{receita.name}</div>
                            <div className="text-sm text-brand-text2 truncate max-w-xs">
                              {receita.description || 'Sem descrição'}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {receita.type || 'Não definido'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            receita.price === 0 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-purple-100 text-purple-800'
                          }`}>
                            {receita.price === 0 ? 'GRATUITO' : `$${receita.price}`}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            receita.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {receita.status === 'active' ? 'Ativo' : 'Inativo'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-brand-text2">
                          {new Date(receita.created_at).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center space-x-2">
                            <button
                              onClick={() => handleEditReceita(receita)}
                              className="bg-yellow-100 text-yellow-600 px-3 py-1 rounded text-xs font-medium hover:bg-yellow-200 transition-colors"
                            >
                              ✏️ Editar
                            </button>
                            <button
                              onClick={() => handleToggleStatus(receita)}
                              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                                receita.status === 'active'
                                  ? 'bg-orange-100 text-orange-600 hover:bg-orange-200'
                                  : 'bg-green-100 text-green-600 hover:bg-green-200'
                              }`}
                            >
                              {receita.status === 'active' ? '⏸️ Pausar' : '▶️ Ativar'}
                            </button>
                            <button
                              onClick={() => handleDeleteReceita(receita)}
                              className="bg-red-100 text-red-600 px-3 py-1 rounded text-xs font-medium hover:bg-red-200 transition-colors"
                            >
                              🗑️ Excluir
                            </button>
                            <a
                              href={receita.pdf_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-blue-100 text-blue-600 px-3 py-1 rounded text-xs font-medium hover:bg-blue-200 transition-colors"
                            >
                              🔗 Link
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}