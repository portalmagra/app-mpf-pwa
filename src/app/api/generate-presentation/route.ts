import { NextRequest, NextResponse } from 'next/server';
import { WHATSAPP_CONFIG } from '@/config/whatsapp';

// Função para detectar gênero baseado no nome
function detectGender(name: string): 'brasileiro' | 'brasileira' {
  const femaleNames = ['ana', 'maria', 'julia', 'sofia', 'isabella', 'laura', 'valentina', 'giovanna', 'alice', 'luiza', 'helena', 'beatriz', 'lara', 'mariana', 'gabriela', 'rafaela', 'carolina', 'camila', 'fernanda', 'patricia', 'adriana', 'cristina', 'sandra', 'denise', 'monica', 'silvia', 'regina', 'rosana', 'eliane', 'marcia', 'vera', 'claudia', 'rosemary', 'fatima'];
  
  const firstName = name.toLowerCase().split(' ')[0];
  return femaleNames.includes(firstName) ? 'brasileira' : 'brasileiro';
}

export async function POST(request: NextRequest) {
  try {
    const { userName, result } = await request.json();
    
    const gender = detectGender(userName);

    // Template HTML profissional baseado no Gamma
    const htmlTemplate = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MeuPortalFit - Plano Personalizado para ${userName}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #1f2937;
            background: linear-gradient(135deg, #f0fdf4, #eff6ff);
            min-height: 100vh;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .presentation {
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            overflow: hidden;
            margin-bottom: 30px;
        }
        
        .slide {
            min-height: 100vh;
            padding: 60px 40px;
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
        }
        
        .slide-cover {
            background: linear-gradient(135deg, #ffffff, #f8fafc);
            color: #1f2937;
            border-bottom: 3px solid #22c55e;
        }
        
        .slide-content {
            background: white;
            border-left: 4px solid #22c55e;
            border-right: 4px solid #3b82f6;
        }
        
        .slide-offers {
            background: linear-gradient(135deg, #f0fdf4, #eff6ff);
        }
        
        .header-section {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 30px;
            margin-bottom: 40px;
        }
        
        .logo-container {
            text-align: center;
        }
        
        .greeting-section {
            text-align: center;
            max-width: 600px;
        }
        
        .description-card {
            background: linear-gradient(135deg, #f0fdf4, #eff6ff);
            padding: 25px;
            border-radius: 16px;
            border: 1px solid #e5e7eb;
            margin-top: 20px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }
        
        .logo {
            font-size: 32px;
            font-weight: 800;
            margin-bottom: 10px;
            letter-spacing: -0.5px;
        }
        
        .subtitle {
            font-size: 14px;
            opacity: 0.9;
            margin-bottom: 40px;
        }
        
        .main-title {
            font-size: 48px;
            font-weight: 800;
            margin-bottom: 15px;
            line-height: 1.2;
        }
        
        .subtitle-personalized {
            font-size: 24px;
            font-weight: 600;
            color: #16a34a;
            margin-bottom: 20px;
            text-align: center;
        }
        
        .user-title {
            font-size: 28px;
            font-weight: 600;
            margin-bottom: 30px;
            color: #16a34a;
        }
        
        .description {
            font-size: 18px;
            max-width: 600px;
            margin-bottom: 40px;
            opacity: 0.95;
        }
        
        .qr-code {
            width: 120px;
            height: 120px;
            background: white;
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 30px auto;
            font-size: 48px;
            color: #10b981;
        }
        
        .install-text {
            font-size: 12px;
            opacity: 0.8;
        }
        
        .section {
            margin: 40px 0;
            padding: 30px;
            background: #f8fafc;
            border-radius: 16px;
            border-left: 6px solid #10b981;
        }
        
        .section-title {
            font-size: 24px;
            font-weight: 700;
            color: #10b981;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .recommendations {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin: 20px 0;
        }
        
        .recommendation-item {
            background: white;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.05);
            border-left: 4px solid #10b981;
        }
        
        .recommendation-item h4 {
            color: #10b981;
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 8px;
        }
        
        .recommendation-item p {
            color: #6b7280;
            font-size: 14px;
        }
        
        .focus-areas {
            margin: 25px 0;
            text-align: center;
        }
        
        .focus-title {
            font-size: 18px;
            font-weight: 600;
            color: #16a34a;
            margin-bottom: 15px;
        }
        
        .focus-chips {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            justify-content: center;
        }
        
        .focus-chip {
            background: linear-gradient(135deg, #22c55e, #3b82f6);
            color: white;
            padding: 12px 20px;
            border-radius: 25px;
            font-size: 14px;
            font-weight: 500;
            box-shadow: 0 4px 8px rgba(34, 197, 94, 0.2);
            transition: transform 0.2s ease;
        }
        
        .focus-chip:hover {
            transform: translateY(-2px);
        }
        
        .products-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 20px;
            margin: 20px 0;
        }
        
        .product-card {
            background: white;
            border-radius: 20px;
            padding: 28px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.08);
            border: 2px solid #f3f4f6;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }
        
        .product-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(135deg, #22c55e, #3b82f6);
        }
        
        .product-card:hover {
            transform: translateY(-6px);
            box-shadow: 0 16px 40px rgba(0,0,0,0.15);
            border-color: #22c55e;
        }
        
        .product-name {
            font-size: 20px;
            font-weight: 800;
            color: #1f2937;
            margin-bottom: 12px;
            line-height: 1.3;
        }
        
        .product-price {
            font-size: 28px;
            font-weight: 900;
            background: linear-gradient(135deg, #22c55e, #16a34a);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 16px;
        }
        
        .product-description {
            color: #6b7280;
            font-size: 16px;
            margin-bottom: 20px;
            line-height: 1.5;
        }
        
        .amazon-btn {
            background: linear-gradient(135deg, #ff9500, #ff6b00);
            color: white;
            padding: 16px 32px;
            border-radius: 12px;
            text-decoration: none;
            font-weight: 700;
            font-size: 16px;
            display: inline-block;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(255, 149, 0, 0.3);
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .amazon-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 24px rgba(255, 149, 0, 0.4);
            background: linear-gradient(135deg, #ff6b00, #e55a00);
        }
        
        .cta-section {
            background: linear-gradient(135deg, #3b82f6, #1d4ed8);
            color: white;
            padding: 40px;
            border-radius: 20px;
            margin: 30px 0;
            text-align: center;
        }
        
        .cta-title {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 16px;
        }
        
        .cta-description {
            font-size: 16px;
            margin-bottom: 24px;
            opacity: 0.9;
        }
        
        .cta-button {
            background: white;
            color: #3b82f6;
            padding: 16px 32px;
            border-radius: 12px;
            text-decoration: none;
            font-weight: 700;
            font-size: 16px;
            display: inline-block;
            transition: transform 0.2s ease;
        }
        
        .cta-button:hover {
            transform: translateY(-2px);
        }
        
        .urgency-badge {
            background: #f59e0b;
            color: white;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
            position: absolute;
            top: 20px;
            right: 20px;
        }
        
        .social-proof {
            background: linear-gradient(135deg, #f0fdf4, #eef2ff);
            padding: 25px;
            border-radius: 16px;
            margin: 25px 0;
            text-align: center;
            border: 2px solid #22c55e;
            box-shadow: 0 4px 12px rgba(34, 197, 94, 0.1);
        }
        
        .social-proof-text {
            color: #16a34a;
            font-weight: 700;
            font-size: 18px;
            margin-bottom: 10px;
        }
        
        .priority-recommendations {
            display: flex;
            flex-direction: column;
            gap: 15px;
            margin: 20px 0;
        }
        
        .priority-item {
            background: white;
            padding: 20px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            gap: 15px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.08);
            border-left: 4px solid #22c55e;
        }
        
        .priority-icon {
            font-size: 24px;
            flex-shrink: 0;
        }
        
        .priority-text {
            font-size: 16px;
            font-weight: 500;
            color: #1f2937;
            line-height: 1.4;
        }
        
        .encouragement {
            background: linear-gradient(135deg, #fef3c7, #f0fdf4);
            padding: 30px;
            border-radius: 16px;
            margin: 30px 0;
            text-align: center;
            font-style: italic;
            font-size: 18px;
            color: #374151;
        }
        
        .footer {
            background: linear-gradient(135deg, #10b981, #3b82f6);
            color: white;
            padding: 30px;
            text-align: center;
            margin-top: 40px;
        }
        
        .footer-title {
            font-size: 20px;
            font-weight: 700;
            margin-bottom: 10px;
        }
        
        .footer-subtitle {
            font-size: 14px;
            opacity: 0.9;
        }
        
        .whatsapp-link {
            background: #25d366;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            display: inline-block;
            margin: 10px;
            transition: transform 0.2s ease;
        }
        
        .whatsapp-link:hover {
            transform: translateY(-2px);
        }
        
        .community-section {
            background: linear-gradient(135deg, #7c3aed, #a855f7);
            padding: 30px;
            border-radius: 16px;
            margin: 30px 0;
            text-align: center;
            color: white;
        }
        
        .community-title {
            font-size: 24px;
            font-weight: 700;
            color: white;
            margin-bottom: 15px;
        }
        
        .community-description {
            font-size: 16px;
            color: #f3e8ff;
            margin-bottom: 10px;
        }
        
        .community-subtitle {
            font-size: 14px;
            color: #e9d5ff;
            margin-bottom: 20px;
        }
        
        .community-button {
            background: white;
            color: #7c3aed;
            padding: 15px 30px;
            border-radius: 12px;
            text-decoration: none;
            font-weight: 600;
            font-size: 16px;
            display: inline-block;
            transition: all 0.3s ease;
        }
        
        .community-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(255, 255, 255, 0.3);
        }
        
        .viral-section {
            background: linear-gradient(135deg, #f59e0b, #d97706);
            color: white;
            padding: 30px;
            border-radius: 16px;
            margin: 30px 0;
            text-align: center;
        }
        
        .viral-title {
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 16px;
        }
        
        .viral-description {
            font-size: 16px;
            margin-bottom: 20px;
            opacity: 0.9;
        }
        
        .viral-button {
            background: white;
            color: #f59e0b;
            padding: 14px 28px;
            border-radius: 10px;
            text-decoration: none;
            font-weight: 700;
            font-size: 16px;
            display: inline-block;
            transition: transform 0.2s ease;
        }
        
        .viral-button:hover {
            transform: translateY(-2px);
        }
        
        @media (max-width: 768px) {
            .container {
                padding: 10px;
            }
            
            .slide {
                padding: 40px 20px;
            }
            
            .main-title {
                font-size: 36px;
            }
            
            .user-title {
                font-size: 24px;
            }
            
            .recommendations {
                grid-template-columns: 1fr;
            }
            
            .products-grid {
                grid-template-columns: 1fr;
            }
            
            .focus-areas {
                justify-content: center;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="presentation">
            
            <!-- SLIDE 1: COVER + VALOR IMEDIATO -->
            <div class="slide slide-cover">
                <div class="urgency-badge">⚡ 24h</div>
                
                <div class="header-section">
                    <div class="logo-container">
                        <div class="logo">MeuPortalFit</div>
                        <div class="subtitle">🇧🇷 Para Brasileiros nos Estados Unidos 🇺🇸</div>
                    </div>
                    
                    <div class="greeting-section">
                        <h1 class="main-title">🎉 Olá, ${userName}!</h1>
                        <h2 class="subtitle-personalized">Seu plano personalizado está pronto, ${gender}!</h2>
                        <div class="description-card">
                            <p class="description">${result.description}</p>
                        </div>
                    </div>
                </div>
                
                
                <!-- VALOR IMEDIATO -->
                <div class="social-proof">
                    <div class="social-proof-text">🎯 Suas Recomendações Prioritárias:</div>
                </div>
                
                <div class="priority-recommendations">
                    ${result.personalizedRecommendations ? result.personalizedRecommendations.slice(0, 3).map((rec: string) => `
                        <div class="priority-item">
                            <div class="priority-icon">✨</div>
                            <div class="priority-text">${rec}</div>
                        </div>
                    `).join('') : ''}
                </div>
                
                ${result.priorityAreas ? `
                    <div class="focus-areas">
                        <h4 class="focus-title">🎯 Áreas de Foco:</h4>
                        <div class="focus-chips">
                            ${result.priorityAreas.slice(0, 4).map((area: string) => `
                                <div class="focus-chip">${area}</div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
                
                ${result.encouragement ? `
                    <div class="encouragement">
                        "${result.encouragement.replace('Você é uma inspiração!', `${userName}, você é uma inspiração!`)}"
                    </div>
                ` : ''}
            </div>
            
            <!-- SLIDE 2: ANÁLISE COMPLETA -->
            <div class="slide slide-content">
                <div class="section">
                    <h3 class="section-title">📊 Análise Personalizada Completa</h3>
                    
                    ${result.personalizedRecommendations ? `
                        <div class="recommendations">
                            ${result.personalizedRecommendations.map((rec: string) => `
                                <div class="recommendation-item">
                                    <h4>✨ ${rec}</h4>
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}
                    
                    ${result.priorityAreas ? `
                        <div class="focus-areas">
                            ${result.priorityAreas.map((area: string) => `
                                <div class="focus-chip">🎯 ${area}</div>
                            `).join('')}
                        </div>
                    ` : ''}
                    
                    ${result.riskFactors ? `
                        <div class="recommendations">
                            ${result.riskFactors.map((risk: string) => `
                                <div class="recommendation-item">
                                    <h4>⚠️ ${risk}</h4>
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
            </div>
            
            <!-- SLIDE 3: HÁBITOS E PRODUTOS -->
            <div class="slide slide-content">
                <div class="section">
                    <h3 class="section-title">✅ Plano de Ação Personalizado</h3>
                    
                    ${result.newHabits ? `
                        <div class="recommendations">
                            ${result.newHabits.map((habit: string) => `
                                <div class="recommendation-item">
                                    <h4>✅ ${habit}</h4>
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}
                    
                    ${result.nextSteps ? `
                        <div class="recommendations">
                            ${result.nextSteps.map((step: string) => `
                                <div class="recommendation-item">
                                    <h4>🚀 ${step}</h4>
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}
                    
                    ${result.amazonProducts && result.amazonProducts.length > 0 ? `
                        <div class="products-grid">
                            ${result.amazonProducts.map((product: { name: string; price: string; description?: string; url: string }) => `
                                <div class="product-card">
                                    <div class="product-name">${product.name}</div>
                                    <div class="product-price">${product.price}</div>
                                    <div class="product-description">${product.description || 'Produto recomendado'}</div>
                                    <a href="${product.url}" class="amazon-btn" target="_blank">🛒 Comprar na Amazon</a>
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
            </div>
            
            <!-- SLIDE 4: OFERTAS E CTAs -->
            <div class="slide slide-offers">
                <div class="urgency-badge">🔥 Ofertas Exclusivas</div>
                
                <div class="cta-section">
                    <h3 class="cta-title">👩‍💻 Coach Brasileira Especializada</h3>
                    <p class="cta-description">Análise personalizada • Plano de 30 dias customizado • Suporte via WhatsApp • Resposta em até 2 horas</p>
                    <a href="https://wa.me/${WHATSAPP_CONFIG.OFFICIAL_NUMBER}?text=${encodeURIComponent(WHATSAPP_CONFIG.MESSAGES.COACH)}" class="cta-button" target="_blank">Falar Agora</a>
                </div>
                
                <div class="cta-section" style="background: linear-gradient(135deg, #10b981, #059669);">
                    <h3 class="cta-title">🍽️ Receitas Brasileiras Exclusivas</h3>
                    <p class="cta-description">Feijoada light • Pão de açúcar saudável • Brigadeiro fit • Ingredientes adaptados para os EUA</p>
                    <a href="https://app.meuportalfit.com" class="cta-button" style="color: #10b981;">Ver Receitas</a>
                </div>
                
                <div class="cta-section" style="background: linear-gradient(135deg, #7c3aed, #6d28d9);">
                    <h3 class="cta-title">👥 Comunidade de Brasileiras nos EUA</h3>
                    <p class="cta-description">+1.247 brasileiras já transformaram suas vidas • Grupo exclusivo WhatsApp • Dicas diárias • Suporte emocional</p>
                    <a href="https://wa.me/${WHATSAPP_CONFIG.OFFICIAL_NUMBER}?text=${encodeURIComponent(WHATSAPP_CONFIG.MESSAGES.PLAN)}" class="cta-button" style="color: #7c3aed;">Entrar Agora</a>
                </div>
                
                ${result.encouragement ? `
                    <div class="encouragement">
                        "${result.encouragement.replace('Você é uma inspiração!', `${userName}, você é uma inspiração!`)}"
                    </div>
                ` : ''}
            </div>
            
            <!-- SLIDE 5: COMUNIDADE E COMPARTILHAMENTO -->
            <div class="slide slide-content">
                
                <div class="community-section">
                    <h3 class="community-title">👥 Comunidade de Brasileiras nos EUA</h3>
                    <p class="community-description">Receba dicas e receitas para sua saúde e bem-estar via WhatsApp</p>
                    <p class="community-subtitle">Entre no nosso grupo exclusivo</p>
                    <a href="${WHATSAPP_CONFIG.GROUP_LINK}" class="community-button" target="_blank">Entrar no Grupo</a>
                </div>
                
                <div class="viral-section">
                    <h3 class="viral-title">💝 Compartilhe com uma Amiga Brasileira!</h3>
                    <p class="viral-description">Ajude outra brasileira nos EUA a transformar sua vida</p>
                    <a href="https://wa.me/${WHATSAPP_CONFIG.OFFICIAL_NUMBER}?text=${encodeURIComponent(WHATSAPP_CONFIG.MESSAGES.SHARE)}" class="viral-button" target="_blank">Compartilhar Agora</a>
                </div>
            </div>
            
        </div>
        
        <div class="footer">
            <div class="footer-title">MeuPortalFit - Saúde dos Brasileiros nos EUA</div>
            <div class="footer-subtitle">app.meuportalfit.com | WhatsApp: (786) 253-5032</div>
        </div>
    </div>
</body>
</html>
    `;

    return new NextResponse(htmlTemplate, {
      headers: {
        'Content-Type': 'text/html',
      },
    });

  } catch (error) {
    console.error('Error generating presentation:', error);
    return NextResponse.json(
      { error: 'Failed to generate presentation' },
      { status: 500 }
    );
  }
}
