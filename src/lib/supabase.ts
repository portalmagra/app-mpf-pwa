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
  const configured = !!(supabaseUrl && supabaseAnonKey)
  console.log('🔧 Supabase configurado:', configured)
  console.log('🔧 URL:', supabaseUrl)
  console.log('🔧 Anon Key:', supabaseAnonKey ? 'Presente' : 'Ausente')
  console.log('🔧 Service Key:', supabaseServiceKey ? 'Presente' : 'Ausente')
  return configured
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
  category?: string
}

export interface Category {
  id: string
  name: string
  description?: string
  color?: string
  icon?: string
  created_at: string
}

export interface Product {
  id: string
  name: string
  description?: string
  category_id: string
  amazon_url?: string
  current_price?: string
  original_price?: string
  rating?: number
  review_count?: number
  image_url?: string
  benefits?: string[]
  features?: string[]
  product_url?: string
  created_at: string
  slug?: string
  is_mentoria?: boolean
}

export interface Ebook {
  id: number
  title: string
  description: string
  category: 'receitas' | 'dietas'
  price: number
  pdf_link: string
  cover_image_url?: string
  preview_images?: string[]
  author: string
  pages?: number
  language: string
  status: 'active' | 'inactive'
  featured: boolean
  created_at: string
  updated_at: string
}

// Funções para gerenciar receitas
export const recipeService = {
  // Buscar todas as receitas
  async getAllRecipes(): Promise<Recipe[]> {
    console.log('🔄 getAllRecipes chamado')
    
    if (!isSupabaseConfigured()) {
      console.warn('⚠️ Supabase não configurado, usando dados mock')
      return getMockRecipes()
    }

    console.log('📡 Fazendo consulta ao Supabase...')
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('❌ Erro ao buscar receitas:', error)
      return getMockRecipes()
    }
    
    console.log('✅ Receitas carregadas:', data?.length || 0)
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
      .limit(1000) // Limite para evitar cache
    
    if (error) {
      console.error('Erro ao buscar receitas ativas:', error)
      return getMockRecipes().filter(recipe => recipe.status === 'active')
    }
    
    console.log('📊 Receitas ativas encontradas:', data?.length || 0)
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
    console.log('🔄 Atualizando receita no Supabase:', id, updates)
    
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
      console.error('❌ Erro ao atualizar receita:', error)
      return null
    }
    
    console.log('✅ Receita atualizada com sucesso:', data)
    return data
  },

  // Deletar receita
  async deleteRecipe(id: number): Promise<boolean> {
    console.log('🗑️ Deletando receita do Supabase:', id)
    
    if (!isSupabaseConfigured()) {
      console.warn('⚠️ Supabase não configurado, simulando deleção')
      return true
    }

    const { error } = await supabase
      .from('recipes')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('❌ Erro ao deletar receita:', error)
      return false
    }
    
    console.log('✅ Receita deletada com sucesso:', id)
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
      updated_at: '2024-01-15T10:00:00Z',
      category: 'shots'
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
      updated_at: '2024-01-16T10:00:00Z',
      category: 'sucos'
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
      updated_at: '2024-01-17T10:00:00Z',
      category: 'saladas'
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
      updated_at: '2024-01-18T10:00:00Z',
      category: 'sopas'
    },
    {
      id: 5,
      name: 'Brownie Fit de Chocolate',
      description: 'Brownie saudável sem açúcar refinado, rico em proteínas',
      type: 'doces',
      price: 0,
      pdf_link: 'https://drive.google.com/file/d/brownie-fit/view',
      image_url: '',
      status: 'active',
      access_link: 'https://app.meuportalfit.com/receita/5',
      created_at: '2024-01-19T10:00:00Z',
      updated_at: '2024-01-19T10:00:00Z',
      category: 'doces'
    }
  ]
}

