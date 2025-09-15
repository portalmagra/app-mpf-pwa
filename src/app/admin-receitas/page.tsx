'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import ImageUpload from '@/components/ImageUpload'
import PDFImageExtractor from '@/components/PDFImageExtractor'
import Logo from '@/components/Logo'
import { recipeService, Recipe } from '@/lib/supabase'

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

  // Estado das receitas
  const [recipes, setRecipes] = useState<Recipe[]>([])

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
  const [operationStatus, setOperationStatus] = useState<string>('')

  // Carregar receitas do Supabase
  useEffect(() => {
    const loadRecipes = async () => {
      try {
        console.log('🔄 Carregando receitas do Supabase (Admin)...')
        const supabaseRecipes = await recipeService.getAllRecipes()
        console.log('📦 Receitas carregadas do Supabase (Admin):', supabaseRecipes)
        console.log('📊 Total de receitas encontradas:', supabaseRecipes.length)
        
        // Log detalhado de cada receita
        supabaseRecipes.forEach((recipe, index) => {
          console.log(`📝 Receita ${index + 1}:`, {
            id: recipe.id,
            name: recipe.name,
            image_url: recipe.image_url,
            status: recipe.status
          })
        })
        
        setRecipes(supabaseRecipes)
      } catch (error) {
        console.error('❌ Erro ao carregar receitas do Supabase (Admin):', error)
        console.log('🔄 Usando dados fallback...')
        
        // Fallback para dados padrão - converter para formato Supabase
        const fallbackRecipes: Recipe[] = defaultRecipes.map(recipe => ({
          id: recipe.id,
          name: recipe.name,
          description: recipe.description,
          type: recipe.type,
          price: recipe.price,
          pdf_link: recipe.pdfLink,
          image_url: '',
          status: recipe.status as 'active' | 'inactive',
          access_link: recipe.accessLink,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }))
        setRecipes(fallbackRecipes)
      }
    }

    loadRecipes()
  }, [])

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

  const handleAddRecipe = async () => {
    console.log('Tentando salvar receita:', newRecipe)
    
    if (newRecipe.name && newRecipe.pdfLink) {
      const accessLink = `https://app.meuportalfit.com/receita/${Date.now()}`
      
      const recipeData = {
        name: newRecipe.name,
        description: newRecipe.description,
        type: newRecipe.type,
        price: newRecipe.price,
        pdf_link: newRecipe.pdfLink,
        image_url: newRecipe.imageUrl,
        status: newRecipe.status as 'active' | 'inactive',
        access_link: accessLink
      }
      
      console.log('Dados da receita para Supabase:', recipeData)
      
      try {
        const savedRecipe = await recipeService.createRecipe(recipeData)
        
        if (savedRecipe) {
          console.log('✅ Receita salva no Supabase:', savedRecipe)
          
          // Atualizar lista local
          setRecipes(prev => [savedRecipe, ...prev])
          
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
          alert('Erro ao salvar receita. Tente novamente.')
        }
      } catch (error) {
        console.error('❌ Erro ao salvar receita:', error)
        alert('Erro ao salvar receita. Tente novamente.')
      }
    } else {
      alert('Por favor, preencha todos os campos obrigatórios (Nome e Link do PDF)')
    }
  }

  const toggleRecipeStatus = async (id: number) => {
    try {
      const updatedRecipe = await recipeService.toggleRecipeStatus(id)
      
      if (updatedRecipe) {
        console.log('✅ Status da receita atualizado:', updatedRecipe)
        
        // Atualizar lista local
        setRecipes(prev => 
          prev.map(recipe => 
            recipe.id === id ? updatedRecipe : recipe
          )
        )
      } else {
        alert('Erro ao atualizar status da receita.')
      }
    } catch (error) {
      console.error('❌ Erro ao atualizar status da receita:', error)
      alert('Erro ao atualizar status da receita.')
    }
  }

  const copyAccessLink = (link: string) => {
    navigator.clipboard.writeText(link)
    alert('Link copiado para a área de transferência!')
  }

  const handleEditRecipe = (recipe: Recipe) => {
    setNewRecipe({
      name: recipe.name,
      description: recipe.description,
      type: recipe.type,
      price: recipe.price,
      pdfLink: recipe.pdf_link,
      imageUrl: recipe.image_url || '',
      status: recipe.status,
      isFree: recipe.price === 0
    })
    setEditingRecipe(recipe.id)
    setShowForm(true)
  }

  const handleUpdateRecipe = async () => {
    if (editingRecipe && newRecipe.name && newRecipe.pdfLink) {
      const recipeData = {
        name: newRecipe.name,
        description: newRecipe.description,
        type: newRecipe.type,
        price: newRecipe.price,
        pdf_link: newRecipe.pdfLink,
        image_url: newRecipe.imageUrl,
        status: newRecipe.status as 'active' | 'inactive'
      }
      
      console.log('Atualizando receita:', editingRecipe, recipeData)
      
      try {
        setOperationStatus('Atualizando receita...')
        console.log('🔄 Iniciando atualização da receita:', editingRecipe)
        console.log('📝 Dados para atualização:', recipeData)
        
        const updatedRecipe = await recipeService.updateRecipe(editingRecipe, recipeData)
        
        if (updatedRecipe) {
          console.log('✅ Receita atualizada no Supabase:', updatedRecipe)
          console.log('🖼️ URL da imagem atualizada:', updatedRecipe.image_url)
          
          // Atualizar lista local
          setRecipes(prev => 
            prev.map(recipe => 
              recipe.id === editingRecipe ? updatedRecipe : recipe
            )
          )
          
          // Forçar reload da página de receitas após 2 segundos
          setTimeout(() => {
            console.log('🔄 Forçando reload da página de receitas...')
            // Enviar evento para recarregar receitas
            window.dispatchEvent(new CustomEvent('refreshRecipes'))
          }, 2000)
          
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
          setOperationStatus('Receita atualizada com sucesso!')
          
          setTimeout(() => setOperationStatus(''), 3000)
        } else {
          alert('Erro ao atualizar receita. Tente novamente.')
        }
      } catch (error) {
        console.error('❌ Erro ao atualizar receita:', error)
        alert('Erro ao atualizar receita. Tente novamente.')
      }
    } else {
      alert('Por favor, preencha todos os campos obrigatórios (Nome e Link do PDF)')
    }
  }

  const handleDeleteRecipe = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir esta receita?')) {
      console.log('🗑️ Deletando receita:', id)
      
      try {
        setOperationStatus('Deletando receita...')
        const success = await recipeService.deleteRecipe(id)
        
        if (success) {
          console.log('✅ Receita deletada do Supabase:', id)
          
          // Atualizar lista local
          setRecipes(prev => prev.filter(recipe => recipe.id !== id))
          
          setOperationStatus('Receita excluída com sucesso!')
          setTimeout(() => setOperationStatus(''), 3000)
        } else {
          alert('Erro ao excluir receita. Tente novamente.')
        }
      } catch (error) {
        console.error('❌ Erro ao deletar receita:', error)
        alert('Erro ao excluir receita. Tente novamente.')
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
          {operationStatus && (
            <div className="mt-4 p-3 bg-blue-100 border border-blue-300 rounded-lg">
              <p className="text-blue-800 font-medium">{operationStatus}</p>
            </div>
          )}
        </div>

        {/* Add Recipe Button */}
        <div className="mb-6 flex gap-3">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-brand-green text-white px-6 py-3 rounded-lg font-medium hover:bg-brand-greenDark transition-colors"
          >
            {showForm ? 'Cancelar' : '+ Adicionar Nova Receita'}
          </button>
          <button
            onClick={() => {
              console.log('🔄 Recarregando receitas...')
              // Limpar cache e recarregar
              if ('caches' in window) {
                caches.keys().then(names => {
                  names.forEach(name => {
                    caches.delete(name)
                  })
                })
              }
              window.location.reload()
            }}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
          >
            🔄 Recarregar Página
          </button>
          <button
            onClick={async () => {
              console.log('🧪 Testando conexão com Supabase...')
              try {
                const recipes = await recipeService.getAllRecipes()
                console.log('📊 Receitas carregadas:', recipes.length)
                alert(`Conexão OK! ${recipes.length} receitas encontradas.`)
              } catch (error) {
                console.error('❌ Erro na conexão:', error)
                alert('Erro na conexão com Supabase!')
              }
            }}
            className="bg-purple-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-600 transition-colors"
          >
            🧪 Testar Conexão
          </button>
          <button
            onClick={async () => {
              console.log('🚫 Desabilitando Service Worker...')
              try {
                if ('serviceWorker' in navigator) {
                  const registrations = await navigator.serviceWorker.getRegistrations()
                  for (const registration of registrations) {
                    await registration.unregister()
                    console.log('✅ Service Worker desregistrado')
                  }
                }
                alert('Service Worker desabilitado! Recarregue a página.')
              } catch (error) {
                console.error('❌ Erro ao desabilitar SW:', error)
                alert('Erro ao desabilitar Service Worker!')
              }
            }}
            className="bg-red-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-600 transition-colors"
          >
            🚫 Desabilitar SW
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
                {recipes.map((recipe: Recipe) => (
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
                          onClick={() => copyAccessLink(recipe.access_link)}
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
