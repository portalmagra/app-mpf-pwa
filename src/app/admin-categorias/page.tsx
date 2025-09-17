'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Logo from '@/components/Logo'
import { categoryService, Category } from '@/lib/supabase'

export default function AdminCategorias() {
  const [categories, setCategories] = useState<Category[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState<string | null>(null)
  const [operationStatus, setOperationStatus] = useState('')
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  const [newCategory, setNewCategory] = useState({
    id: '',
    name: '',
    description: '',
    color: '#96CEB4',
    icon: '📦'
  })

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      setLoading(true)
      console.log('🔄 Carregando categorias...')
      
      const categoriesData = await categoryService.getAllCategories()
      console.log('🏷️ Categorias carregadas:', categoriesData.length)
      
      setCategories(categoriesData)
    } catch (error) {
      console.error('❌ Erro ao carregar categorias:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCategory = async () => {
    if (!newCategory.name || !newCategory.id) {
      alert('Por favor, preencha o nome e o ID da categoria')
      return
    }

    try {
      setOperationStatus('Criando categoria...')
      console.log('🔄 Criando categoria:', newCategory)

      const createdCategory = await categoryService.createCategory(newCategory)

      if (createdCategory) {
        console.log('✅ Categoria criada:', createdCategory)
        setCategories(prev => [createdCategory, ...prev])
        
        // Reset form
        setNewCategory({
          id: '',
          name: '',
          description: '',
          color: '#96CEB4',
          icon: '📦'
        })
        setShowForm(false)
        setOperationStatus('Categoria criada com sucesso!')
        setTimeout(() => setOperationStatus(''), 3000)
      } else {
        alert('Erro ao criar categoria. Tente novamente.')
      }
    } catch (error) {
      console.error('❌ Erro ao criar categoria:', error)
      alert('Erro ao criar categoria. Tente novamente.')
    }
  }

  const handleUpdateCategory = async () => {
    if (editingCategory && newCategory.name && newCategory.id) {
      try {
        setOperationStatus('Atualizando categoria...')
        console.log('🔄 Atualizando categoria:', editingCategory)

        const updatedCategory = await categoryService.updateCategory(editingCategory, newCategory)

        if (updatedCategory) {
          console.log('✅ Categoria atualizada:', updatedCategory)
          setCategories(prev =>
            prev.map(category =>
              category.id === editingCategory ? updatedCategory : category
            )
          )

          // Reset form
          setNewCategory({
            id: '',
            name: '',
            description: '',
            color: '#96CEB4',
            icon: '📦'
          })
          setEditingCategory(null)
          setShowForm(false)
          setOperationStatus('Categoria atualizada com sucesso!')
          setTimeout(() => setOperationStatus(''), 3000)
        } else {
          alert('Erro ao atualizar categoria. Tente novamente.')
        }
      } catch (error) {
        console.error('❌ Erro ao atualizar categoria:', error)
        alert('Erro ao atualizar categoria. Tente novamente.')
      }
    }
  }

  const handleDeleteCategory = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta categoria?')) {
      try {
        setOperationStatus('Deletando categoria...')
        console.log('🗑️ Deletando categoria:', id)

        const success = await categoryService.deleteCategory(id)

        if (success) {
          console.log('✅ Categoria deletada:', id)
          setCategories(prev => prev.filter(category => category.id !== id))
          setOperationStatus('Categoria excluída com sucesso!')
          setTimeout(() => setOperationStatus(''), 3000)
        } else {
          alert('Erro ao excluir categoria. Tente novamente.')
        }
      } catch (error) {
        console.error('❌ Erro ao deletar categoria:', error)
        alert('Erro ao excluir categoria. Tente novamente.')
      }
    }
  }

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category.id)
    setNewCategory({
      id: category.id,
      name: category.name,
      description: category.description || '',
      color: category.color || '#96CEB4',
      icon: category.icon || '📦'
    })
    setShowForm(true)
  }

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const commonIcons = ['🔥', '⚡', '🛡️', '🧘', '☕', '🌿', '😴', '✨', '👨', '⚖️', '♻️', '🌸', '🛒', '💪', '🍎', '🏋️', '📦', '🍞']

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-green mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando categorias...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Logo variant="horizontal" size="md" />
            <div className="flex items-center space-x-4">
              <Link href="/admin" className="text-sm text-gray-600 hover:text-brand-green transition-colors">
                ← Voltar ao Admin
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">🏷️ Admin Categorias</h1>
          <p className="text-gray-600">Gerencie as categorias de produtos e receitas.</p>
        </div>

        {operationStatus && (
          <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {operationStatus}
          </div>
        )}

        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-brand-green text-white px-6 py-3 rounded-lg font-medium hover:bg-brand-greenDark transition-colors"
          >
            {showForm ? 'Cancelar' : '+ Adicionar Nova Categoria'}
          </button>
          
          <button
            onClick={loadCategories}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
          >
            🔄 Recarregar
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ID da Categoria *
                </label>
                <input
                  type="text"
                  value={newCategory.id}
                  onChange={(e) => setNewCategory(prev => ({ ...prev, id: e.target.value.toLowerCase().replace(/\s+/g, '-') }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green"
                  placeholder="Ex: emagrecimento"
                  disabled={!!editingCategory}
                />
                <p className="text-xs text-gray-500 mt-1">Será usado na URL (ex: /produtos/emagrecimento)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome da Categoria *
                </label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green"
                  placeholder="Ex: Emagrecimento"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição
                </label>
                <textarea
                  value={newCategory.description}
                  onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green"
                  rows={3}
                  placeholder="Descrição da categoria..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cor
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="color"
                    value={newCategory.color}
                    onChange={(e) => setNewCategory(prev => ({ ...prev, color: e.target.value }))}
                    className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={newCategory.color}
                    onChange={(e) => setNewCategory(prev => ({ ...prev, color: e.target.value }))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green"
                    placeholder="#96CEB4"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ícone
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newCategory.icon}
                    onChange={(e) => setNewCategory(prev => ({ ...prev, icon: e.target.value }))}
                    className="w-16 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green text-center"
                    placeholder="🔥"
                    maxLength={2}
                  />
                  <div className="flex flex-wrap gap-1">
                    {commonIcons.map(icon => (
                      <button
                        key={icon}
                        onClick={() => setNewCategory(prev => ({ ...prev, icon }))}
                        className={`w-8 h-8 text-lg border rounded hover:bg-gray-100 ${
                          newCategory.icon === icon ? 'bg-brand-green text-white' : ''
                        }`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => {
                  setShowForm(false)
                  setEditingCategory(null)
                  setNewCategory({
                    id: '',
                    name: '',
                    description: '',
                    color: '#96CEB4',
                    icon: '📦'
                  })
                }}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={editingCategory ? handleUpdateCategory : handleCreateCategory}
                className="px-6 py-2 bg-brand-green text-white rounded-md hover:bg-brand-greenDark transition-colors"
              >
                {editingCategory ? 'Atualizar' : 'Criar'} Categoria
              </button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 md:mb-0">
              Categorias ({filteredCategories.length})
            </h2>
            
            <input
              type="text"
              placeholder="Buscar categorias..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map(category => (
              <div key={category.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{category.icon}</span>
                    <div>
                      <h3 className="font-bold text-gray-800">{category.name}</h3>
                      <p className="text-sm text-gray-500">ID: {category.id}</p>
                    </div>
                  </div>
                  <div
                    className="w-6 h-6 rounded-full border-2 border-gray-300"
                    style={{ backgroundColor: category.color }}
                  ></div>
                </div>
                
                {category.description && (
                  <p className="text-sm text-gray-600 mb-4">{category.description}</p>
                )}
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditCategory(category)}
                    className="flex-1 bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600 transition-colors"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    className="flex-1 bg-red-500 text-white px-3 py-2 rounded text-sm hover:bg-red-600 transition-colors"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredCategories.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Nenhuma categoria encontrada.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}