'use client'

import { useState } from 'react'
import Logo from '@/components/Logo'

export default function AdminReceitas() {
  const [recipes, setRecipes] = useState([
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
  ])

  const [newRecipe, setNewRecipe] = useState({
    name: '',
    description: '',
    type: 'doces',
    price: 0,
    pdfLink: '',
    status: 'active'
  })

  const [showForm, setShowForm] = useState(false)

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
    if (newRecipe.name && newRecipe.description && newRecipe.pdfLink) {
      const id = Math.max(...recipes.map(r => r.id)) + 1
      const accessLink = `https://app.meuportalfit.com/receita/${id}`
      
      const recipe = {
        id,
        ...newRecipe,
        accessLink
      }
      
      setRecipes([...recipes, recipe])
      setNewRecipe({
        name: '',
        description: '',
        type: 'doces',
        price: 0,
        pdfLink: '',
        status: 'active'
      })
      setShowForm(false)
    }
  }

  const toggleRecipeStatus = (id: number) => {
    setRecipes(recipes.map(recipe => 
      recipe.id === id 
        ? { ...recipe, status: recipe.status === 'active' ? 'inactive' : 'active' }
        : recipe
    ))
  }

  const copyAccessLink = (link: string) => {
    navigator.clipboard.writeText(link)
    alert('Link copiado para a área de transferência!')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Logo variant="horizontal" size="md" />
            <div className="flex items-center space-x-4">
              <a href="/" className="text-sm text-gray-600 hover:text-brand-green transition-colors">
                ← Voltar ao App
              </a>
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
            <h2 className="text-xl font-bold text-gray-800 mb-4">Nova Receita</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome da Receita</label>
                <input
                  type="text"
                  value={newRecipe.name}
                  onChange={(e) => setNewRecipe({...newRecipe, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-brand-green focus:outline-none"
                  placeholder="Ex: Smoothie Bowl de Açaí"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
                <select
                  value={newRecipe.type}
                  onChange={(e) => setNewRecipe({...newRecipe, type: e.target.value})}
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
                  onChange={(e) => setNewRecipe({...newRecipe, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-brand-green focus:outline-none"
                  rows={3}
                  placeholder="Descrição da receita..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preço (R$)</label>
                <input
                  type="number"
                  value={newRecipe.price}
                  onChange={(e) => setNewRecipe({...newRecipe, price: Number(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-brand-green focus:outline-none"
                  placeholder="0 para gratuito"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={newRecipe.status}
                  onChange={(e) => setNewRecipe({...newRecipe, status: e.target.value})}
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
                  onChange={(e) => setNewRecipe({...newRecipe, pdfLink: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-brand-green focus:outline-none"
                  placeholder="https://drive.google.com/file/d/..."
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleAddRecipe}
                className="bg-brand-green text-white px-6 py-3 rounded-lg font-medium hover:bg-brand-greenDark transition-colors"
              >
                Salvar Receita
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
                {recipes.map(recipe => (
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
                          onClick={() => toggleRecipeStatus(recipe.id)}
                          className={`px-3 py-1 rounded text-xs ${
                            recipe.status === 'active'
                              ? 'bg-red-100 text-red-700 hover:bg-red-200'
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                        >
                          {recipe.status === 'active' ? 'Desativar' : 'Ativar'}
                        </button>
                        <button
                          onClick={() => copyAccessLink(recipe.accessLink)}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200"
                        >
                          Copiar Link
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
            <p>• <strong>Status:</strong> Use "Inativo" para pausar vendas temporariamente</p>
            <p>• <strong>Preços:</strong> R$ 0 = receita gratuita</p>
          </div>
        </div>
      </main>
    </div>
  )
}
