-- Criar tabela para gerenciar protocolos dinamicamente
CREATE TABLE IF NOT EXISTS protocolos (
  id SERIAL PRIMARY KEY,
  protocol_id VARCHAR UNIQUE NOT NULL,
  nome VARCHAR NOT NULL,
  arquivo_pdf VARCHAR NOT NULL,
  ordem INTEGER NOT NULL,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir todos os protocolos existentes
INSERT INTO protocolos (protocol_id, nome, arquivo_pdf, ordem, ativo) VALUES
('suporte-canetas-emagrecedoras', 'Protocolo Suporte com Canetas Emagrecedoras', 'PROTOCOLO SUPORTE COM AS CANETAS EMAGRECEDORAS.pdf', 1, true),
('pre-caneta', 'Protocolo Pré-Caneta', 'PROTOCOLO-PRE-CANETA.pdf', 2, true),
('pos-caneta-manutencao', 'Protocolo Pós-Caneta Manutenção', 'PROTOCOLO-POS-CANETA-MANUTENCAO.pdf', 3, true),
('proteina-massa-magra', 'Protocolo Proteína e Massa Magra', 'PROTOCOLO-PROTEINA-and-MASSA-MAGRA.pdf', 4, true),
('intestino-livre', 'Protocolo Intestino Livre', 'PROTOCOLO-INTESTINO-LIVRE.pdf', 5, true),
('nausea-refluxo', 'Protocolo Náusea e Refluxo', 'PROTOCOLO-NAUSEA-and-REFLUXO.pdf', 6, true),
('energia-imunidade', 'Protocolo Energia e Imunidade', 'PROTOCOLO-ENERGIA-E-IMUNIDADE.pdf', 7, true),
('imunidade-avancada', 'Protocolo Imunidade Avançada', 'PROTOCOLO-IMUNIDADE-AVANCADA.pdf', 8, true),
('detox-leve', 'Protocolo Detox Leve', 'PROTOCOLO-DETOX-LEVE.pdf', 9, true),
('anti-inflamatorio', 'Protocolo Anti-inflamatório', 'PROTOCOLO-ANTI-INFLAMATORIO.pdf', 10, true),
('mulheres-40', 'Protocolo Mulheres 40+', 'PROTOCOLO-MULHERES-40.pdf', 11, true),
('pele-cabelo-unhas', 'Protocolo Pele, Cabelo e Unhas', 'PROTOCOLO-PELE-CABELO-and-UNHAS.pdf', 12, true),
('sono-ansiedade', 'Protocolo Sono e Ansiedade', 'PROTOCOLO-SONO-and-ANSIEDADE (2).pdf', 13, true),
('fitness-performance', 'Protocolo Fitness e Performance', 'PROTOCOLO-FITNESS-and-PERFORMANCE.pdf', 14, true),
('alternativa-sem-caneta', 'Protocolo Alternativa Sem Caneta', 'PROTOCOLO ALTERNATIVA SEM CANETA.pdf', 15, true)
ON CONFLICT (protocol_id) DO UPDATE SET
  nome = EXCLUDED.nome,
  arquivo_pdf = EXCLUDED.arquivo_pdf,
  ordem = EXCLUDED.ordem,
  ativo = EXCLUDED.ativo,
  updated_at = NOW();

-- Criar função para obter protocolos ativos ordenados
CREATE OR REPLACE FUNCTION get_protocolos_ativos()
RETURNS TABLE (
  protocol_id VARCHAR,
  nome VARCHAR,
  arquivo_pdf VARCHAR,
  ordem INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT p.protocol_id, p.nome, p.arquivo_pdf, p.ordem
  FROM protocolos p
  WHERE p.ativo = true
  ORDER BY p.ordem ASC;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_protocolos_updated_at
  BEFORE UPDATE ON protocolos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies
ALTER TABLE protocolos ENABLE ROW LEVEL SECURITY;

-- Política para leitura pública (apenas protocolos ativos)
CREATE POLICY "Protocolos ativos são públicos" ON protocolos
  FOR SELECT USING (ativo = true);

-- Política para inserção/atualização apenas para service role
CREATE POLICY "Apenas service role pode modificar protocolos" ON protocolos
  FOR ALL USING (auth.role() = 'service_role');
