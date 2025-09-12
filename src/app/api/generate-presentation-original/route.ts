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

    // Template HTML baseado na página original do MeuPortalFit
    const htmlTemplate = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MeuPortalFit - Resultados Personalizados para ${userName}</title>
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
            background: #f8fafc;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .header {
            background: linear-gradient(135deg, #22c55e, #3b82f6);
            color: white;
            padding: 40px 20px;
            border-radius: 16px;
            text-align: center;
            margin-bottom: 30px;
            box-shadow: 0 8px 24px rgba(34, 197, 94, 0.2);
        }
        
        .logo {
            font-size: 36px;
            font-weight: 800;
            margin-bottom: 10px;
            letter-spacing: -0.5px;
        }
        
        .subtitle {
            font-size: 16px;
            opacity: 0.9;
            margin-bottom: 30px;
        }
        
        .greeting {
            font-size: 48px;
            font-weight: 800;
            margin-bottom: 15px;
            line-height: 1.2;
        }
        
        .personalized-subtitle {
            font-size: 24px;
            font-weight: 600;
            margin-bottom: 20px;
            opacity: 0.95;
        }
        
        .description {
            font-size: 18px;
            max-width: 600px;
            margin: 0 auto;
            opacity: 0.9;
        }
        
        .content-section {
            background: white;
            border-radius: 16px;
            padding: 30px;
            margin-bottom: 20px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.05);
            border: 1px solid #e5e7eb;
        }
        
        .section-title {
            font-size: 28px;
            font-weight: 700;
            color: #1f2937;
            margin-bottom: 20px;
            text-align: center;
            position: relative;
        }
        
        .section-title::after {
            content: '';
            position: absolute;
            bottom: -8px;
            left: 50%;
            transform: translateX(-50%);
            width: 60px;
            height: 4px;
            background: linear-gradient(135deg, #22c55e, #3b82f6);
            border-radius: 2px;
        }
        
        .recommendations-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin: 30px 0;
        }
        
        .recommendation-card {
            background: linear-gradient(135deg, #f0fdf4, #eff6ff);
            padding: 25px;
            border-radius: 12px;
            border-left: 4px solid #22c55e;
            box-shadow: 0 4px 12px rgba(0,0,0,0.05);
            transition: transform 0.3s ease;
        }
        
        .recommendation-card:hover {
            transform: translateY(-4px);
        }
        
        .recommendation-icon {
            font-size: 24px;
            margin-bottom: 12px;
        }
        
        .recommendation-text {
            font-size: 16px;
            font-weight: 500;
            color: #1f2937;
            line-height: 1.5;
        }
        
        .priority-areas {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            justify-content: center;
            margin: 30px 0;
        }
        
        .priority-chip {
            background: linear-gradient(135deg, #22c55e, #3b82f6);
            color: white;
            padding: 12px 24px;
            border-radius: 25px;
            font-size: 14px;
            font-weight: 600;
            box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
            transition: transform 0.3s ease;
        }
        
        .priority-chip:hover {
            transform: translateY(-2px);
        }
        
        .products-section {
            background: linear-gradient(135deg, #f8fafc, #f1f5f9);
            border-radius: 16px;
            padding: 30px;
            margin: 30px 0;
        }
        
        .products-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 20px;
            margin: 20px 0;
        }
        
        .product-card {
            background: white;
            border-radius: 16px;
            padding: 25px;
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
            width: 100%;
            text-align: center;
        }
        
        .amazon-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 24px rgba(255, 149, 0, 0.4);
            background: linear-gradient(135deg, #ff6b00, #e55a00);
        }
        
        .habits-section {
            background: white;
            border-radius: 16px;
            padding: 30px;
            margin: 20px 0;
            box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }
        
        .habits-list {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 15px;
            margin: 20px 0;
        }
        
        .habit-item {
            background: linear-gradient(135deg, #fef3c7, #f0fdf4);
            padding: 20px;
            border-radius: 12px;
            border-left: 4px solid #f59e0b;
            display: flex;
            align-items: center;
            gap: 15px;
        }
        
        .habit-icon {
            font-size: 24px;
            flex-shrink: 0;
        }
        
        .habit-text {
            font-size: 16px;
            font-weight: 500;
            color: #1f2937;
            line-height: 1.4;
        }
        
        .encouragement-section {
            background: linear-gradient(135deg, #7c3aed, #a855f7);
            color: white;
            padding: 40px;
            border-radius: 16px;
            text-align: center;
            margin: 30px 0;
            box-shadow: 0 8px 24px rgba(124, 58, 237, 0.2);
        }
        
        .encouragement-text {
            font-size: 24px;
            font-weight: 600;
            line-height: 1.4;
            margin-bottom: 20px;
        }
        
        .cta-section {
            background: linear-gradient(135deg, #22c55e, #3b82f6);
            color: white;
            padding: 40px;
            border-radius: 16px;
            text-align: center;
            margin: 30px 0;
            box-shadow: 0 8px 24px rgba(34, 197, 94, 0.2);
        }
        
        .cta-title {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 15px;
        }
        
        .cta-description {
            font-size: 18px;
            margin-bottom: 30px;
            opacity: 0.9;
        }
        
        .cta-buttons {
            display: flex;
            gap: 20px;
            justify-content: center;
            flex-wrap: wrap;
        }
        
        .cta-btn {
            background: white;
            color: #22c55e;
            padding: 16px 32px;
            border-radius: 12px;
            text-decoration: none;
            font-weight: 700;
            font-size: 16px;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(255, 255, 255, 0.2);
        }
        
        .cta-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 24px rgba(255, 255, 255, 0.3);
        }
        
        .footer {
            background: #1f2937;
            color: white;
            padding: 30px;
            border-radius: 16px;
            text-align: center;
            margin-top: 30px;
        }
        
        .footer-title {
            font-size: 20px;
            font-weight: 700;
            margin-bottom: 10px;
        }
        
        .footer-subtitle {
            font-size: 14px;
            opacity: 0.8;
        }
        
        @media (max-width: 768px) {
            .container {
                padding: 10px;
            }
            
            .greeting {
                font-size: 36px;
            }
            
            .personalized-subtitle {
                font-size: 20px;
            }
            
            .recommendations-grid {
                grid-template-columns: 1fr;
            }
            
            .products-grid {
                grid-template-columns: 1fr;
            }
            
            .cta-buttons {
                flex-direction: column;
                align-items: center;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header Section -->
        <div class="header">
            <div class="logo">MeuPortalFit</div>
            <div class="subtitle">🇧🇷 Para Brasileiros nos Estados Unidos 🇺🇸</div>
            <h1 class="greeting">🎉 Olá, ${userName}!</h1>
            <h2 class="personalized-subtitle">Seu plano personalizado está pronto, ${gender}!</h2>
            <p class="description">${result.description}</p>
        </div>

        <!-- Recomendações Prioritárias -->
        <div class="content-section">
            <h2 class="section-title">🎯 Suas Recomendações Prioritárias</h2>
            <div class="recommendations-grid">
                ${result.personalizedRecommendations ? result.personalizedRecommendations.slice(0, 3).map((rec: string) => `
                    <div class="recommendation-card">
                        <div class="recommendation-icon">✨</div>
                        <div class="recommendation-text">${rec}</div>
                    </div>
                `).join('') : ''}
            </div>
            
            ${result.priorityAreas ? `
                <div class="priority-areas">
                    ${result.priorityAreas.slice(0, 4).map((area: string) => `
                        <div class="priority-chip">${area}</div>
                    `).join('')}
                </div>
            ` : ''}
        </div>

        <!-- Análise Completa -->
        <div class="content-section">
            <h2 class="section-title">📊 Análise Personalizada Completa</h2>
            <div class="recommendations-grid">
                ${result.personalizedRecommendations ? result.personalizedRecommendations.map((rec: string) => `
                    <div class="recommendation-card">
                        <div class="recommendation-icon">✨</div>
                        <div class="recommendation-text">${rec}</div>
                    </div>
                `).join('') : ''}
            </div>
            
            ${result.riskFactors ? `
                <h3 style="font-size: 20px; font-weight: 600; color: #dc2626; margin: 30px 0 15px 0; text-align: center;">⚠️ Fatores de Risco</h3>
                <div class="recommendations-grid">
                    ${result.riskFactors.map((risk: string) => `
                        <div class="recommendation-card" style="border-left-color: #dc2626;">
                            <div class="recommendation-icon">⚠️</div>
                            <div class="recommendation-text">${risk}</div>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
        </div>

        <!-- Hábitos e Próximos Passos -->
        <div class="habits-section">
            <h2 class="section-title">✅ Seu Plano de Ação</h2>
            
            ${result.newHabits ? `
                <h3 style="font-size: 20px; font-weight: 600; color: #16a34a; margin: 30px 0 15px 0;">🔄 Novos Hábitos</h3>
                <div class="habits-list">
                    ${result.newHabits.map((habit: string) => `
                        <div class="habit-item">
                            <div class="habit-icon">✅</div>
                            <div class="habit-text">${habit}</div>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
            
            ${result.nextSteps ? `
                <h3 style="font-size: 20px; font-weight: 600; color: #3b82f6; margin: 30px 0 15px 0;">🚀 Próximos Passos</h3>
                <div class="habits-list">
                    ${result.nextSteps.map((step: string) => `
                        <div class="habit-item" style="border-left-color: #3b82f6;">
                            <div class="habit-icon">🚀</div>
                            <div class="habit-text">${step}</div>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
        </div>

        <!-- Produtos Amazon -->
        ${result.amazonProducts && result.amazonProducts.length > 0 ? `
            <div class="products-section">
                <h2 class="section-title">🛒 Produtos Recomendados</h2>
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
            </div>
        ` : ''}

        <!-- Encorajamento -->
        ${result.encouragement ? `
            <div class="encouragement-section">
                <div class="encouragement-text">
                    "${result.encouragement.replace('Você é uma inspiração!', `${userName}, você é uma inspiração!`)}"
                </div>
            </div>
        ` : ''}

        <!-- CTAs -->
        <div class="cta-section">
            <h2 class="cta-title">🎯 Próximos Passos</h2>
            <p class="cta-description">Continue sua jornada de transformação com nossos recursos exclusivos</p>
            <div class="cta-buttons">
                <a href="https://wa.me/${WHATSAPP_CONFIG.OFFICIAL_NUMBER}?text=${encodeURIComponent(WHATSAPP_CONFIG.MESSAGES.COACH)}" class="cta-btn" target="_blank">💬 Falar com Coach</a>
                <a href="${WHATSAPP_CONFIG.GROUP_LINK}" class="cta-btn" target="_blank">👥 Entrar no Grupo</a>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <div class="footer-title">MeuPortalFit - Saúde dos Brasileiros nos EUA</div>
            <div class="footer-subtitle">
                <a href="https://app.meuportalfit.com" style="color: #22c55e; text-decoration: none;">app.meuportalfit.com</a> | 
                <a href="https://wa.me/17862535032" style="color: #22c55e; text-decoration: none;">WhatsApp: (786) 253-5032</a>
            </div>
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
    console.error('Error generating original presentation:', error);
    return NextResponse.json({ error: 'Failed to generate presentation' }, { status: 500 });
  }
}
