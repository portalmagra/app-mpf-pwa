import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Cliente com service role para operações administrativas
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

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
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Erro ao buscar receitas:', error)
      return []
    }
    
    return data || []
  },

  // Buscar receitas ativas
  async getActiveRecipes(): Promise<Recipe[]> {
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Erro ao buscar receitas ativas:', error)
      return []
    }
    
    return data || []
  },

  // Criar nova receita
  async createRecipe(recipe: Omit<Recipe, 'id' | 'created_at' | 'updated_at'>): Promise<Recipe | null> {
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
