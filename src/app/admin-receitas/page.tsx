'use client'

import { useState } from 'react'
import Link from 'next/link'
import ImageUpload from '@/components/ImageUpload'
import PDFImageExtractor from '@/components/PDFImageExtractor'
import Logo from '@/components/Logo'

export default function AdminReceitas() {
  // Dados padrão das receitas
  const defaultRecipes = [
    {
      id: 1,
      name: 'Smoothie Bowl de Açaí',
      description: 'Bowl energético com açaí, banana e granola',
      type: 'doces',
      price: 0,
      pdfLink: 'https://drive.google.com/file/d/1abc123/view',
      status: 'active',
      accessLink: 'https://app.meuportalfit.com/receita/1'
    },
    {
      id: 2,
      name: 'Salada de Quinoa',
      description: 'Salada completa com quinoa, vegetais e molho tahine',
      type: 'saladas',
      price: 0,
      pdfLink: 'https://drive.google.com/file/d/1def456/view',
      status: 'active',
      accessLink: 'https://app.meuportalfit.com/receita/2'
    },
    {
      id: 3,
      name: 'Shot de Gengibre',
      description: 'Shot energético com gengibre, limão e mel',
      type: 'shots',
      price: 15,
      pdfLink: 'https://drive.google.com/file/d/1ghi789/view',
      status: 'active',
      accessLink: 'https://app.meuportalfit.com/receita/3'
    }
  ]

  // Carregar receitas do localStorage ou usar dados padrão
  const [recipes, setRecipes] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedRecipes = localStorage.getItem('mpf-recipes')
      return savedRecipes ? JSON.parse(savedRecipes) : defaultRecipes
    }
    return defaultRecipes
  })

  const [newRecipe, setNewRecipe] = useState({
    name: '',
    description: '',
    type: 'doces',
    price: 0,
    pdfLink: '',
    imageUrl: '',
    status: 'active',
    isFree: true
  })

  const [showForm, setShowForm] = useState(false)
  const [editingRecipe, setEditingRecipe] = useState<number | null>(null)

  const recipeTypes = [
    { id: 'doces', name: 'Doces', icon: '🍰' },
    { id: 'salgadas', name: 'Salgadas', icon: '🥗' },
    { id: 'lowcarb', name: 'Low Carb', icon: '🥑' },
    { id: 'saladas', name: 'Saladas', icon: '🥬' },
    { id: 'shots', name: 'Shots', icon: '💊' },
    { id: 'sopas', name: 'Sopas', icon: '🍲' },
    { id: 'funcionais', name: 'Funcionais', icon: '⚡' },
    { id: 'sucos', name: 'Sucos', icon: '🥤' }
  ]

  const handleAddRecipe = () => {
    console.log('Tentando salvar receita:', newRecipe)
    
    if (newRecipe.name && newRecipe.pdfLink) {
      const id = Math.max(...recipes.map((r: { id: number }) => r.id)) + 1
      const accessLink = `https://app.meuportalfit.com/receita/${id}`
      
      const recipe = {
        id,
        ...newRecipe,
        accessLink
      }
      
      console.log('Nova receita criada:', recipe)
      
      const updatedRecipes = [...recipes, recipe]
      setRecipes(updatedRecipes)
      
      // Salvar no localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('mpf-recipes', JSON.stringify(updatedRecipes))
        console.log('Receita salva no localStorage')
      }
      
      // Reset form
      setNewRecipe({
        name: '',
        description: '',
        type: 'doces',
        price: 0,
        pdfLink: '',
        imageUrl: '',
        status: 'active',
        isFree: true
      })
      setEditingRecipe(null)
      setShowForm(false)
      
      alert('Receita salva com sucesso!')
    } else {
      alert('Por favor, preencha todos os campos obrigatórios (Nome e Link do PDF)')
    }
  }

  const toggleRecipeStatus = (id: number) => {
    const updatedRecipes = recipes.map((recipe: { id: number; status: string; name: string; description: string; price: number; pdfLink: string; imageUrl?: string }) => 
      recipe.id === id 
        ? { ...recipe, status: recipe.status === 'active' ? 'inactive' : 'active' }
        : recipe
    )
    setRecipes(updatedRecipes)
    
    // Salvar no localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('mpf-recipes', JSON.stringify(updatedRecipes))
    }
  }

  const copyAccessLink = (link: string) => {
    navigator.clipboard.writeText(link)
    alert('Link copiado para a área de transferência!')
  }

  const handleEditRecipe = (recipe: { id: number; name: string; description: string; type: string; price: number; pdfLink: string; imageUrl?: string; status: string }) => {
    setNewRecipe({
      name: recipe.name,
      description: recipe.description,
      type: recipe.type,
      price: recipe.price,
      pdfLink: recipe.pdfLink,
      imageUrl: recipe.imageUrl || '',
      status: recipe.status,
      isFree: recipe.price === 0
    })
    setEditingRecipe(recipe.id)
    setShowForm(true)
  }

  const handleUpdateRecipe = () => {
    if (editingRecipe && newRecipe.name && newRecipe.pdfLink) {
      const updatedRecipes = recipes.map((recipe: { id: number; name: string; description: string; type: string; price: number; pdfLink: string; imageUrl?: string; status: string; accessLink: string }) => 
        recipe.id === editingRecipe 
          ? { ...recipe, ...newRecipe }
          : recipe
      )
      setRecipes(updatedRecipes)
      
      // Salvar no localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('mpf-recipes', JSON.stringify(updatedRecipes))
      }
      
      // Reset form
      setNewRecipe({
        name: '',
        description: '',
        type: 'doces',
        price: 0,
        pdfLink: '',
        imageUrl: '',
        status: 'active',
        isFree: true
      })
      setEditingRecipe(null)
      setShowForm(false)
    }
  }

  const handleDeleteRecipe = (id: number) => {
    if (confirm('Tem certeza que deseja excluir esta receita?')) {
      const updatedRecipes = recipes.filter((recipe: { id: number }) => recipe.id !== id)
      setRecipes(updatedRecipes)
      
      // Salvar no localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('mpf-recipes', JSON.stringify(updatedRecipes))
      }
    }
  }

  const handleCancelEdit = () => {
    setNewRecipe({
      name: '',
      description: '',
      type: 'doces',
      price: 0,
      pdfLink: '',
      imageUrl: '',
      status: 'active',
      isFree: false
    })
    setEditingRecipe(null)
    setShowForm(false)
  }

  // Handlers específicos para evitar problemas de travamento
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewRecipe(prev => ({ ...prev, name: e.target.value }))
  }

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewRecipe(prev => ({ ...prev, description: e.target.value }))
  }

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNewRecipe(prev => ({ ...prev, type: e.target.value }))
  }


  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNewRecipe(prev => ({ ...prev, status: e.target.value }))
  }

  const handlePdfLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewRecipe(prev => ({ ...prev, pdfLink: e.target.value }))
  }

  const handleIsFreeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isFree = e.target.checked
    setNewRecipe(prev => ({ 
      ...prev, 
      isFree,
      price: isFree ? 0 : prev.price || 1
    }))
  }

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const price = Number(e.target.value)
    setNewRecipe(prev => ({ 
      ...prev, 
      price,
      isFree: price === 0
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Logo variant="horizontal" size="md" />
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-sm text-gray-600 hover:text-brand-green transition-colors">
                ← Voltar ao App
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">🍽️ Admin Receitas</h1>
          <p className="text-gray-600">Gerencie receitas e gere links únicos de acesso</p>
        </div>

        {/* Add Recipe Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-brand-green text-white px-6 py-3 rounded-lg font-medium hover:bg-brand-greenDark transition-colors"
          >
            {showForm ? 'Cancelar' : '+ Adicionar Nova Receita'}
          </button>
        </div>

        {/* Add Recipe Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {editingRecipe ? 'Editar Receita' : 'Nova Receita'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome da Receita</label>
                <input
                  type="text"
                  value={newRecipe.name}
                  onChange={handleNameChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-brand-green focus:outline-none"
                  placeholder="Ex: Smoothie Bowl de Açaí"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
                <select
                  value={newRecipe.type}
                  onChange={handleTypeChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-brand-green focus:outline-none"
                >
                  {recipeTypes.map(type => (
                    <option key={type.id} value={type.id}>
                      {type.icon} {type.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
                <textarea
                  value={newRecipe.description}
                  onChange={handleDescriptionChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-brand-green focus:outline-none"
                  rows={3}
                  placeholder="Descrição da receita..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preço</label>
                <div className="space-y-3">
                  {/* Checkbox Gratuito */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isFree"
                      checked={newRecipe.isFree}
                      onChange={handleIsFreeChange}
                      className="h-4 w-4 text-brand-green focus:ring-brand-green border-gray-300 rounded"
                    />
                    <label htmlFor="isFree" className="ml-2 text-sm text-gray-700">
                      ✅ Receita Gratuita
                    </label>
                  </div>
                  
                  {/* Campo de Preço (só aparece se não for gratuito) */}
                  {!newRecipe.isFree && (
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Preço (R$)</label>
                      <input
                        type="number"
                        value={newRecipe.price}
                        onChange={handlePriceChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-brand-green focus:outline-none"
                        placeholder="Ex: 15"
                        min="0.01"
                        step="0.01"
                      />
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={newRecipe.status}
                  onChange={handleStatusChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-brand-green focus:outline-none"
                >
                  <option value="active">Ativo</option>
                  <option value="inactive">Inativo</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Link do PDF (Google Drive)</label>
                <input
                  type="url"
                  value={newRecipe.pdfLink}
                  onChange={handlePdfLinkChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-brand-green focus:outline-none"
                  placeholder="https://drive.google.com/file/d/..."
                />
              </div>
          <div className="md:col-span-2">
            <ImageUpload
              onImageUpload={(imageUrl) => setNewRecipe(prev => ({ ...prev, imageUrl }))}
              currentImage={newRecipe.imageUrl}
            />
          </div>

          {/* Extrator de PDF */}
          {newRecipe.pdfLink && (
            <div className="md:col-span-2">
              <PDFImageExtractor
                pdfUrl={newRecipe.pdfLink}
                onImageExtracted={(imageUrl) => setNewRecipe(prev => ({ ...prev, imageUrl }))}
              />
            </div>
          )}
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={handleCancelEdit}
                className="bg-gray-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={editingRecipe ? handleUpdateRecipe : handleAddRecipe}
                className="bg-brand-green text-white px-6 py-3 rounded-lg font-medium hover:bg-brand-greenDark transition-colors"
              >
                {editingRecipe ? 'Atualizar Receita' : 'Salvar Receita'}
              </button>
            </div>
          </div>
        )}

        {/* Recipes List */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">Receitas Cadastradas</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Receita</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preço</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recipes.map((recipe: { id: number; name: string; description: string; price: number; pdfLink: string; imageUrl?: string; status: string; type: string; accessLink: string }) => (
                  <tr key={recipe.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{recipe.name}</div>
                        <div className="text-sm text-gray-500">{recipe.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {recipeTypes.find(t => t.id === recipe.type)?.icon} {recipeTypes.find(t => t.id === recipe.type)?.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${
                        recipe.price === 0 ? 'text-green-600' : 'text-amber-600'
                      }`}>
                        {recipe.price === 0 ? 'GRATUITO' : `R$ ${recipe.price}`}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        recipe.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {recipe.status === 'active' ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditRecipe(recipe)}
                          className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded text-xs hover:bg-yellow-200"
                        >
                          ✏️ Editar
                        </button>
                        <button
                          onClick={() => handleDeleteRecipe(recipe.id)}
                          className="px-3 py-1 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200"
                        >
                          🗑️ Excluir
                        </button>
                        <button
                          onClick={() => toggleRecipeStatus(recipe.id)}
                          className={`px-3 py-1 rounded text-xs ${
                            recipe.status === 'active'
                              ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                        >
                          {recipe.status === 'active' ? '⏸️ Pausar' : '▶️ Ativar'}
                        </button>
                        <button
                          onClick={() => copyAccessLink(recipe.accessLink)}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200"
                        >
                          📋 Link
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-blue-800 mb-3">📋 Instruções</h3>
          <div className="text-blue-700 space-y-2">
            <p>• <strong>PDFs:</strong> Armazene os PDFs no Google Drive e cole o link aqui</p>
            <p>• <strong>Links Únicos:</strong> Cada receita gera automaticamente um link único</p>
            <p>• <strong>Status:</strong> Use &quot;Inativo&quot; para pausar vendas temporariamente</p>
            <p>• <strong>Preços:</strong> R$ 0 = receita gratuita</p>
          </div>
        </div>
      </main>
    </div>
  )
}
