-- Criar tabela de receitas
CREATE TABLE IF NOT EXISTS recipes (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50) NOT NULL DEFAULT 'doces',
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  pdf_link TEXT NOT NULL,
  image_url TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  access_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_recipes_status ON recipes(status);
CREATE INDEX IF NOT EXISTS idx_recipes_type ON recipes(type);
CREATE INDEX IF NOT EXISTS idx_recipes_created_at ON recipes(created_at);

-- Criar trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_recipes_updated_at 
    BEFORE UPDATE ON recipes 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Inserir dados padrão
INSERT INTO recipes (name, description, type, price, pdf_link, status, access_link) VALUES
('Shot de Curcuma', 'Shot anti-inflamatório com curcuma, limão e pimenta-do-reino', 'shots', 0, 'https://drive.google.com/file/d/curcuma-shot/view', 'active', 'https://app.meuportalfit.com/receita/1'),
('Smoothie Verde Detox', 'Bebida refrescante rica em clorofila e antioxidantes para desintoxicar o organismo', 'sucos', 0, 'https://drive.google.com/file/d/smoothie-verde/view', 'active', 'https://app.meuportalfit.com/receita/2'),
('Bowl Energético com Quinoa', 'Refeição completa e nutritiva perfeita para dar energia durante o dia', 'saladas', 1.99, 'https://drive.google.com/file/d/bowl-quinoa/view', 'active', 'https://app.meuportalfit.com/receita/3'),
('Sopa Anti-inflamatória', 'Sopa reconfortante com ingredientes que combatem inflamações', 'sopas', 2.99, 'https://drive.google.com/file/d/sopa-anti/view', 'active', 'https://app.meuportalfit.com/receita/4')
ON CONFLICT DO NOTHING;

-- Habilitar RLS (Row Level Security)
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

-- Política para permitir leitura pública
CREATE POLICY "Permitir leitura pública de receitas" ON recipes
    FOR SELECT USING (true);

-- Política para permitir inserção/atualização (você pode ajustar conforme necessário)
CREATE POLICY "Permitir inserção de receitas" ON recipes
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir atualização de receitas" ON recipes
    FOR UPDATE USING (true);

CREATE POLICY "Permitir deleção de receitas" ON recipes
    FOR DELETE USING (true);
