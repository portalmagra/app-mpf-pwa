-- Política de acesso para o bucket 'protocolos' no Supabase Storage
-- Esta política permite que usuários acessem apenas os protocolos que compraram

-- 1. Primeiro, habilite RLS no bucket (se ainda não estiver habilitado)
-- ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 2. Política para SELECT (download) - usuários só podem baixar protocolos que compraram
CREATE POLICY "Users can download purchased protocols" ON storage.objects
FOR SELECT USING (
  bucket_id = 'protocolos' AND
  auth.uid() IS NOT NULL AND
  EXISTS (
    SELECT 1 FROM user_purchases 
    WHERE user_id = auth.uid() 
    AND protocol_id = (string_to_array(name, '/'))[1]
    AND status = 'completed'
  )
);

-- 3. Política para INSERT (upload) - apenas administradores podem fazer upload
CREATE POLICY "Admins can upload protocols" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'protocolos' AND
  auth.uid() IN (
    SELECT id FROM auth.users 
    WHERE email IN ('seu-email-admin@exemplo.com') -- Substitua pelo seu email
  )
);

-- 4. Política para UPDATE - apenas administradores podem atualizar
CREATE POLICY "Admins can update protocols" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'protocolos' AND
  auth.uid() IN (
    SELECT id FROM auth.users 
    WHERE email IN ('seu-email-admin@exemplo.com') -- Substitua pelo seu email
  )
);

-- 5. Política para DELETE - apenas administradores podem deletar
CREATE POLICY "Admins can delete protocols" ON storage.objects
FOR DELETE USING (
  bucket_id = 'protocolos' AND
  auth.uid() IN (
    SELECT id FROM auth.users 
    WHERE email IN ('seu-email-admin@exemplo.com') -- Substitua pelo seu email
  )
);
