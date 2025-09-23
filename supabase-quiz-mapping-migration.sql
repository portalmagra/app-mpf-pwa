-- =============================================================================
-- MEUPORTALFIT PWA - MIGRAÇÃO PARA MAPEAMENTO DE QUIZ
-- =============================================================================

-- Adicionar campo quiz_mapping na tabela categories
ALTER TABLE categories 
ADD COLUMN IF NOT EXISTS quiz_mapping JSONB DEFAULT '[]'::jsonb;

-- Adicionar campo is_curated na tabela products para identificar produtos curados
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS is_curated BOOLEAN DEFAULT false;

-- Adicionar campo quiz_keywords na tabela products para busca por palavras-chave do quiz
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS quiz_keywords TEXT[] DEFAULT '{}';

-- Adicionar campo priority_score na tabela products para ordenação de produtos curados
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS priority_score INTEGER DEFAULT 0;

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_categories_quiz_mapping ON categories USING GIN (quiz_mapping);
CREATE INDEX IF NOT EXISTS idx_products_is_curated ON products (is_curated);
CREATE INDEX IF NOT EXISTS idx_products_quiz_keywords ON products USING GIN (quiz_keywords);
CREATE INDEX IF NOT EXISTS idx_products_priority_score ON products (priority_score DESC);

-- Comentários
COMMENT ON COLUMN categories.quiz_mapping IS 'Mapeamento de respostas do quiz para esta categoria (ex: ["sono", "insonia", "sleep"])';
COMMENT ON COLUMN products.is_curated IS 'Indica se o produto é curado especificamente para recomendações do quiz';
COMMENT ON COLUMN products.quiz_keywords IS 'Palavras-chave do quiz que este produto atende (ex: ["energia", "fadiga", "vitamina d"])';
COMMENT ON COLUMN products.priority_score IS 'Score de prioridade para ordenação (maior = mais importante)';

-- Atualizar categorias existentes com mapeamento básico
UPDATE categories SET quiz_mapping = '["sono", "sleep", "dormir", "insonia", "qualidade do sono"]'::jsonb 
WHERE name ILIKE '%sono%' OR name ILIKE '%sleep%';

UPDATE categories SET quiz_mapping = '["energia", "energy", "fadiga", "cansaço", "disposição"]'::jsonb 
WHERE name ILIKE '%energia%' OR name ILIKE '%fadiga%';

UPDATE categories SET quiz_mapping = '["ansiedade", "anxiety", "estresse", "stress", "nervos"]'::jsonb 
WHERE name ILIKE '%ansiedade%' OR name ILIKE '%stress%';

UPDATE categories SET quiz_mapping = '["imunidade", "immunity", "gripe", "resfriado", "defesa"]'::jsonb 
WHERE name ILIKE '%imunidade%' OR name ILIKE '%immunity%';

UPDATE categories SET quiz_mapping = '["digestão", "digestion", "intestino", "gut", "digestivo"]'::jsonb 
WHERE name ILIKE '%intestino%' OR name ILIKE '%digestão%';

UPDATE categories SET quiz_mapping = '["hormonal", "hormone", "menopausa", "menopause", "equilíbrio"]'::jsonb 
WHERE name ILIKE '%hormonal%' OR name ILIKE '%menopausa%';

UPDATE categories SET quiz_mapping = '["emagrecimento", "weight loss", "perda de peso", "queima de gordura"]'::jsonb 
WHERE name ILIKE '%emagrecimento%' OR name ILIKE '%weight%';

UPDATE categories SET quiz_mapping = '["flacidez", "firmness", "pele", "skin", "colágeno"]'::jsonb 
WHERE name ILIKE '%flacidez%' OR name ILIKE '%pele%';

-- Função para buscar produtos curados por categoria baseada no quiz
CREATE OR REPLACE FUNCTION get_curated_products_by_quiz(
  quiz_analysis TEXT,
  max_results INTEGER DEFAULT 6
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  description TEXT,
  category_id UUID,
  amazon_url TEXT,
  current_price TEXT,
  rating NUMERIC,
  review_count INTEGER,
  image_url TEXT,
  benefits TEXT[],
  features TEXT[],
  priority_score INTEGER,
  match_score INTEGER
) AS $$
DECLARE
  analysis_lower TEXT;
  matched_categories UUID[];
  category_mapping JSONB;
BEGIN
  analysis_lower := LOWER(quiz_analysis);
  
  -- Buscar categorias que fazem match com a análise
  SELECT ARRAY_AGG(c.id)
  INTO matched_categories
  FROM categories c
  WHERE c.quiz_mapping ?| (
    SELECT ARRAY_AGG(keyword)
    FROM unnest(string_to_array(analysis_lower, ' ')) AS keyword
    WHERE keyword IN (
      SELECT jsonb_array_elements_text(c.quiz_mapping)
    )
  );
  
  -- Se não encontrou categorias específicas, buscar por palavras-chave nos produtos
  IF matched_categories IS NULL OR array_length(matched_categories, 1) = 0 THEN
    RETURN QUERY
    SELECT 
      p.id,
      p.name,
      p.description,
      p.category_id,
      p.amazon_url,
      p.current_price,
      p.rating,
      p.review_count,
      p.image_url,
      p.benefits,
      p.features,
      p.priority_score,
      CASE 
        WHEN p.is_curated THEN 100
        ELSE 50
      END as match_score
    FROM products p
    WHERE p.is_curated = true
      AND (
        p.quiz_keywords && string_to_array(analysis_lower, ' ')
        OR p.name ILIKE '%' || ANY(string_to_array(analysis_lower, ' ')) || '%'
        OR p.description ILIKE '%' || ANY(string_to_array(analysis_lower, ' ')) || '%'
      )
    ORDER BY 
      match_score DESC,
      p.priority_score DESC,
      p.rating DESC
    LIMIT max_results;
  ELSE
    -- Buscar produtos das categorias que fazem match
    RETURN QUERY
    SELECT 
      p.id,
      p.name,
      p.description,
      p.category_id,
      p.amazon_url,
      p.current_price,
      p.rating,
      p.review_count,
      p.image_url,
      p.benefits,
      p.features,
      p.priority_score,
      CASE 
        WHEN p.is_curated THEN 100
        ELSE 75
      END as match_score
    FROM products p
    WHERE p.category_id = ANY(matched_categories)
      AND (p.is_curated = true OR p.quiz_keywords && string_to_array(analysis_lower, ' '))
    ORDER BY 
      match_score DESC,
      p.priority_score DESC,
      p.rating DESC
    LIMIT max_results;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Comentário da função
COMMENT ON FUNCTION get_curated_products_by_quiz IS 'Busca produtos curados baseados na análise do quiz, priorizando produtos marcados como curados';


