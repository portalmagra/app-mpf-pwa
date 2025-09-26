import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'

// Configuração Resend
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

// Configuração Supabase
const supabase = process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY 
  ? createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )
  : null

export async function POST(request: NextRequest) {
  try {
    const { sessionId, protocolId, protocolName, customerEmail } = await request.json()

    if (!customerEmail || !protocolName || !sessionId) {
      return NextResponse.json({ error: 'Dados incompletos para enviar e-mail' }, { status: 400 })
    }

    console.log('📧 Enviando e-mail de confirmação...', { sessionId, protocolId, customerEmail })

    const downloadLink = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/protocolos/download?protocol=${protocolId}&session=${sessionId}`
    const subject = `🎉 Seu Protocolo "${protocolName}" está pronto para download!`
    
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 30px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px;">🎉 Pagamento Aprovado!</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">Seu protocolo está pronto para download</p>
        </div>
        
        <div style="padding: 30px; background: #f9fafb;">
          <h2 style="color: #1f2937; margin-top: 0;">📋 Detalhes da Compra</h2>
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Protocolo:</strong> ${protocolName}</p>
            <p><strong>Status:</strong> <span style="color: #10b981; font-weight: bold;">✅ Pago</span></p>
            <p><strong>Data:</strong> ${new Date().toLocaleDateString('pt-BR')}</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${downloadLink}" 
               style="background: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              📥 Baixar Protocolo
            </a>
          </div>
          
          <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #92400e; margin-top: 0;">📱 Baixe Nosso App!</h3>
            <p style="color: #92400e; margin: 0;">Para uma experiência ainda melhor, baixe nosso app e receba notificações sobre novos protocolos!</p>
            <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}" style="color: #10b981; font-weight: bold;">📲 Baixar App</a>
          </div>
          
          <div style="text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px;">
            <p>Este e-mail foi enviado automaticamente após a confirmação do seu pagamento.</p>
            <p>Se você não fez esta compra, entre em contato conosco.</p>
          </div>
        </div>
      </div>
    `

    const textContent = `Olá!

Obrigado(a) pela sua compra no MeuPortalFit!

Seu protocolo "${protocolName}" foi processado com sucesso e está pronto para ser baixado.

Clique no link abaixo para acessar seu conteúdo:
${downloadLink}

Você também pode acessar seus protocolos a qualquer momento na área "Meus Conteúdos" do nosso app.

Se tiver qualquer dúvida, entre em contato com nosso suporte.

Atenciosamente,
Equipe MeuPortalFit`

    const fromEmail = process.env.FROM_EMAIL || 'MeuPortalFit <noreply@meuportalfit.com>'

    // Tentar enviar com Resend
    if (resend) {
      try {
        const result = await resend.emails.send({
          from: fromEmail,
          to: [customerEmail],
          subject: subject,
          html: htmlContent,
          text: textContent,
        })
        
        console.log('📧 E-mail enviado com Resend para:', customerEmail)
        console.log('📧 ID do e-mail:', result.data?.id)
        
        // Registrar log no Supabase
        if (supabase && result.data?.id) {
          try {
            const { error: logError } = await supabase
              .from('email_logs')
              .insert({
                resend_email_id: result.data.id,
                customer_email: customerEmail,
                subject: subject,
                protocol_id: protocolId,
                session_id: sessionId,
                status: 'sent',
                sent_at: new Date().toISOString()
              })
            
            if (logError) {
              console.error('❌ Erro ao registrar log no Supabase:', logError)
            } else {
              console.log('✅ Log de e-mail registrado no Supabase')
            }
          } catch (supabaseError) {
            console.error('❌ Erro ao conectar com Supabase:', supabaseError)
          }
        }
        
        return NextResponse.json({ 
          success: true, 
          message: 'E-mail enviado com Resend',
          emailId: result.data?.id
        }, { status: 200 })
      } catch (resendError) {
        console.error('❌ Erro ao enviar e-mail com Resend:', resendError)
        
        // Registrar erro no Supabase
        if (supabase) {
          try {
            const { error: logError } = await supabase
              .from('email_logs')
              .insert({
                customer_email: customerEmail,
                subject: subject,
                protocol_id: protocolId,
                session_id: sessionId,
                status: 'failed',
                error_message: resendError instanceof Error ? resendError.message : 'Erro desconhecido',
                sent_at: new Date().toISOString()
              })
            
            if (logError) {
              console.error('❌ Erro ao registrar log de erro no Supabase:', logError)
            } else {
              console.log('✅ Log de erro registrado no Supabase')
            }
          } catch (supabaseError) {
            console.error('❌ Erro ao conectar com Supabase:', supabaseError)
          }
        }
        
        return NextResponse.json({ 
          error: 'Erro ao enviar e-mail com Resend',
          details: resendError instanceof Error ? resendError.message : 'Erro desconhecido'
        }, { status: 500 })
      }
    }

    // Se Resend não estiver configurado
    console.error('❌ RESEND_API_KEY não configurada')
    return NextResponse.json({ 
      error: 'Serviço de e-mail não configurado. Configure RESEND_API_KEY no .env.local' 
    }, { status: 500 })

  } catch (error) {
    console.error('❌ Erro na API de envio de e-mail:', error)
    return NextResponse.json(
      { error: `Erro interno do servidor: ${error instanceof Error ? error.message : 'Erro desconhecido'}` },
      { status: 500 }
    )
  }
}