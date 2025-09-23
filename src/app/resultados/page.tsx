/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import BottomNavigation from '@/components/BottomNavigation'
import DrAnaAnalysis from '@/components/DrAnaAnalysis'
import RecommendedProducts from '@/components/RecommendedProducts'

// Sistema de traduções
const translations = {
  pt: {
    title: 'Avaliação gratuita feita por inteligência artificial',
    subtitle: 'Sua avaliação personalizada',
    acolhimento: 'Acolhimento',
    analise: 'Análise Personalizada',
    habitos: 'Checklist de Hábitos',
    produtos: 'Produtos Recomendados',
    timeline: 'Timeline de Implementação',
    proximo_passo: 'Próximo Passo',
    shareButton: 'Compartilhar',
    printButton: 'Imprimir',
    whatsappButton: 'Fale Conosco',
    shareMessage: 'Adorei! É muito instrutivo e vale a pena fazer! 🎯 Compartilhe com sua amiga, ela vai gostar:',
    shareTitle: 'Minha Avaliação Personalizada - MeuPortalFit',
    copiedMessage: 'Mensagem copiada para a área de transferência!'
  },
  es: {
    title: 'Evaluación gratuita hecha por inteligencia artificial',
    subtitle: 'Tu evaluación personalizada',
    acolhimento: 'Acolhimiento',
    analise: 'Análisis Personalizado',
    habitos: 'Lista de Hábitos',
    produtos: 'Productos Recomendados',
    timeline: 'Cronograma de Implementación',
    proximo_passo: 'Próximo Paso',
    shareButton: 'Compartir',
    printButton: 'Imprimir',
    whatsappButton: 'Contáctanos',
    shareMessage: '¡Me encantó! Es muy instructivo y vale la pena hacerlo! 🎯 Compártelo con tu amiga, le va a gustar:',
    shareTitle: 'Mi Evaluación Personalizada - MeuPortalFit',
    copiedMessage: '¡Mensaje copiado al portapapeles!'
  },
  en: {
    title: 'Free assessment made by artificial intelligence',
    subtitle: 'Your personalized assessment',
    acolhimento: 'Welcome',
    analise: 'Personalized Analysis',
    habitos: 'Habits Checklist',
    produtos: 'Recommended Products',
    timeline: 'Implementation Timeline',
    proximo_passo: 'Next Step',
    shareButton: 'Share',
    printButton: 'Print',
    whatsappButton: 'Contact Us',
    shareMessage: 'I loved it! It\'s very instructive and worth doing! 🎯 Share with your friend, she\'ll like it:',
    shareTitle: 'My Personalized Assessment - MeuPortalFit',
    copiedMessage: 'Message copied to clipboard!'
  }
}