// Funções para gerenciar categorias
export const categoryService = {
  // Buscar todas as categorias
  async getAllCategories(): Promise<Category[]> {
    console.log('🔄 getAllCategories chamado')
    
    if (!isSupabaseConfigured()) {
      console.warn('⚠️ Supabase não configurado, usando dados mock')
      return getMockCategories()
    }

    console.log('📡 Fazendo consulta ao Supabase...')
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true })
    
    if (error) {
      console.error('❌ Erro ao buscar categorias:', error)
      return getMockCategories()
    }
    
    console.log('✅ Categorias carregadas:', data?.length || 0)
    return data || []
  },

  // Buscar categoria por ID
  async getCategoryById(id: string): Promise<Category | null> {
    if (!isSupabaseConfigured()) {
      console.warn('⚠️ Supabase não configurado, usando dados mock')
      return getMockCategories().find(cat => cat.id === id) || null
    }

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('❌ Erro ao buscar categoria:', error)
      return null
    }
    
    return data
  },

  // Criar nova categoria
  async createCategory(category: Omit<Category, 'created_at'>): Promise<Category | null> {
    if (!isSupabaseConfigured()) {
      console.warn('⚠️ Supabase não configurado, simulando criação')
      return {
        ...category,
        created_at: new Date().toISOString()
      }
    }

    const { data, error } = await supabase
      .from('categories')
      .insert([category])
      .select()
      .single()
    
    if (error) {
      console.error('❌ Erro ao criar categoria:', error)
      return null
    }
    
    return data
  },

  // Atualizar categoria
  async updateCategory(id: string, updates: Partial<Category>): Promise<Category | null> {
    console.log('🔄 Atualizando categoria no Supabase:', id, updates)
    
    if (!isSupabaseConfigured()) {
      console.warn('⚠️ Supabase não configurado, simulando atualização')
      const mockCategories = getMockCategories()
      const category = mockCategories.find(c => c.id === id)
      if (category) {
        return { ...category, ...updates }
      }
      return null
    }

    const { data, error } = await supabase
      .from('categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('❌ Erro ao atualizar categoria:', error)
      return null
    }
    
    console.log('✅ Categoria atualizada com sucesso:', data)
    return data
  },

  // Deletar categoria
  async deleteCategory(id: string): Promise<boolean> {
    console.log('🗑️ Deletando categoria do Supabase:', id)
    
    if (!isSupabaseConfigured()) {
      console.warn('⚠️ Supabase não configurado, simulando deleção')
      return true
    }

    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('❌ Erro ao deletar categoria:', error)
      return false
    }
    
    console.log('✅ Categoria deletada com sucesso:', id)
    return true
  }
}

// Funções para gerenciar produtos
export const productService = {
  // Buscar todos os produtos
  async getAllProducts(): Promise<Product[]> {
    console.log('🔄 getAllProducts chamado')
    
    if (!isSupabaseConfigured()) {
      console.warn('⚠️ Supabase não configurado, usando dados mock')
      return getMockProducts()
    }

    console.log('📡 Fazendo consulta ao Supabase...')
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('❌ Erro ao buscar produtos:', error)
      return getMockProducts()
    }
    
    console.log('✅ Produtos carregados:', data?.length || 0)
    return data || []
  },

  // Buscar produtos por categoria
  async getProductsByCategory(categoryId: string): Promise<Product[]> {
    if (!isSupabaseConfigured()) {
      console.warn('⚠️ Supabase não configurado, usando dados mock')
      return getMockProducts().filter(product => product.category_id === categoryId)
    }

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category_id', categoryId)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('❌ Erro ao buscar produtos por categoria:', error)
      return []
    }
    
    return data || []
  },

  // Buscar produto por ID
  async getProductById(id: string): Promise<Product | null> {
    if (!isSupabaseConfigured()) {
      console.warn('⚠️ Supabase não configurado, usando dados mock')
      return getMockProducts().find(product => product.id === id) || null
    }

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('❌ Erro ao buscar produto:', error)
      return null
    }
    
    return data
  },

  // Criar novo produto
  async createProduct(product: Omit<Product, 'created_at'>): Promise<Product | null> {
    if (!isSupabaseConfigured()) {
      console.warn('⚠️ Supabase não configurado, simulando criação')
      return {
        ...product,
        created_at: new Date().toISOString()
      }
    }

    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()
      .single()
    
    if (error) {
      console.error('❌ Erro ao criar produto:', error)
      return null
    }
    
    return data
  },

  // Atualizar produto
  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    console.log('🔄 Atualizando produto no Supabase:', id, updates)
    
    if (!isSupabaseConfigured()) {
      console.warn('⚠️ Supabase não configurado, simulando atualização')
      const mockProducts = getMockProducts()
      const product = mockProducts.find(p => p.id === id)
      if (product) {
        return { ...product, ...updates }
      }
      return null
    }

    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('❌ Erro ao atualizar produto:', error)
      return null
    }
    
    console.log('✅ Produto atualizado com sucesso:', data)
    return data
  },

  // Deletar produto
  async deleteProduct(id: string): Promise<boolean> {
    console.log('🗑️ Deletando produto do Supabase:', id)
    
    if (!isSupabaseConfigured()) {
      console.warn('⚠️ Supabase não configurado, simulando deleção')
      return true
    }

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('❌ Erro ao deletar produto:', error)
      return false
    }
    
    console.log('✅ Produto deletado com sucesso:', id)
    return true
  }
}

