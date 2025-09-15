import { createClient } from '@supabase/supabase-js'

// Verificar se as variáveis de ambiente estão definidas
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Fallback temporário se as variáveis não estiverem definidas
const fallbackUrl = 'https://placeholder.supabase.co'
const fallbackKey = 'placeholder-key'

export const supabase = createClient(
  supabaseUrl || fallbackUrl, 
  supabaseAnonKey || fallbackKey
)

// Cliente com service role para operações administrativas
export const supabaseAdmin = createClient(
  supabaseUrl || fallbackUrl, 
  supabaseServiceKey || fallbackKey
)

// Verificar se as credenciais estão válidas
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey && supabaseServiceKey)
}

// Tipos para o banco de dados
export interface UserEvaluation {
  id: string
  user_name: string
  user_age: string
  answers: Record<string, string>
  comments?: string
  language: string
  created_at: string
  updated_at: string
}

export interface AmazonProduct {
  name: string
  price: string
  description: string
  url: string
}

export interface AnalysisResult {
  id: string
  evaluation_id: string
  personalized_recommendations: string[]
  priority_areas: string[]
  risk_factors: string[]
  new_habits: string[]
  next_steps: string[]
  amazon_products: AmazonProduct[]
  encouragement: string
  promise: string
  created_at: string
}

export interface Recipe {
  id: number
  name: string
  description: string
  type: string
  price: number
  pdf_link: string
  image_url?: string
  status: 'active' | 'inactive'
  access_link: string
  created_at: string
  updated_at: string
}

// Funções para gerenciar receitas
export const recipeService = {
  // Buscar todas as receitas
  async getAllRecipes(): Promise<Recipe[]> {
    if (!isSupabaseConfigured()) {
      console.warn('⚠️ Supabase não configurado, usando dados mock')
      return getMockRecipes()
    }

    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Erro ao buscar receitas:', error)
      return getMockRecipes()
    }
    
    return data || []
  },

  // Buscar receitas ativas
  async getActiveRecipes(): Promise<Recipe[]> {
    if (!isSupabaseConfigured()) {
      console.warn('⚠️ Supabase não configurado, usando dados mock')
      return getMockRecipes().filter(recipe => recipe.status === 'active')
    }

    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Erro ao buscar receitas ativas:', error)
      return getMockRecipes().filter(recipe => recipe.status === 'active')
    }
    
    return data || []
  },

  // Criar nova receita
  async createRecipe(recipe: Omit<Recipe, 'id' | 'created_at' | 'updated_at'>): Promise<Recipe | null> {
    if (!isSupabaseConfigured()) {
      console.warn('⚠️ Supabase não configurado, simulando criação')
      return {
        id: Date.now(),
        ...recipe,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    }

    const { data, error } = await supabase
      .from('recipes')
      .insert([recipe])
      .select()
      .single()
    
    if (error) {
      console.error('Erro ao criar receita:', error)
      return null
    }
    
    return data
  },

  // Atualizar receita
  async updateRecipe(id: number, updates: Partial<Recipe>): Promise<Recipe | null> {
    if (!isSupabaseConfigured()) {
      console.warn('⚠️ Supabase não configurado, simulando atualização')
      const mockRecipes = getMockRecipes()
      const recipe = mockRecipes.find(r => r.id === id)
      if (recipe) {
        return { ...recipe, ...updates, updated_at: new Date().toISOString() }
      }
      return null
    }

    const { data, error } = await supabase
      .from('recipes')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Erro ao atualizar receita:', error)
      return null
    }
    
    return data
  },

  // Deletar receita
  async deleteRecipe(id: number): Promise<boolean> {
    if (!isSupabaseConfigured()) {
      console.warn('⚠️ Supabase não configurado, simulando deleção')
      return true
    }

    const { error } = await supabase
      .from('recipes')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Erro ao deletar receita:', error)
      return false
    }
    
    return true
  },

  // Alternar status da receita
  async toggleRecipeStatus(id: number): Promise<Recipe | null> {
    if (!isSupabaseConfigured()) {
      console.warn('⚠️ Supabase não configurado, simulando toggle')
      const mockRecipes = getMockRecipes()
      const recipe = mockRecipes.find(r => r.id === id)
      if (recipe) {
        const newStatus = recipe.status === 'active' ? 'inactive' : 'active'
        return { ...recipe, status: newStatus, updated_at: new Date().toISOString() }
      }
      return null
    }

    // Primeiro buscar a receita atual
    const { data: currentRecipe, error: fetchError } = await supabase
      .from('recipes')
      .select('status')
      .eq('id', id)
      .single()
    
    if (fetchError) {
      console.error('Erro ao buscar receita:', fetchError)
      return null
    }
    
    const newStatus = currentRecipe.status === 'active' ? 'inactive' : 'active'
    
    return this.updateRecipe(id, { status: newStatus })
  }
}

// Função para dados mock quando Supabase não estiver configurado
function getMockRecipes(): Recipe[] {
  return [
    {
      id: 1,
      name: 'Shot de Curcuma',
      description: 'Shot anti-inflamatório com curcuma, limão e pimenta-do-reino',
      type: 'shots',
      price: 0,
      pdf_link: 'https://drive.google.com/file/d/curcuma-shot/view',
      image_url: '',
      status: 'active',
      access_link: 'https://app.meuportalfit.com/receita/1',
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-15T10:00:00Z'
    },
    {
      id: 2,
      name: 'Smoothie Verde Detox',
      description: 'Bebida refrescante rica em clorofila e antioxidantes para desintoxicar o organismo',
      type: 'sucos',
      price: 0,
      pdf_link: 'https://drive.google.com/file/d/smoothie-verde/view',
      image_url: '',
      status: 'active',
      access_link: 'https://app.meuportalfit.com/receita/2',
      created_at: '2024-01-16T10:00:00Z',
      updated_at: '2024-01-16T10:00:00Z'
    },
    {
      id: 3,
      name: 'Bowl Energético com Quinoa',
      description: 'Refeição completa e nutritiva perfeita para dar energia durante o dia',
      type: 'saladas',
      price: 1.99,
      pdf_link: 'https://drive.google.com/file/d/bowl-quinoa/view',
      image_url: '',
      status: 'active',
      access_link: 'https://app.meuportalfit.com/receita/3',
      created_at: '2024-01-17T10:00:00Z',
      updated_at: '2024-01-17T10:00:00Z'
    },
    {
      id: 4,
      name: 'Sopa Anti-inflamatória',
      description: 'Sopa reconfortante com ingredientes que combatem inflamações',
      type: 'sopas',
      price: 2.99,
      pdf_link: 'https://drive.google.com/file/d/sopa-anti/view',
      image_url: '',
      status: 'active',
      access_link: 'https://app.meuportalfit.com/receita/4',
      created_at: '2024-01-18T10:00:00Z',
      updated_at: '2024-01-18T10:00:00Z'
    }
  ]
}
