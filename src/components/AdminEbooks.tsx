'use client'

import { useState, useEffect } from 'react'
import { ebookService, Ebook } from '@/lib/supabase'
import PDFImageExtractor from '@/components/PDFImageExtractor'

interface AdminEbooksProps {
  onClose: () => void
}

export default function AdminEbooks({ onClose }: AdminEbooksProps) {
  const [ebooks, setEbooks] = useState<Ebook[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingEbook, setEditingEbook] = useState<Ebook | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilter, setActiveFilter] = useState<'todos' | 'ativos' | 'inativos'>('todos')

  // Formulário para criar/editar eBook
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'receitas' as 'receitas' | 'dietas',
    price: 0,
    pdf_link: '',
    cover_image_url: '',
    preview_images: [] as string[],
    author: 'Meu Portal Fit',
    pages: undefined as number | undefined,
    language: 'pt-BR',
    featured: false
  })

  useEffect(() => {
    loadEbooks()
  }, [])

  const loadEbooks = async () => {
    try {
      console.log('🔄 Carregando todos os eBooks...')
      const allEbooks = await ebookService.getAllEbooks()
      console.log('📦 eBooks carregados:', allEbooks.length)
      setEbooks(allEbooks)
      setLoading(false)
    } catch (error) {
      console.error('❌ Erro ao carregar eBooks:', error)
      setLoading(false)
    }
  }

  const handleCreateEbook = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      console.log('🔄 Criando novo eBook...')
      const newEbook = await ebookService.createEbook({
        ...formData,
        status: 'active'
      })
      
      if (newEbook) {
        console.log('✅ eBook criado com sucesso:', newEbook)
        await loadEbooks()
        resetForm()
        setShowCreateForm(false)
        alert('eBook criado com sucesso!')
      } else {
        alert('Erro ao criar eBook')
      }
    } catch (error) {
      console.error('❌ Erro ao criar eBook:', error)
      alert('Erro ao criar eBook')
    }
  }

  const handleUpdateEbook = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingEbook) return

    try {
      console.log('🔄 Atualizando eBook:', editingEbook.id)
      const updatedEbook = await ebookService.updateEbook(editingEbook.id, formData)
      
      if (updatedEbook) {
        console.log('✅ eBook atualizado com sucesso:', updatedEbook)
        await loadEbooks()
        resetForm()
        setEditingEbook(null)
        alert('eBook atualizado com sucesso!')
      } else {
        alert('Erro ao atualizar eBook')
      }
    } catch (error) {
      console.error('❌ Erro ao atualizar eBook:', error)
      alert('Erro ao atualizar eBook')
    }
  }

  const handleDeleteEbook = async (id: number) => {
    if (!confirm('Tem certeza que deseja deletar este eBook?')) return

    try {
      console.log('🗑️ Deletando eBook:', id)
      const success = await ebookService.deleteEbook(id)
      
      if (success) {
        console.log('✅ eBook deletado com sucesso:', id)
        await loadEbooks()
        alert('eBook deletado com sucesso!')
      } else {
        alert('Erro ao deletar eBook')
      }
    } catch (error) {
      console.error('❌ Erro ao deletar eBook:', error)
      alert('Erro ao deletar eBook')
    }
  }

  const handleToggleStatus = async (id: number) => {
    try {
      console.log('🔄 Alternando status do eBook:', id)
      const updatedEbook = await ebookService.toggleEbookStatus(id)
      
      if (updatedEbook) {
        console.log('✅ Status do eBook alterado:', updatedEbook)
        await loadEbooks()
        alert(`eBook ${updatedEbook.status === 'active' ? 'ativado' : 'desativado'} com sucesso!`)
      } else {
        alert('Erro ao alterar status do eBook')
      }
    } catch (error) {
      console.error('❌ Erro ao alterar status:', error)
      alert('Erro ao alterar status do eBook')
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'receitas',
      price: 0,
      pdf_link: '',
      cover_image_url: '',
      preview_images: [],
      author: 'Meu Portal Fit',
      pages: undefined,
      language: 'pt-BR',
      featured: false
    })
  }

  const startEdit = (ebook: Ebook) => {
    setFormData({
      title: ebook.title,
      description: ebook.description,
      category: ebook.category,
      price: ebook.price,
      pdf_link: ebook.pdf_link,
      cover_image_url: ebook.cover_image_url || '',
      preview_images: ebook.preview_images || [],
      author: ebook.author,
      pages: ebook.pages || undefined,
      language: ebook.language,
      featured: ebook.featured
    })
    setEditingEbook(ebook)
    setShowCreateForm(true)
  }

  // Filtrar eBooks
  const filteredEbooks = ebooks.filter(ebook => {
    const matchesSearch = ebook.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ebook.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = activeFilter === 'todos' ||
                         (activeFilter === 'ativos' && ebook.status === 'active') ||
                         (activeFilter === 'inativos' && ebook.status === 'inactive')
    
    return matchesSearch && matchesFilter
  })

  const formatPrice = (price: number) => {
    if (price === 0) return 'Gratuito'
    return `R$ ${price.toFixed(2).replace('.', ',')}`
  }

  const getCategoryEmoji = (category: string) => {
    return category === 'receitas' ? '🍽️' : '📚'
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-green mx-auto mb-4"></div>
            <p className="text-brand-text">Carregando eBooks...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">📚 Administração de eBooks</h2>
              <p className="text-purple-100 mt-1">Gerencie seus eBooks de receitas e dietas</p>
            </div>
            <button
              onClick={onClose}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-lg transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Controles */}
          <div className="mb-6 space-y-4">
            {/* Buscador */}
            <input
              type="text"
              placeholder="Buscar eBooks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            {/* Filtros */}
            <div className="flex gap-2">
              <button
                onClick={() => setActiveFilter('todos')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeFilter === 'todos'
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                Todos ({ebooks.length})
              </button>
              <button
                onClick={() => setActiveFilter('ativos')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeFilter === 'ativos'
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                Ativos ({ebooks.filter(e => e.status === 'active').length})
              </button>
              <button
                onClick={() => setActiveFilter('inativos')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeFilter === 'inativos'
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                Inativos ({ebooks.filter(e => e.status === 'inactive').length})
              </button>
            </div>

            {/* Botão para criar novo eBook */}
            <button
              onClick={() => {
                resetForm()
                setEditingEbook(null)
                setShowCreateForm(true)
              }}
              className="w-full bg-purple-500 text-white py-3 rounded-lg font-bold hover:bg-purple-600 transition-colors"
            >
              ➕ Criar Novo eBook
            </button>
          </div>

          {/* Formulário de Criação/Edição */}
          {showCreateForm && (
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                {editingEbook ? '✏️ Editar eBook' : '➕ Criar Novo eBook'}
              </h3>
              
              <form onSubmit={editingEbook ? handleUpdateEbook : handleCreateEbook} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Título *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Categoria *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value as 'receitas' | 'dietas'})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    >
                      <option value="receitas">🍽️ Receitas</option>
                      <option value="dietas">📚 Dietas</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    rows={3}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo *
                    </label>
                    <select
                      value={formData.price === 0 ? 'gratuito' : 'pago'}
                      onChange={(e) => {
                        const isGratuito = e.target.value === 'gratuito'
                        setFormData({...formData, price: isGratuito ? 0 : 1.99})
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    >
                      <option value="gratuito">🆓 Gratuito</option>
                      <option value="pago">💰 Pago</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Páginas
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.pages || ''}
                      onChange={(e) => setFormData({...formData, pages: parseInt(e.target.value) || undefined})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Ex: 45"
                    />
                  </div>
                </div>

                {formData.price > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Preço (USD) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="0.00"
                        required
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Link do PDF *
                  </label>
                  <input
                    type="url"
                    value={formData.pdf_link}
                    onChange={(e) => setFormData({...formData, pdf_link: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="https://drive.google.com/file/d/..."
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Cole o link do Google Drive aqui. A capa será extraída automaticamente.
                  </p>
                </div>

                {/* Extrator de Imagem do PDF */}
                {formData.pdf_link && (
                  <div>
                    <PDFImageExtractor
                      pdfUrl={formData.pdf_link}
                      onImageExtracted={(imageUrl) => setFormData({...formData, cover_image_url: imageUrl})}
                    />
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                    className="rounded"
                  />
                  <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                    ⭐ eBook em destaque
                  </label>
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-purple-500 text-white py-2 rounded-lg font-medium hover:bg-purple-600 transition-colors"
                  >
                    {editingEbook ? '💾 Salvar Alterações' : '➕ Criar eBook'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateForm(false)
                      setEditingEbook(null)
                      resetForm()
                    }}
                    className="flex-1 bg-gray-500 text-white py-2 rounded-lg font-medium hover:bg-gray-600 transition-colors"
                  >
                    ❌ Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Lista de eBooks */}
          {filteredEbooks.length > 0 ? (
            <div className="space-y-4">
              {filteredEbooks.map((ebook) => (
                <div key={ebook.id} className="bg-white rounded-xl p-4 shadow-lg border border-gray-200">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      {ebook.cover_image_url ? (
                        <img
                          src={ebook.cover_image_url}
                          alt={ebook.title}
                          className="w-16 h-20 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-16 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-2xl">{getCategoryEmoji(ebook.category)}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-gray-800 text-sm leading-tight">
                          {ebook.title}
                        </h3>
                        <div className="flex gap-1 ml-2">
                          {ebook.featured && (
                            <span className="text-xs bg-yellow-100 text-yellow-800 px-1 py-0.5 rounded">
                              ⭐
                            </span>
                          )}
                          <span className={`text-xs px-1 py-0.5 rounded ${
                            ebook.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {ebook.status === 'active' ? 'Ativo' : 'Inativo'}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-600 text-xs mb-2 line-clamp-2">
                        {ebook.description}
                      </p>
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-xs text-gray-500">
                          <span className="block">{getCategoryEmoji(ebook.category)} {ebook.category}</span>
                          <span className="block">📄 {ebook.pages} páginas</span>
                        </div>
                        <span className="font-bold text-purple-600 text-sm">
                          {formatPrice(ebook.price)}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEdit(ebook)}
                          className="flex-1 bg-blue-500 text-white py-1 px-2 rounded text-xs font-medium hover:bg-blue-600 transition-colors"
                        >
                          ✏️ Editar
                        </button>
                        <button
                          onClick={() => handleToggleStatus(ebook.id)}
                          className={`flex-1 py-1 px-2 rounded text-xs font-medium transition-colors ${
                            ebook.status === 'active'
                              ? 'bg-orange-500 text-white hover:bg-orange-600'
                              : 'bg-green-500 text-white hover:bg-green-600'
                          }`}
                        >
                          {ebook.status === 'active' ? '⏸️ Desativar' : '▶️ Ativar'}
                        </button>
                        <button
                          onClick={() => handleDeleteEbook(ebook.id)}
                          className="flex-1 bg-red-500 text-white py-1 px-2 rounded text-xs font-medium hover:bg-red-600 transition-colors"
                        >
                          🗑️ Deletar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <span className="text-4xl block mb-4">📚</span>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Nenhum eBook encontrado
              </h3>
              <p className="text-gray-600 text-sm">
                {searchTerm || activeFilter !== 'todos' 
                  ? 'Tente ajustar os filtros ou termo de busca' 
                  : 'Crie seu primeiro eBook!'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
