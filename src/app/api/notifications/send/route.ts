import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { title, message, url } = await request.json()
    
    console.log('📨 API: Recebendo notificação:', { title, message, url })
    
    if (!title || !message) {
      return NextResponse.json(
        { error: 'Título e mensagem são obrigatórios' },
        { status: 400 }
      )
    }

    const oneSignalAppId = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID
    const oneSignalApiKey = process.env.ONESIGNAL_REST_API_KEY

    console.log('🔑 API: Verificando configuração OneSignal:', {
      appId: oneSignalAppId ? 'Configurado' : 'Ausente',
      apiKey: oneSignalApiKey ? 'Configurado' : 'Ausente'
    })

    if (!oneSignalAppId || !oneSignalApiKey) {
      return NextResponse.json(
        { error: 'OneSignal não configurado' },
        { status: 500 }
      )
    }

    // Enviar notificação via OneSignal REST API
    const response = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${oneSignalApiKey}`
      },
      body: JSON.stringify({
        app_id: oneSignalAppId,
        headings: { en: title },
        contents: { en: message },
        url: url || 'https://meuportalfit.com',
        included_segments: ['All'], // Enviar para todos os usuários inscritos
        web_buttons: [
          {
            id: 'open',
            text: 'Abrir App',
            icon: 'https://meuportalfit.com/logo-final-solo-m.svg',
            url: url || 'https://meuportalfit.com'
          }
        ],
        chrome_web_icon: 'https://meuportalfit.com/logo-final-solo-m.svg',
        chrome_web_badge: 'https://meuportalfit.com/logo-final-solo-m.svg',
        firefox_icon: 'https://meuportalfit.com/logo-final-solo-m.svg',
        safari_icon: 'https://meuportalfit.com/logo-final-solo-m.svg',
        chrome_icon: 'https://meuportalfit.com/logo-final-solo-m.svg',
        large_icon: 'https://meuportalfit.com/logo-final-completo.svg',
        big_picture: 'https://meuportalfit.com/logo-final-completo.svg'
      })
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Erro OneSignal:', errorData)
      return NextResponse.json(
        { error: 'Erro ao enviar notificação' },
        { status: 500 }
      )
    }

    const result = await response.json()
    console.log('✅ Notificação enviada:', result)

    return NextResponse.json({
      success: true,
      notificationId: result.id,
      recipients: result.recipients
    })

  } catch (error) {
    console.error('Erro ao enviar notificação:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
