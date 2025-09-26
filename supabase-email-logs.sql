-- ========================================
-- CONFIGURAÇÃO PARA LOGS DE E-MAIL
-- Execute este SQL no Supabase SQL Editor
-- ========================================

-- 1. Criar tabela para logs de e-mails enviados
CREATE TABLE IF NOT EXISTS email_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  resend_email_id TEXT UNIQUE,
  customer_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  protocol_id TEXT,
  session_id TEXT,
  status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'bounced', 'failed')),
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  delivered_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_email_logs_customer_email ON email_logs(customer_email);
CREATE INDEX IF NOT EXISTS idx_email_logs_resend_id ON email_logs(resend_email_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON email_logs(status);
CREATE INDEX IF NOT EXISTS idx_email_logs_sent_at ON email_logs(sent_at);
CREATE INDEX IF NOT EXISTS idx_email_logs_protocol_id ON email_logs(protocol_id);

-- 3. Habilitar RLS (Row Level Security)
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- 4. Política: sistema pode inserir logs de e-mail
DROP POLICY IF EXISTS "System can insert email logs" ON email_logs;
CREATE POLICY "System can insert email logs" ON email_logs
FOR INSERT WITH CHECK (true);

-- 5. Política: sistema pode atualizar logs de e-mail
DROP POLICY IF EXISTS "System can update email logs" ON email_logs;
CREATE POLICY "System can update email logs" ON email_logs
FOR UPDATE USING (true);

-- 6. Política: sistema pode visualizar logs de e-mail
DROP POLICY IF EXISTS "System can view email logs" ON email_logs;
CREATE POLICY "System can view email logs" ON email_logs
FOR SELECT USING (true);

-- 7. Função para atualizar timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 8. Trigger para atualizar updated_at automaticamente
DROP TRIGGER IF EXISTS update_email_logs_updated_at ON email_logs;
CREATE TRIGGER update_email_logs_updated_at
    BEFORE UPDATE ON email_logs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 9. Função para obter estatísticas de e-mails
CREATE OR REPLACE FUNCTION get_email_stats()
RETURNS TABLE (
  total_emails BIGINT,
  delivered_emails BIGINT,
  failed_emails BIGINT,
  bounce_rate DECIMAL(5,2)
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_emails,
    COUNT(*) FILTER (WHERE status = 'delivered') as delivered_emails,
    COUNT(*) FILTER (WHERE status = 'failed' OR status = 'bounced') as failed_emails,
    ROUND(
      (COUNT(*) FILTER (WHERE status = 'failed' OR status = 'bounced')::DECIMAL / 
       NULLIF(COUNT(*), 0)) * 100, 2
    ) as bounce_rate
  FROM email_logs;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. Função para obter e-mails por cliente
CREATE OR REPLACE FUNCTION get_emails_by_customer(customer_email_param TEXT)
RETURNS TABLE (
  id UUID,
  resend_email_id TEXT,
  subject TEXT,
  protocol_id TEXT,
  status TEXT,
  sent_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    el.id,
    el.resend_email_id,
    el.subject,
    el.protocol_id,
    el.status,
    el.sent_at,
    el.delivered_at
  FROM email_logs el
  WHERE el.customer_email = customer_email_param
  ORDER BY el.sent_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 11. Comentários para documentação
COMMENT ON TABLE email_logs IS 'Logs de e-mails enviados via Resend';
COMMENT ON COLUMN email_logs.resend_email_id IS 'ID único do e-mail no Resend';
COMMENT ON COLUMN email_logs.customer_email IS 'E-mail do destinatário';
COMMENT ON COLUMN email_logs.subject IS 'Assunto do e-mail';
COMMENT ON COLUMN email_logs.protocol_id IS 'ID do protocolo relacionado';
COMMENT ON COLUMN email_logs.session_id IS 'ID da sessão do Stripe';
COMMENT ON COLUMN email_logs.status IS 'Status do e-mail: sent, delivered, bounced, failed';
COMMENT ON COLUMN email_logs.sent_at IS 'Data/hora do envio';
COMMENT ON COLUMN email_logs.delivered_at IS 'Data/hora da entrega';
COMMENT ON COLUMN email_logs.error_message IS 'Mensagem de erro se houver falha';