// Função para dados mock de categorias
function getMockCategories(): Category[] {
  return [
    {
      id: 'emagrecimento',
      name: 'Emagrecimento',
      description: 'Produtos para perda de peso saudável',
      color: '#96CEB4',
      icon: '🔥',
      created_at: '2024-01-15T10:00:00Z'
    },
    {
      id: 'energia',
      name: 'Energia',
      description: 'Suplementos para aumentar energia e disposição',
      color: '#45B7D1',
      icon: '⚡',
      created_at: '2024-01-15T10:00:00Z'
    },
    {
      id: 'imunidade',
      name: 'Imunidade',
      description: 'Fortalecimento do sistema imunológico',
      color: '#98D8C8',
      icon: '🛡️',
      created_at: '2024-01-15T10:00:00Z'
    }
  ]
}

// Função para dados mock de produtos
function getMockProducts(): Product[] {
  return [
    {
      id: '1',
      name: 'Whey Protein',
      description: 'Proteína em pó para suporte muscular',
      category_id: 'energia',
      amazon_url: 'https://amazon.com/whey-protein',
      current_price: '$29.99',
      image_url: 'https://example.com/whey.jpg',
      created_at: '2024-01-15T10:00:00Z',
      is_mentoria: false
    },
    {
      id: '2',
      name: 'Vitamina D3',
      description: 'Suplemento de vitamina D para imunidade',
      category_id: 'imunidade',
      amazon_url: 'https://amazon.com/vitamin-d3',
      current_price: '$19.99',
      image_url: 'https://example.com/vitamin-d3.jpg',
      created_at: '2024-01-16T10:00:00Z',
      is_mentoria: false
    }
  ]
}

