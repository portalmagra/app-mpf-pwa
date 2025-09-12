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

export interface AnalysisResult {
  id: string
  evaluation_id: string
  personalized_recommendations: string[]
  priority_areas: string[]
  risk_factors: string[]
  new_habits: string[]
  next_steps: string[]
  amazon_products: any[]
  encouragement: string
  promise: string
  created_at: string
}
