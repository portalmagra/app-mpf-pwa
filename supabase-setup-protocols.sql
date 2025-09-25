-- ========================================
-- CONFIGURAÇÃO COMPLETA PARA PROTOCOLOS
-- Execute este SQL no Supabase SQL Editor
-- ========================================

-- 1. Criar tabela para controlar compras de protocolos
CREATE TABLE IF NOT EXISTS user_purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  protocol_id TEXT NOT NULL,
  stripe_payment_intent_id TEXT,
  stripe_session_id TEXT,
  customer_email TEXT,
  amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_user_purchases_user_id ON user_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_user_purchases_protocol_id ON user_purchases(protocol_id);
CREATE INDEX IF NOT EXISTS idx_user_purchases_status ON user_purchases(status);
CREATE INDEX IF NOT EXISTS idx_user_purchases_stripe_session ON user_purchases(stripe_session_id);

-- 3. Habilitar RLS (Row Level Security)
ALTER TABLE user_purchases ENABLE ROW LEVEL SECURITY;

-- 4. Política: usuários só veem suas próprias compras
DROP POLICY IF EXISTS "Users can view their own purchases" ON user_purchases;
CREATE POLICY "Users can view their own purchases" ON user_purchases
FOR SELECT USING (auth.uid() = user_id);

-- 5. Política: sistema pode inserir compras (para webhooks do Stripe)
DROP POLICY IF EXISTS "System can insert purchases" ON user_purchases;
CREATE POLICY "System can insert purchases" ON user_purchases
FOR INSERT WITH CHECK (true);

-- 6. Política: sistema pode atualizar compras
DROP POLICY IF EXISTS "System can update purchases" ON user_purchases;
CREATE POLICY "System can update purchases" ON user_purchases
FOR UPDATE USING (true);

-- 7. Função para verificar se usuário comprou um protocolo
CREATE OR REPLACE FUNCTION user_has_purchased_protocol(protocol_name TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_purchases 
    WHERE user_id = auth.uid() 
    AND protocol_id = protocol_name 
    AND status = 'completed'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Função para obter compras do usuário
CREATE OR REPLACE FUNCTION get_user_purchases()
RETURNS TABLE (
  id UUID,
  protocol_id TEXT,
  amount DECIMAL(10,2),
  status TEXT,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    up.id,
    up.protocol_id,
    up.amount,
    up.status,
    up.created_at
  FROM user_purchases up
  WHERE up.user_id = auth.uid()
  ORDER BY up.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_user_purchases_updated_at ON user_purchases;
CREATE TRIGGER update_user_purchases_updated_at 
    BEFORE UPDATE ON user_purchases 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- VERIFICAÇÃO FINAL
-- ========================================

-- Verificar se a tabela foi criada
SELECT 'Tabela user_purchases criada com sucesso!' as status;

-- Verificar políticas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'user_purchases';

-- Verificar funções
SELECT routine_name, routine_type 
FROM information_schema.routines 
WHERE routine_name LIKE '%protocol%' 
AND routine_schema = 'public';