// Funções para gerenciar eBooks
export const ebookService = {
  // Buscar todos os eBooks
  async getAllEbooks(): Promise<Ebook[]> {
    console.log('🔄 getAllEbooks chamado')
    
    if (!isSupabaseConfigured()) {
      console.warn('⚠️ Supabase não configurado, usando dados mock')
      return getMockEbooks()
    }

    console.log('📡 Fazendo consulta ao Supabase...')
    const { data, error } = await supabase
      .from('ebooks')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('❌ Erro ao buscar eBooks:', error)
      return getMockEbooks()
    }
    
    console.log('✅ eBooks carregados:', data?.length || 0)
    return data || []
  },

  // Buscar eBooks ativos
  async getActiveEbooks(): Promise<Ebook[]> {
    if (!isSupabaseConfigured()) {
      console.warn('⚠️ Supabase não configurado, usando dados mock')
      return getMockEbooks().filter(ebook => ebook.status === 'active')
    }

    const { data, error } = await supabase
      .from('ebooks')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1000)
    
    if (error) {
      console.error('Erro ao buscar eBooks ativos:', error)
      return getMockEbooks().filter(ebook => ebook.status === 'active')
    }
    
    console.log('📊 eBooks ativos encontrados:', data?.length || 0)
    return data || []
  },

  // Buscar eBooks por categoria
  async getEbooksByCategory(category: 'receitas' | 'dietas'): Promise<Ebook[]> {
    if (!isSupabaseConfigured()) {
      console.warn('⚠️ Supabase não configurado, usando dados mock')
      return getMockEbooks().filter(ebook => ebook.category === category && ebook.status === 'active')
    }

    const { data, error } = await supabase
      .from('ebooks')
      .select('*')
      .eq('category', category)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('❌ Erro ao buscar eBooks por categoria:', error)
      return []
    }
    
    return data || []
  },

  // Buscar eBooks em destaque
  async getFeaturedEbooks(): Promise<Ebook[]> {
    if (!isSupabaseConfigured()) {
      console.warn('⚠️ Supabase não configurado, usando dados mock')
      return getMockEbooks().filter(ebook => ebook.featured && ebook.status === 'active')
    }

    const { data, error } = await supabase
      .from('ebooks')
      .select('*')
      .eq('featured', true)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('❌ Erro ao buscar eBooks em destaque:', error)
      return []
    }
    
    return data || []
  },

  // Buscar eBook por ID
  async getEbookById(id: number): Promise<Ebook | null> {
    if (!isSupabaseConfigured()) {
      console.warn('⚠️ Supabase não configurado, usando dados mock')
      return getMockEbooks().find(ebook => ebook.id === id) || null
    }

    const { data, error } = await supabase
      .from('ebooks')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('❌ Erro ao buscar eBook:', error)
      return null
    }
    
    return data
  },

  // Criar novo eBook
  async createEbook(ebook: Omit<Ebook, 'id' | 'created_at' | 'updated_at'>): Promise<Ebook | null> {
    if (!isSupabaseConfigured()) {
      console.warn('⚠️ Supabase não configurado, simulando criação')
      return {
        id: Date.now(),
        ...ebook,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    }

    const { data, error } = await supabase
      .from('ebooks')
      .insert([ebook])
      .select()
      .single()
    
    if (error) {
      console.error('❌ Erro ao criar eBook:', error)
      return null
    }
    
    return data
  },

  // Atualizar eBook
  async updateEbook(id: number, updates: Partial<Ebook>): Promise<Ebook | null> {
    console.log('🔄 Atualizando eBook no Supabase:', id, updates)
    
    if (!isSupabaseConfigured()) {
      console.warn('⚠️ Supabase não configurado, simulando atualização')
      const mockEbooks = getMockEbooks()
      const ebook = mockEbooks.find(e => e.id === id)
      if (ebook) {
        return { ...ebook, ...updates, updated_at: new Date().toISOString() }
      }
      return null
    }

    const { data, error } = await supabase
      .from('ebooks')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('❌ Erro ao atualizar eBook:', error)
      return null
    }
    
    console.log('✅ eBook atualizado com sucesso:', data)
    return data
  },

  // Deletar eBook
  async deleteEbook(id: number): Promise<boolean> {
    console.log('🗑️ Deletando eBook do Supabase:', id)
    
    if (!isSupabaseConfigured()) {
      console.warn('⚠️ Supabase não configurado, simulando deleção')
      return true
    }

    const { error } = await supabase
      .from('ebooks')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('❌ Erro ao deletar eBook:', error)
      return false
    }
    
    console.log('✅ eBook deletado com sucesso:', id)
    return true
  },

  // Alternar status do eBook
  async toggleEbookStatus(id: number): Promise<Ebook | null> {
    if (!isSupabaseConfigured()) {
      console.warn('⚠️ Supabase não configurado, simulando toggle')
      const mockEbooks = getMockEbooks()
      const ebook = mockEbooks.find(e => e.id === id)
      if (ebook) {
        const newStatus = ebook.status === 'active' ? 'inactive' : 'active'
        return { ...ebook, status: newStatus, updated_at: new Date().toISOString() }
      }
      return null
    }

    // Primeiro buscar o eBook atual
    const { data: currentEbook, error: fetchError } = await supabase
      .from('ebooks')
      .select('status')
      .eq('id', id)
      .single()
    
    if (fetchError) {
      console.error('Erro ao buscar eBook:', fetchError)
      return null
    }
    
    const newStatus = currentEbook.status === 'active' ? 'inactive' : 'active'
    
    return this.updateEbook(id, { status: newStatus })
  }
}

