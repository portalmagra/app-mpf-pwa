-- Criar tabela de eBooks
CREATE TABLE IF NOT EXISTS ebooks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL CHECK (category IN ('receitas', 'dietas')),
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  pdf_link TEXT NOT NULL,
  cover_image_url TEXT,
  preview_images TEXT[], -- Array de URLs de imagens de preview
  author VARCHAR(255) DEFAULT 'Meu Portal Fit',
  pages INTEGER,
  language VARCHAR(10) DEFAULT 'pt-BR',
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  featured BOOLEAN DEFAULT FALSE, -- Para destacar eBooks importantes
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_ebooks_status ON ebooks(status);
CREATE INDEX IF NOT EXISTS idx_ebooks_category ON ebooks(category);
CREATE INDEX IF NOT EXISTS idx_ebooks_featured ON ebooks(featured);
CREATE INDEX IF NOT EXISTS idx_ebooks_created_at ON ebooks(created_at);

-- Criar trigger para atualizar updated_at automaticamente
CREATE TRIGGER update_ebooks_updated_at 
    BEFORE UPDATE ON ebooks 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Inserir dados padrão de exemplo
INSERT INTO ebooks (title, description, category, price, pdf_link, cover_image_url, author, pages, featured) VALUES
('50 Receitas Low Carb', 'Coleção completa de receitas low carb para emagrecimento saudável', 'receitas', 19.90, 'https://drive.google.com/file/d/ebook-receitas-low-carb/view', '/images/ebooks/low-carb-cover.jpg', 'Meu Portal Fit', 45, TRUE),
('Guia Completo de Dietas', 'Manual completo com diferentes tipos de dietas e seus benefícios', 'dietas', 29.90, 'https://drive.google.com/file/d/ebook-guia-dietas/view', '/images/ebooks/dietas-guide-cover.jpg', 'Meu Portal Fit', 60, TRUE),
('Receitas Detox Gratuitas', 'Receitas detox para limpeza do organismo - versão gratuita', 'receitas', 0, 'https://drive.google.com/file/d/ebook-receitas-detox-free/view', '/images/ebooks/detox-free-cover.jpg', 'Meu Portal Fit', 20, FALSE),
('Dieta Mediterrânea', 'Guia completo da dieta mediterrânea com receitas e benefícios', 'dietas', 24.90, 'https://drive.google.com/file/d/ebook-dieta-mediterranea/view', '/images/ebooks/mediterranea-cover.jpg', 'Meu Portal Fit', 35, FALSE),
('Smoothies Funcionais', 'Receitas de smoothies para diferentes objetivos de saúde', 'receitas', 15.90, 'https://drive.google.com/file/d/ebook-smoothies-funcionais/view', '/images/ebooks/smoothies-cover.jpg', 'Meu Portal Fit', 30, FALSE);