function ResultadosContent() {
  const [analysisResults, setAnalysisResults] = useState<unknown>(null)
  const [loading, setLoading] = useState(true)
  const [language, setLanguage] = useState('pt')
  const searchParams = useSearchParams()

  // Função de tradução
  const t = (key: keyof typeof translations.pt) => {
    return translations[language as keyof typeof translations]?.[key] || translations.pt[key] || key
  }

  // Função para traduzir WhatsApp message baseado no idioma
  const getWhatsAppMessage = (lang: string) => {
    const messages = {
      pt: 'Olá! Gostaria de saber mais sobre MeuPortalFit.',
      es: '¡Hola! Me gustaría saber más sobre MeuPortalFit.',
      en: 'Hello! I\'d like to know more about MeuPortalFit.'
    }
    return messages[lang as keyof typeof messages] || messages.pt
  }

  useEffect(() => {
    const loadResults = async () => {
      try {
        console.log('🔄 Iniciando loadResults...')
        
        // Pegar dados da URL
        const answers = searchParams.get('answers')
        const comments = searchParams.get('comments')
        const lang = searchParams.get('language') || 'pt'
        const userName = searchParams.get('userName') || ''
        const userAge = searchParams.get('userAge') || ''
        const detailed = searchParams.get('detailed')
        
        console.log('📊 Parâmetros da URL:', { answers: !!answers, comments, lang, userName, userAge, detailed: !!detailed })
        
        setLanguage(lang)
        
        if (answers) {
          console.log('✅ Answers encontrados, fazendo parse...')
          const parsedAnswers = JSON.parse(decodeURIComponent(answers))
          console.log('📝 Answers parseados:', parsedAnswers)
          
          console.log('🚀 Chamando API de análise...')
          
          // Parse dos dados detalhados se existirem
          let parsedDetailed = null
          if (detailed) {
            try {
              parsedDetailed = JSON.parse(decodeURIComponent(detailed))
              console.log('📋 Dados detalhados parseados:', parsedDetailed)
            } catch (error) {
              console.error('❌ Erro ao fazer parse dos dados detalhados:', error)
            }
          }
          
          // Chamar API de análise com idioma e dados pessoais
          const response = await fetch('/api/analyze', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              answers: parsedAnswers,
              language: lang,
              userName: userName,
              userAge: userAge,
              detailed: parsedDetailed
            })
          })

          console.log('📡 Resposta da API:', response.status, response.ok)

          if (response.ok) {
            let results
            try {
              const responseText = await response.text()
              console.log('📄 Resposta bruta da API:', responseText.substring(0, 200) + '...')
              
              if (!responseText || responseText.trim() === '') {
                throw new Error('Resposta vazia da API')
              }
              
              results = JSON.parse(responseText)
              console.log('🤖 Resultados da API:', results)
            } catch (parseError) {
              console.error('❌ Erro ao fazer parse da resposta:', parseError)
              const errorMessage = parseError instanceof Error ? parseError.message : 'Erro desconhecido'
              throw new Error(`Erro ao processar resposta da API: ${errorMessage}`)
            }
            
            // Converter formato da API do PWA para formato esperado pela página
            const convertedResults = {
              acolhimento: results.analysis || 'Análise personalizada gerada com sucesso!',
              analise: results.analysis || 'Análise personalizada baseada nas suas respostas.',
              produtos: results.recommendedProducts || []
            }
            
            console.log('🎯 Produtos recebidos da API:', results.recommendedProducts)
            console.log('🎯 Produtos convertidos:', convertedResults.produtos)
            
            setAnalysisResults(convertedResults)
          } else {
            console.error('❌ Erro na API:', response.status, response.statusText)
            let errorText = ''
            try {
              errorText = await response.text()
              console.error('❌ Detalhes do erro:', errorText)
            } catch (textError) {
              console.error('❌ Erro ao ler texto da resposta:', textError)
            }
            
            // Usar fallback em caso de erro
            const fallbackResults = {
              acolhimento: `Olá! Houve um problema técnico, mas aqui está sua análise personalizada.`,
              analise: `Baseado nas suas respostas, identifiquei áreas importantes para melhorar seu bem-estar.`,
              produtos: []
            }
            
            setAnalysisResults(fallbackResults)
          }
        } else {
          console.log('❌ Nenhum answer encontrado na URL')
          
          // Fallback quando não há answers na URL
          console.log('🔄 Usando dados de fallback (sem answers)...')
          const fallbackResults = {
            acolhimento: `Olá! Bem-vindo à sua avaliação personalizada.`,
            analise: `Baseado em análises gerais para brasileiros vivendo nos EUA, identifiquei áreas importantes para melhorar seu bem-estar.`,
            produtos: []
          }
          setAnalysisResults(fallbackResults)
        }
      } catch (error) {
        console.error('💥 Erro ao carregar resultados:', error)
        
        // Fallback com dados mockados quando a API falha
        console.log('🔄 Usando dados de fallback...')
        const fallbackResults = {
          acolhimento: `Olá! Mesmo com alguns problemas técnicos, preparei uma análise personalizada para você.`,
          analise: `Baseado nas suas respostas, identifiquei áreas importantes para melhorar seu bem-estar. Como brasileiro vivendo nos EUA, você enfrenta desafios únicos de adaptação cultural e climática.`,
          produtos: []
        }
        setAnalysisResults(fallbackResults)
      } finally {
        console.log('🏁 Finalizando loadResults, setLoading(false)')
        setLoading(false)
      }
    }

    loadResults()
  }, [searchParams])

  // Função para buscar produtos na Amazon
  const searchOnAmazon = (searchTerms: string) => {
    const encodedSearch = encodeURIComponent(searchTerms)
    const amazonUrl = `https://www.amazon.com/s?k=${encodedSearch}&tag=portalsolutio-20&rh=n%3A3760901%2Cp_85%3A2470955011%2Cp_72%3A1248879011&s=review-rank`
    window.open(amazonUrl, '_blank')
  }

  // Função para compartilhar com gatilho emocional
  const shareResults = () => {
    const url = 'https://meuportalfit.com/analise'
    const userName = searchParams.get('userName') || ''
    
    const text = language === 'pt' ? 
      userName ? 
        `🇧🇷 ${userName} descobriu como melhorar sua saúde nos EUA! Acabei de fazer uma avaliação gratuita personalizada que me ajudou muito. Compartilhe com seus amigos que também merecem cuidar da saúde: ${url}` :
        `🇧🇷 Ajude outros brasileiros nos EUA! Acabei de fazer uma avaliação gratuita de saúde personalizada que me ajudou muito. Compartilhe com seus amigos que também merecem cuidar da saúde sem gastar nada a mais: ${url}` :
      language === 'es' ?
      userName ?
        `🇧🇷 ¡${userName} descubrió cómo mejorar su salud en USA! Acabo de hacer una evaluación gratuita personalizada que me ayudó mucho. Compártelo con tus amigos que también merecen cuidar su salud: ${url}` :
        `🇧🇷 ¡Ayuda a otros brasileños en USA! Acabo de hacer una evaluación gratuita de salud personalizada que me ayudó mucho. Compártelo con tus amigos que también merecen cuidar su salud sin gastar nada más: ${url}` :
      userName ?
        `🇧🇷 ${userName} discovered how to improve their health in the USA! I just did a free personalized assessment that helped me a lot. Share with your friends who also deserve to take care of their health: ${url}` :
        `🇧🇷 Help other Brazilians in the USA! I just did a free personalized health assessment that helped me a lot. Share with your friends who also deserve to take care of their health without spending anything extra: ${url}`
    
    if (navigator.share) {
      navigator.share({
        title: language === 'pt' ? 
               userName ? `${userName} - Avaliação Personalizada Gratuita` : 'Ajude Outros Brasileiros - Avaliação Gratuita' :
               language === 'es' ? 
               userName ? `${userName} - Evaluación Personalizada Gratuita` : 'Ayuda a Otros Brasileños - Evaluación Gratuita' :
               userName ? `${userName} - Free Personalized Assessment` : 'Help Other Brazilians - Free Assessment',
        text: text,
        url: url
      })
    } else {
      // Fallback para copiar link
      navigator.clipboard.writeText(text).then(() => {
        alert(language === 'pt' ? 'Mensagem copiada! Compartilhe com seus amigos brasileiros!' :
              language === 'es' ? '¡Mensaje copiado! ¡Comparte con tus amigos brasileños!' :
              'Message copied! Share with your Brazilian friends!')
      })
    }
  }

  // Função para imprimir/compartilhar como documento
  const printResults = () => {
    // Adicionar link do MeuPortalFit antes de imprimir
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Minha Avaliação Personalizada - MeuPortalFit</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; background: white; }
              .header { 
                text-align: center; 
                margin-bottom: 30px; 
                background: #f0fdf4;
                padding: 30px;
                border-radius: 12px;
              }
              .logo { font-size: 28px; font-weight: bold; color: #059669; }
              .title { font-size: 24px; color: #1f2937; margin: 10px 0; }
              .subtitle { font-size: 16px; color: #6b7280; }
              .section { margin-bottom: 25px; }
              .section-title { font-size: 20px; color: #1e293b; margin-bottom: 15px; font-weight: bold; }
              .acolhimento { 
                background: #f0fdf4; 
                padding: 20px; 
                border-radius: 8px; 
                border: 2px solid #bbf7d0;
                font-style: italic;
                font-size: 16px;
                color: #374151;
              }
              .analise { 
                background: #f8fafc; 
                padding: 20px; 
                border-radius: 8px; 
                border: 1px solid #e0f2e9;
                font-size: 16px;
                color: #374151;
                line-height: 1.6;
              }
              .contexto-cultural {
                background: #fef3c7;
                padding: 20px;
                border-radius: 8px;
                border: 2px solid #f59e0b;
                font-size: 16px;
                color: #374151;
                line-height: 1.6;
                margin-top: 15px;
              }
              .insights-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 15px;
                margin-top: 20px;
              }
              .insight-card {
                padding: 15px;
                border-radius: 8px;
                border: 2px solid;
              }
              .insight-card.verde {
                background: #f0fdf4;
                border-color: #bbf7d0;
              }
              .insight-card.azul {
                background: #eff6ff;
                border-color: #93c5fd;
              }
              .insight-card.amarelo {
                background: #fef3c7;
                border-color: #f59e0b;
              }
              .insight-title {
                font-weight: bold;
                font-size: 16px;
                margin-bottom: 8px;
                display: flex;
                align-items: center;
                gap: 8px;
              }
              .insight-text {
                font-size: 14px;
                color: #374151;
                line-height: 1.4;
              }
              .habito { 
                margin: 15px 0; 
                padding: 15px; 
                background: #f0fdf4; 
                border-radius: 8px; 
                border: 2px solid #bbf7d0;
                display: flex;
                align-items: center;
                gap: 15px;
              }
              .check { 
                color: #22c55e; 
                font-size: 24px; 
                font-weight: bold;
                background: white;
                border-radius: 50%;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                border: 2px solid #22c55e;
              }
              .habito-text { font-size: 16px; color: #374151; font-weight: 500; }
              .produto { 
                margin: 15px 0; 
                padding: 15px; 
                background: #f8fafc; 
                border-radius: 8px; 
                border: 1px solid #e0f2e9;
              }
              .produto-nome { font-size: 18px; font-weight: bold; color: #1e293b; margin-bottom: 8px; }
              .produto-desc { font-size: 14px; color: #64748b; margin-bottom: 8px; }
              .produto-preco { color: #059669; font-weight: bold; }
              .produto-why { 
                background: #f0fdf4; 
                padding: 10px; 
                border-radius: 6px; 
                border: 1px solid #bbf7d0;
                font-style: italic;
                color: #059669;
                font-size: 13px;
                margin-top: 8px;
              }
              .produtos-adicionais {
                background: #f8fafc;
                padding: 20px;
                border-radius: 8px;
                border: 2px solid #e0f2e9;
                margin-top: 20px;
              }
              .produto-adicional {
                border: 2px solid #bbf7d0;
                border-radius: 8px;
                padding: 12px;
                background: white;
                margin: 10px 0;
              }
              .footer { 
                text-align: center; 
                margin-top: 40px; 
                padding: 30px; 
                background: #f0fdf4; 
                border-radius: 12px;
                border: 2px solid #bbf7d0;
              }
              .link { 
                color: #22c55e; 
                text-decoration: none; 
                font-weight: bold; 
                font-size: 18px;
                display: block;
                margin: 10px 0;
              }
              .whatsapp { 
                color: #25d366; 
                font-weight: bold; 
                font-size: 16px;
                margin: 10px 0;
              }
              @media print {
                body { margin: 0; }
                .header { background: white !important; }
              }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="logo">MeuPortalFit</div>
              <div class="title">Avaliação Gratuita feita por Inteligência Artificial</div>
              <div class="subtitle">Personalizada para brasileiros nos EUA</div>
            </div>
            
            ${(analysisResults as any)?.acolhimento ? `
            <div class="section">
              <div class="acolhimento">
                ${(analysisResults as any).acolhimento}
              </div>
            </div>
            ` : ''}
            
            ${(analysisResults as any)?.analise || (analysisResults as any)?.analysis ? `
            <div class="section">
              <div class="section-title">🧠 Análise Personalizada Detalhada</div>
              <div class="analise">
                <strong style="color: #1e293b;">📊 Resumo da Sua Avaliação:</strong><br/>
                ${(analysisResults as any).analise || (analysisResults as any).analysis}
              </div>
              
              
              <div class="insights-grid">
                <div class="insight-card verde">
                  <div class="insight-title">
                    <span style="font-size: 18px;">💡</span>
                    Principais Insights:
                  </div>
                  <div class="insight-text">
                    Baseado nas suas respostas, identificamos pontos-chave para otimizar seu bem-estar e alcançar seus objetivos de saúde.
                  </div>
                </div>
                
                <div class="insight-card azul">
                  <div class="insight-title">
                    <span style="font-size: 18px;">🎯</span>
                    Objetivos Identificados:
                  </div>
                  <div class="insight-text">
                    Focamos em melhorar sua energia, qualidade do sono e equilíbrio geral para resultados duradouros.
                  </div>
                </div>
                
                <div class="insight-card amarelo">
                  <div class="insight-title">
                    <span style="font-size: 18px;">⚡</span>
                    Potencial de Melhoria:
                  </div>
                  <div class="insight-text">
                    Com as mudanças sugeridas, você pode ver melhorias significativas em 2-4 semanas.
                  </div>
                </div>
              </div>
            </div>
            ` : ''}
            
            
            <div class="section">
              <div class="section-title">🛍️ Produtos Selecionados para Você</div>
              
              ${(analysisResults as any)?.produtos && (analysisResults as any).produtos.length > 0 ? `
              ${(analysisResults as any).produtos.map((produto: any) => `
                <div class="produto">
                  <div class="produto-nome">${produto.name}</div>
                  <div class="produto-desc">${produto.description}</div>
                  <div class="produto-preco">${produto.price} ⭐ ${produto.rating}</div>
                  <div class="produto-benefits">💡 ${produto.benefits}</div>
                  ${produto.detailPageURL ? `
                    <div class="produto-link">
                      <a href="${produto.detailPageURL}" style="color: #059669; text-decoration: none; font-weight: bold; background: #f0fdf4; padding: 8px 16px; border-radius: 8px;">
                        📖 Ver Guia Completo
                      </a>
                    </div>
                  ` : ''}
                  ${produto.amazonUrl ? `
                    <div class="produto-link" style="margin-top: 8px;">
                      <a href="${produto.amazonUrl}" target="_blank" style="color: #ff6b35; text-decoration: none; font-weight: bold;">
                        🛒 Ver na Amazon
                      </a>
                    </div>
                  ` : ''}
                </div>
              `).join('')}
              ` : ''}
              
            </div>
            
            <div class="footer">
              <p style="font-size: 18px; font-weight: bold; color: #1e293b; margin-bottom: 20px;">
                Faça sua avaliação personalizada em:
              </p>
              <a href="https://meuportalfit.com/analise" class="link">meuportalfit.com/analise</a>
              <div class="whatsapp">
                📞 WhatsApp: +1 (786) 253-5032
              </div>
              <p style="font-size: 14px; color: #6b7280; margin-top: 20px;">
                Avaliação personalizada para brasileiros nos EUA
              </p>
            </div>
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  // Função para abrir WhatsApp
  const openWhatsApp = (message: string) => {
    const phoneNumber = '+17862535032'
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`
    window.open(whatsappUrl, '_blank')
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f0fdf4'
      }}>
        <div style={{
          textAlign: 'center',
          padding: '2rem'
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '4px solid #e5e7eb',
            borderTop: '4px solid #22c55e',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p style={{
            color: '#6b7280',
            fontSize: '1.1rem'
          }}>
            Analisando seus dados...
          </p>
        </div>
      </div>
    )
  }

  return (
    <main style={{ position: 'relative', overflow: 'hidden', background: 'white' }}>
      {/* Header */}
      <header style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        padding: '1rem 0',
        borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flexShrink: 0 }}>
              <div style={{
                width: '40px',
                height: '40px',
                background: '#059669',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 900,
                fontSize: '1.2rem'
              }}>
                M
              </div>
              <span style={{
                fontSize: '1.5rem',
                fontWeight: 900,
                color: '#059669'
              }}>
                MeuPortalFit
              </span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                              <a href={`https://wa.me/17862535032?text=${encodeURIComponent(getWhatsAppMessage(language))}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                <button style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.6rem 1.2rem',
                  background: '#25d366',
                  color: 'white',
                  border: 'none',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  transition: 'all 0.3s ease'
                }}>
                  <span>💬</span>
                  <span>{t('whatsappButton')}</span>
                </button>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Mais Compacto */}
      <section style={{
        background: '#f0fdf4',
        padding: '1.5rem 0',
        position: 'relative',
        overflow: 'hidden',
        minHeight: 'auto'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1rem', position: 'relative', zIndex: 10, textAlign: 'center' }}>
          <h1 style={{
            fontSize: 'clamp(1.5rem, 3.5vw, 2rem)',
            fontWeight: 900,
            lineHeight: 1.1,
            marginBottom: '0.5rem',
            color: '#1f2937',
            whiteSpace: 'pre-line'
          }}>
            <span style={{ color: '#059669' }}>
              Avaliação de Bem-Estar Gratuita feita por Inteligência Artificial
            </span>
          </h1>
        </div>
      </section>

      {/* Results Section */}
      <section style={{ background: 'white', padding: '1.5rem 0' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1rem' }}>
          {(analysisResults as any) && (
            <>




              {/* Análise Personalizada Detalhada - Simplificada */}
              <div style={{
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '16px',
                marginBottom: '2rem',
                boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                textAlign: 'left',
                border: '2px solid #e0f2e9'
              }}>
                <h3 style={{
                  fontSize: '1.6rem',
                  color: '#1e293b',
                  marginBottom: '1.5rem',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <span style={{ fontSize: '1.8rem' }}>🧠</span>
                  Sua Análise Personalizada
                </h3>
                
                {/* Análise Principal Melhorada */}
                <div style={{
                  fontSize: '1rem',
                  color: '#374151',
                  lineHeight: '1.8',
                  marginBottom: '1.5rem',
                  padding: '2rem',
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  border: '2px solid #e0f2e9',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                }}>
                  <div style={{
                    fontSize: '1.1rem',
                    fontWeight: '500',
                    color: '#1e293b',
                    marginBottom: '1rem',
                    paddingBottom: '0.5rem',
                    borderBottom: '2px solid #e0f2e9'
                  }}>
                    📋 Resumo da Sua Análise
                  </div>
                  <div 
                    style={{
                      fontSize: '0.95rem',
                      color: '#4b5563',
                      lineHeight: '1.7',
                      marginBottom: '1.5rem',
                      whiteSpace: 'pre-line'
                    }}
                    dangerouslySetInnerHTML={{
                      __html: ((analysisResults as any)?.analise || (analysisResults as any)?.analysis || '')
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/Que tal agendar uma avaliação personalizada\?/g, 
                          '<a href="/avaliacao-personalizada" style="color: #059669; text-decoration: none; font-weight: bold; background: #f0fdf4; padding: 8px 16px; border-radius: 8px; display: inline-block; margin-top: 10px;">Que tal agendar uma avaliação personalizada?</a>')
                    }}
                  />
                  
                  {/* Seção de Orientações Práticas */}
                  {/* Seção de Orientações Práticas - REMOVIDA */}
                  {/* As orientações agora vêm apenas da análise personalizada da Dra. Ana Slim */}
                </div>


                  </div>
                  


              {/* Produtos Recomendados - Simplificada */}
              <div style={{
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '16px',
                marginBottom: '2rem',
                boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                border: '2px solid #e0f2e9'
              }}>
                <h3 style={{
                  fontSize: '1.6rem',
                  color: '#1e293b',
                  marginBottom: '2rem',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}>
                  <span style={{ fontSize: '1.8rem' }}>🛍️</span>
                  Produtos Recomendados para Você
                </h3>
                
                {/* Nota de Sugestão */}
                <div style={{
                  backgroundColor: '#fef3c7',
                  padding: '1rem',
                  borderRadius: '8px',
                  border: '1px solid #f59e0b',
                  marginBottom: '1.5rem',
                  textAlign: 'center'
                }}>
                  <p style={{
                    fontSize: '0.9rem',
                    color: '#92400e',
                    margin: 0,
                    fontWeight: '500'
                  }}>
                    💡 <strong>Estas são apenas sugestões</strong> baseadas na sua análise personalizada. 
                    Consulte sempre um profissional de saúde antes de iniciar qualquer suplementação.
                  </p>
                </div>

                {/* Produtos da API */}
                {(analysisResults as any)?.produtos && (analysisResults as any).produtos.length > 0 && (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '1.5rem',
                    marginBottom: '2rem'
                  }}>
                    {(analysisResults as any).produtos.map((product: any, index: number) => (
                      <div key={index} style={{
                        border: '2px solid #e0f2e9',
                        borderRadius: '16px',
                        padding: '1.5rem',
                        backgroundColor: '#f8fafc',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.08)'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          marginBottom: '1rem'
                        }}>
                          <span style={{
                            fontSize: '2rem',
                            marginRight: '1rem'
                          }}>
                            🛍️
                          </span>
                          <div>
                            <h4 style={{
                              fontSize: '1.1rem',
                              color: '#1e293b',
                              fontWeight: '700',
                              marginBottom: '0.5rem'
                            }}>
                              {product.name}
                            </h4>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '1rem'
                            }}>
                              <span style={{
                                color: '#059669',
                                fontWeight: '700',
                                fontSize: '1rem'
                              }}>
                                {product.price}
                              </span>
                              <span style={{
                                color: '#f59e0b',
                                fontWeight: '600'
                              }}>
                                ⭐ {product.rating}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <p style={{
                          fontSize: '0.95rem',
                          color: '#64748b',
                          lineHeight: '1.6',
                          marginBottom: '1rem'
                        }}>
                          {product.description}
                        </p>
                        
                        <p style={{
                          fontSize: '0.9rem',
                          color: '#059669',
                          marginBottom: '1.5rem',
                          fontStyle: 'italic',
                          backgroundColor: '#f0fdf4',
                          padding: '0.8rem',
                          borderRadius: '12px',
                          border: '2px solid #bbf7d0'
                        }}>
                          💡 {product.whyPerfect}
                        </p>
                        
                        <div style={{
                          display: 'flex',
                          gap: '0.5rem',
                          flexDirection: 'column'
                        }}>
                          {product.detailPageURL && (
                            <a 
                              href={product.detailPageURL}
                              style={{
                                display: 'block',
                                background: 'linear-gradient(135deg, #059669, #047857)',
                                color: 'white',
                                padding: '0.8rem 1.5rem',
                                border: 'none',
                                borderRadius: '25px',
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                width: '100%',
                                boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)',
                                textDecoration: 'none',
                                textAlign: 'center'
                              }}
                            >
                              📖 Ver Mais Produtos para {product.category === 'sono' ? 'Sono' : product.category === 'energia' ? 'Energia' : product.category === 'emagrecimento' ? 'Emagrecimento' : product.category === 'ansiedade' ? 'Ansiedade' : product.category === 'vitaminas' ? 'Vitaminas' : product.category === 'omega3' ? 'Ômega 3' : product.category}
                            </a>
                          )}
                          {product.amazonUrl && (
                            <a 
                              href={product.amazonUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                display: 'block',
                                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                                color: 'white',
                                padding: '0.8rem 1.5rem',
                                border: 'none',
                                borderRadius: '25px',
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                width: '100%',
                                boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
                                textDecoration: 'none',
                                textAlign: 'center'
                              }}
                            >
                              🛒 Ver na Amazon
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              </div>

              {/* Timeline e Próximos Passos */}
              <div style={{
                backgroundColor: 'white',
                padding: '1.5rem',
                borderRadius: '12px',
                marginBottom: '1.5rem',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                textAlign: 'center'
              }}>
                <h3 style={{
                  fontSize: '1.4rem',
                  color: '#1e293b',
                  marginBottom: '1rem',
                  fontWeight: 'bold'
                }}>
                  🚀 Próximos Passos
                </h3>
                
                {(analysisResults as any)?.timeline && (
                  <div style={{
                    fontSize: '1rem',
                    color: '#374151',
                    lineHeight: '1.6',
                    marginBottom: '1.5rem',
                    backgroundColor: '#f8fafc',
                    padding: '1rem',
                    borderRadius: '8px',
                    border: '1px solid #e0f2e9'
                  }}>
                    {(analysisResults as any).timeline}
                  </div>
                )}

                {(analysisResults as any)?.proximo_passo && (
                  <div style={{
                    fontSize: '1.1rem',
                    color: '#059669',
                    fontStyle: 'italic',
                    marginBottom: '1.5rem',
                    backgroundColor: '#f0fdf4',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    border: '3px solid #bbf7d0',
                    textAlign: 'center',
                    fontWeight: '500'
                  }}>
                    💝 <strong style={{ fontSize: '1.2rem' }}>{(analysisResults as any).proximo_passo}</strong>
                  </div>
                )}

                {/* Próximo Passo - Ofertas de Coaching */}
                <div style={{
                  backgroundColor: '#f0fdf4',
                  padding: '2rem',
                  borderRadius: '16px',
                  border: '3px solid #bbf7d0',
                  marginBottom: '1.5rem',
                  textAlign: 'center'
                }}>
                  <h4 style={{
                    fontSize: '1.4rem',
                    color: '#059669',
                    marginBottom: '1.5rem',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}>
                    <span style={{ fontSize: '1.6rem' }}>🎯</span>
                    Próximo Passo: Acompanhamento Personalizado
                  </h4>
                  
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '1.5rem',
                    marginBottom: '2rem'
                  }}>
                    {/* Opção 1: Coach Brasileira */}
                    <div style={{
                      backgroundColor: 'white',
                      padding: '1.5rem',
                      borderRadius: '12px',
                      border: '2px solid #bbf7d0',
                      textAlign: 'center'
                    }}>
                      <div style={{
                        fontSize: '2rem',
                        marginBottom: '1rem'
                      }}>👩‍⚕️</div>
                      <h5 style={{
                        fontSize: '1.2rem',
                        color: '#1e293b',
                        marginBottom: '0.5rem',
                        fontWeight: 'bold'
                      }}>
                        Coach Brasileira de Bem-estar
                      </h5>
                      <p style={{
                        fontSize: '0.9rem',
                        color: '#64748b',
                        marginBottom: '1rem',
                        lineHeight: '1.5'
                      }}>
                        Avaliação personalizada de 30 minutos por vídeo com coach brasileira especializada em qualidade de vida
                      </p>
                      <div style={{
                        backgroundColor: '#f0fdf4',
                        padding: '0.8rem',
                        borderRadius: '8px',
                        marginBottom: '1rem',
                        fontSize: '0.9rem',
                        color: '#059669'
                      }}>
                        <strong><span style={{ textDecoration: 'line-through', color: '#9ca3af' }}>$37</span> por apenas $10</strong><br/>
                        <span style={{ fontSize: '0.8rem' }}>Oferta exclusiva por 24h</span>
                      </div>
                      <button onClick={() => openWhatsApp('Olá! Quero agendar minha avaliação personalizada de 30 minutos com a coach brasileira por $10.')} style={{
                        width: '100%',
                        padding: '0.8rem',
                        background: '#059669',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}>
                        💬 Agendar com Coach
                      </button>
                    </div>
                    
                    {/* Opção 2: Plano Completo IA */}
                    <div style={{
                      backgroundColor: 'white',
                      padding: '1.5rem',
                      borderRadius: '12px',
                      border: '2px solid #3b82f6',
                      textAlign: 'center'
                    }}>
                      <div style={{
                        fontSize: '2rem',
                        marginBottom: '1rem'
                      }}>🤖</div>
                      <h5 style={{
                        fontSize: '1.2rem',
                        color: '#1e293b',
                        marginBottom: '0.5rem',
                        fontWeight: 'bold'
                      }}>
                        Plano Completo Detalhado
                      </h5>
                      <p style={{
                        fontSize: '0.9rem',
                        color: '#64748b',
                        marginBottom: '1rem',
                        lineHeight: '1.5'
                      }}>
                        Plano detalhado de 30 dias com alimentação balanceada, exercícios e cronograma personalizado baseado em ciência
                      </p>
                      <div style={{
                        backgroundColor: '#eff6ff',
                        padding: '0.8rem',
                        borderRadius: '8px',
                        marginBottom: '1rem',
                        fontSize: '0.9rem',
                        color: '#1d4ed8'
                      }}>
                        <strong><span style={{ textDecoration: 'line-through', color: '#9ca3af' }}>$47</span> por apenas $10</strong><br/>
                        <span style={{ fontSize: '0.8rem' }}>Oferta exclusiva por 24h</span>
                      </div>
                      <button onClick={() => openWhatsApp('Olá! Quero receber meu plano completo detalhado de 30 dias com alimentação balanceada e exercícios por $10.')} style={{
                        width: '100%',
                        padding: '0.8rem',
                        background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}>
                        📋 Receber Plano Completo
                      </button>
                    </div>
                  </div>
                  
                  
                  <p style={{
                    fontSize: '0.9rem',
                    color: '#64748b',
                    fontStyle: 'italic'
                  }}>
                    💡 <strong>Escolha sua opção:</strong> Acompanhamento humano personalizado ou plano completo detalhado de 30 dias
                  </p>
                </div>

                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.8rem',
                  alignItems: 'center'
                }}>
                  <button onClick={() => openWhatsApp('Olá! Gostaria de falar sobre minha avaliação personalizada do MeuPortalFit.')} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.8rem 1.5rem',
                    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '25px',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}>
                    💬 {t('whatsappButton')} via WhatsApp
                  </button>

                  <button onClick={shareResults} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.8rem 1.5rem',
                    background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '25px',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}>
                    🇧🇷 Ajude Outros Brasileiros
                  </button>

                  <button onClick={printResults} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.8rem 1.5rem',
                    background: '#059669',
                    color: 'white',
                    border: 'none',
                    borderRadius: '25px',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}>
                    🖨️ Salvar/Imprimir
                  </button>

                  <Link href="/" style={{ textDecoration: 'none' }}>
                    <button style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.8rem 1.5rem',
                      background: 'transparent',
                      color: '#6b7280',
                      border: '1px solid #e5e7eb',
                      borderRadius: '25px',
                      fontSize: '0.9rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}>
                      🏠 Voltar ao Início
                    </button>
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </section>


      {/* Footer */}
      <footer style={{ background: '#1f2937', color: 'white', padding: '1rem 0', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1rem' }}>
          <p style={{ color: '#9ca3af', fontSize: '0.8rem' }}>
            Avaliação personalizada para brasileiros nos EUA
          </p>
        </div>
      </footer>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @media print {
          header, footer, button {
            display: none !important;
          }
          
          main {
            background: white !important;
          }
          
          section {
            padding: 0 !important;
            margin: 0 !important;
          }
        }
      `}</style>
    </main>
  )
}

export default function ResultadosPage() {
  return (
    <Suspense fallback={
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f0fdf4'
      }}>
        <div style={{
          textAlign: 'center',
          padding: '2rem'
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '4px solid #e5e7eb',
            borderTop: '4px solid #22c55e',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p style={{
            color: '#6b7280',
            fontSize: '1.1rem'
          }}>
            Carregando...
          </p>
        </div>
      </div>
    }>
      <ResultadosContent />
      <BottomNavigation currentPage="/" />
    </Suspense>
  )
}