// Função para dados mock de eBooks
function getMockEbooks(): Ebook[] {
  return [
    {
      id: 1,
      title: '50 Receitas Low Carb',
      description: 'Coleção completa de receitas low carb para emagrecimento saudável',
      category: 'receitas',
      price: 19.90,
      pdf_link: 'https://drive.google.com/file/d/ebook-receitas-low-carb/view',
      cover_image_url: '/images/ebooks/low-carb-cover.jpg',
      author: 'Meu Portal Fit',
      pages: 45,
      language: 'pt-BR',
      status: 'active',
      featured: true,
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-15T10:00:00Z'
    },
    {
      id: 2,
      title: 'Guia Completo de Dietas',
      description: 'Manual completo com diferentes tipos de dietas e seus benefícios',
      category: 'dietas',
      price: 29.90,
      pdf_link: 'https://drive.google.com/file/d/ebook-guia-dietas/view',
      cover_image_url: '/images/ebooks/dietas-guide-cover.jpg',
      author: 'Meu Portal Fit',
      pages: 60,
      language: 'pt-BR',
      status: 'active',
      featured: true,
      created_at: '2024-01-16T10:00:00Z',
      updated_at: '2024-01-16T10:00:00Z'
    },
    {
      id: 3,
      title: 'Receitas Detox Gratuitas',
      description: 'Receitas detox para limpeza do organismo - versão gratuita',
      category: 'receitas',
      price: 0,
      pdf_link: 'https://drive.google.com/file/d/ebook-receitas-detox-free/view',
      cover_image_url: '/images/ebooks/detox-free-cover.jpg',
      author: 'Meu Portal Fit',
      pages: 20,
      language: 'pt-BR',
      status: 'active',
      featured: false,
      created_at: '2024-01-17T10:00:00Z',
      updated_at: '2024-01-17T10:00:00Z'
    },
    {
      id: 4,
      title: 'Dieta Mediterrânea',
      description: 'Guia completo da dieta mediterrânea com receitas e benefícios',
      category: 'dietas',
      price: 24.90,
      pdf_link: 'https://drive.google.com/file/d/ebook-dieta-mediterranea/view',
      cover_image_url: '/images/ebooks/mediterranea-cover.jpg',
      author: 'Meu Portal Fit',
      pages: 35,
      language: 'pt-BR',
      status: 'active',
      featured: false,
      created_at: '2024-01-18T10:00:00Z',
      updated_at: '2024-01-18T10:00:00Z'
    },
    {
      id: 5,
      title: 'Smoothies Funcionais',
      description: 'Receitas de smoothies para diferentes objetivos de saúde',
      category: 'receitas',
      price: 15.90,
      pdf_link: 'https://drive.google.com/file/d/ebook-smoothies-funcionais/view',
      cover_image_url: '/images/ebooks/smoothies-cover.jpg',
      author: 'Meu Portal Fit',
      pages: 30,
      language: 'pt-BR',
      status: 'active',
      featured: false,
      created_at: '2024-01-19T10:00:00Z',
      updated_at: '2024-01-19T10:00:00Z'
    }
  ]
}
