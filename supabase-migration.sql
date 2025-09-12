-- =============================================================================
-- MEUPORTALFIT PWA - MIGRAÇÃO DO BANCO DE DADOS
-- =============================================================================

-- Tabela para armazenar avaliações dos usuários
CREATE TABLE IF NOT EXISTS user_evaluations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_name VARCHAR(255) NOT NULL,
  user_age VARCHAR(50),
  answers JSONB NOT NULL,
  comments TEXT,
  language VARCHAR(10) DEFAULT 'pt',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para armazenar resultados das análises
CREATE TABLE IF NOT EXISTS analysis_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  evaluation_id UUID REFERENCES user_evaluations(id) ON DELETE CASCADE,
  personalized_recommendations TEXT[],
  priority_areas TEXT[],
  risk_factors TEXT[],
  new_habits TEXT[],
  next_steps TEXT[],
  amazon_products JSONB,
  encouragement TEXT,
  promise TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para produtos Amazon (cache)
CREATE TABLE IF NOT EXISTS amazon_products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  asin VARCHAR(20) UNIQUE NOT NULL,
  title TEXT NOT NULL,
  price VARCHAR(50),
  description TEXT,
  image_url TEXT,
  product_url TEXT,
  category VARCHAR(100),
  keywords TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_user_evaluations_user_name ON user_evaluations(user_name);
CREATE INDEX IF NOT EXISTS idx_user_evaluations_created_at ON user_evaluations(created_at);
CREATE INDEX IF NOT EXISTS idx_analysis_results_evaluation_id ON analysis_results(evaluation_id);
CREATE INDEX IF NOT EXISTS idx_amazon_products_asin ON amazon_products(asin);
CREATE INDEX IF NOT EXISTS idx_amazon_products_category ON amazon_products(category);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
CREATE TRIGGER update_user_evaluations_updated_at 
  BEFORE UPDATE ON user_evaluations 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_amazon_products_updated_at 
  BEFORE UPDATE ON amazon_products 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Políticas de RLS (Row Level Security)
ALTER TABLE user_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE amazon_products ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserção de avaliações (público)
CREATE POLICY "Allow public insert on user_evaluations" 
  ON user_evaluations FOR INSERT 
  WITH CHECK (true);

-- Política para permitir inserção de resultados (público)
CREATE POLICY "Allow public insert on analysis_results" 
  ON analysis_results FOR INSERT 
  WITH CHECK (true);

-- Política para permitir leitura de produtos Amazon (público)
CREATE POLICY "Allow public select on amazon_products" 
  ON amazon_products FOR SELECT 
  USING (true);

-- Política para permitir inserção de produtos Amazon (público)
CREATE POLICY "Allow public insert on amazon_products" 
  ON amazon_products FOR INSERT 
  WITH CHECK (true);

-- Comentários nas tabelas
COMMENT ON TABLE user_evaluations IS 'Armazena as avaliações dos usuários do PWA';
COMMENT ON TABLE analysis_results IS 'Armazena os resultados das análises de IA';
COMMENT ON TABLE amazon_products IS 'Cache de produtos Amazon para recomendações';

COMMENT ON COLUMN user_evaluations.answers IS 'Respostas da avaliação em formato JSON';
COMMENT ON COLUMN analysis_results.amazon_products IS 'Produtos Amazon recomendados em formato JSON';
COMMENT ON COLUMN amazon_products.keywords IS 'Palavras-chave para busca de produtos';
