-- ========================================
-- CORREÇÃO PARA TABELA user_purchases EXISTENTE
-- Execute este SQL no Supabase SQL Editor
-- ========================================

-- 1. Adicionar coluna stripe_session_id se não existir
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_purchases' 
        AND column_name = 'stripe_session_id'
    ) THEN
        ALTER TABLE user_purchases ADD COLUMN stripe_session_id TEXT;
    END IF;
END $$;

-- 2. Adicionar coluna customer_email se não existir
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_purchases' 
        AND column_name = 'customer_email'
    ) THEN
        ALTER TABLE user_purchases ADD COLUMN customer_email TEXT;
    END IF;
END $$;

-- 3. Criar índice para stripe_session_id se não existir
CREATE INDEX IF NOT EXISTS idx_user_purchases_stripe_session ON user_purchases(stripe_session_id);

-- 4. Atualizar políticas se necessário
DROP POLICY IF EXISTS "System can insert purchases" ON user_purchases;
CREATE POLICY "System can insert purchases" ON user_purchases
FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "System can update purchases" ON user_purchases;
CREATE POLICY "System can update purchases" ON user_purchases
FOR UPDATE USING (true);

-- 5. Verificar se a função existe e recriar se necessário
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

-- 6. Criar função para obter compras do usuário
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

-- 7. Criar trigger para updated_at se não existir
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

-- Verificar estrutura da tabela
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'user_purchases' 
ORDER BY ordinal_position;

-- Verificar políticas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'user_purchases';

-- Verificar funções
SELECT routine_name, routine_type 
FROM information_schema.routines 
WHERE routine_name LIKE '%protocol%' 
AND routine_schema = 'public';

-- Teste final
SELECT 'Configuração concluída com sucesso!' as status;
