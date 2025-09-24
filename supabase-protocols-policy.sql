-- Tabela para controlar compras de protocolos
CREATE TABLE user_purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  protocol_id TEXT NOT NULL,
  stripe_payment_intent_id TEXT,
  amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_user_purchases_user_id ON user_purchases(user_id);
CREATE INDEX idx_user_purchases_protocol_id ON user_purchases(protocol_id);
CREATE INDEX idx_user_purchases_status ON user_purchases(status);

-- RLS (Row Level Security)
ALTER TABLE user_purchases ENABLE ROW LEVEL SECURITY;

-- Política: usuários só veem suas próprias compras
CREATE POLICY "Users can view their own purchases" ON user_purchases
FOR SELECT USING (auth.uid() = user_id);

-- Política: sistema pode inserir compras (para webhooks do Stripe)
CREATE POLICY "System can insert purchases" ON user_purchases
FOR INSERT WITH CHECK (true);

-- Função para verificar se usuário comprou um protocolo
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
