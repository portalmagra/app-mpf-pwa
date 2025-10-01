import { NextRequest, NextResponse } from 'next/server';
import jsPDF from 'jspdf';

export async function POST(request: NextRequest) {
  try {
    const { userName, result } = await request.json();

    // Criar PDF com orientação landscape para design mais impactante
    const doc = new jsPDF('landscape', 'mm', 'a4');
    
    // Configurações
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPosition = 20;
    const margin = 15;
    const contentWidth = pageWidth - (margin * 2);

    // Cores atualizadas com paleta brasileira estratégica
    const colors = {
      // Cores principais para conversão
      green: [16, 185, 129], // #10b981 - brand-green (confiança, saúde)
      greenDark: [5, 150, 105], // #059669 - brand-greenDark (autoridade)
      greenSoft: [240, 253, 244], // #f0fdf4 - brand-greenSoft (suavidade)
      blue: [59, 130, 246], // #3b82f6 - brand-blue (tecnologia, confiança)
      blueDark: [29, 78, 216], // #1d4ed8 - brand-blueDark (profissionalismo)
      blueSoft: [239, 246, 255], // #eff6ff - brand-blueSoft (calma)
      amber: [245, 158, 11], // #f59e0b - brand-amber (urgência, preços)
      amberDark: [217, 119, 6], // #d97706 - brand-amberDark (escassez)
      amberSoft: [254, 243, 199], // #fef3c7 - brand-amberSoft (atenção)
      purple: [124, 58, 237], // #7c3aed - brand-purple (premium, exclusividade)
      purpleDark: [109, 40, 217], // #6d28d9 - brand-purpleDark (luxo)
      // Neutros para legibilidade
      cream: [248, 250, 252], // #f8fafc - brand-cream (limpeza)
      text: [31, 41, 55], // #1f2937 - brand-text (legibilidade)
      text2: [107, 114, 128], // #6b7280 - brand-text2 (hierarquia)
      border: [229, 231, 235], // #e5e7eb - brand-border (separação)
      success: [16, 185, 129], // #10b981 - brand-success (confirmação)
      white: [255, 255, 255],
      black: [0, 0, 0]
    };

    // Função para criar gradiente brasileiro (simulado)
    const addGradientBackground = (x: number, y: number, width: number, height: number, color1: number[], color2: number[]) => {
      const steps = 25;
      const stepHeight = height / steps;
      
      for (let i = 0; i < steps; i++) {
        const ratio = i / (steps - 1);
        const r = Math.round(color1[0] + (color2[0] - color1[0]) * ratio);
        const g = Math.round(color1[1] + (color2[1] - color1[1]) * ratio);
        const b = Math.round(color1[2] + (color2[2] - color1[2]) * ratio);
        
        doc.setFillColor(r, g, b);
        doc.rect(x, y + (i * stepHeight), width, stepHeight + 0.5, 'F');
      }
    };

    // Função para adicionar texto com estilo e alinhamento
    const addText = (text: string, fontSize: number, color: number[] = colors.text, isBold: boolean = false, align: 'left' | 'center' | 'right' = 'left') => {
      doc.setFontSize(fontSize);
      doc.setTextColor(color[0], color[1], color[2]);
      if (isBold) {
        doc.setFont('helvetica', 'bold');
      } else {
        doc.setFont('helvetica', 'normal');
      }
      
      const lines = doc.splitTextToSize(text, contentWidth);
      const xPos = align === 'center' ? pageWidth / 2 : align === 'right' ? pageWidth - margin : margin;
      doc.text(lines, xPos, yPosition, { align });
      yPosition += lines.length * (fontSize * 0.4) + 5;
    };

    // Função para adicionar título de seção com estilo brasileiro
    const addSectionTitle = (title: string, icon: string, bgColor: number[] = colors.greenSoft) => {
      if (yPosition > pageHeight - 50) {
        doc.addPage();
        yPosition = 20;
      }
      
      yPosition += 15;
      
      // Background da seção com borda verde
      doc.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
      doc.roundedRect(margin, yPosition - 8, contentWidth, 25, 5, 5, 'F');
      
      // Borda esquerda verde para destaque
      doc.setFillColor(colors.green[0], colors.green[1], colors.green[2]);
      doc.rect(margin, yPosition - 8, 5, 25, 'F');
      
      // Título com ícone
      doc.setFontSize(16);
      doc.setTextColor(colors.green[0], colors.green[1], colors.green[2]);
      doc.setFont('helvetica', 'bold');
      doc.text(`${icon} ${title}`, margin + 12, yPosition + 5);
      
      yPosition += 20;
    };

    // Função para adicionar chip/tag (áreas de foco)
    const addChip = (text: string, x: number, y: number, color: number[] = colors.blueSoft) => {
      const textWidth = doc.getTextWidth(text) + 8;
      const chipHeight = 12;
      
      // Background do chip
      doc.setFillColor(color[0], color[1], color[2]);
      doc.roundedRect(x, y, textWidth, chipHeight, 6, 6, 'F');
      
      // Texto do chip
      doc.setFontSize(10);
      doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
      doc.setFont('helvetica', 'normal');
      doc.text(text, x + 4, y + 8);
      
      return textWidth + 4; // Retorna largura para próxima posição
    };

    // Função para adicionar card de produto com foco em conversão
    const addProductCard = (product: { name: string; price: string; description: string; url: string }, index: number) => {
      if (yPosition > pageHeight - 70) {
        doc.addPage();
        yPosition = 20;
      }
      
      const cardWidth = contentWidth / 2 - 8;
      const cardHeight = 50;
      const xPos = margin + (index % 2) * (cardWidth + 16);
      
      // Background do card com sombra sutil
      doc.setFillColor(colors.white[0], colors.white[1], colors.white[2]);
      doc.setDrawColor(colors.border[0], colors.border[1], colors.border[2]);
      doc.setLineWidth(0.5);
      doc.roundedRect(xPos, yPosition, cardWidth, cardHeight, 8, 8, 'FD');
      
      // Título do produto em verde (confiança)
      doc.setFontSize(12);
      doc.setTextColor(colors.green[0], colors.green[1], colors.green[2]);
      doc.setFont('helvetica', 'bold');
      doc.text(product.name, xPos + 8, yPosition + 10);
      
      // Preço em amarelo (urgência)
      doc.setFontSize(16);
      doc.setTextColor(colors.amber[0], colors.amber[1], colors.amber[2]);
      doc.setFont('helvetica', 'bold');
      doc.text(product.price, xPos + 8, yPosition + 22);
      
      // Descrição do benefício
      doc.setFontSize(9);
      doc.setTextColor(colors.text2[0], colors.text2[1], colors.text2[2]);
      doc.setFont('helvetica', 'normal');
      doc.text(product.description || 'Produto recomendado', xPos + 8, yPosition + 32);
      
      // Botão Amazon em azul (confiança)
      doc.setFillColor(colors.blue[0], colors.blue[1], colors.blue[2]);
      doc.roundedRect(xPos + 8, yPosition + 36, cardWidth - 16, 10, 3, 3, 'F');
      
      doc.setFontSize(9);
      doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
      doc.setFont('helvetica', 'bold');
      doc.text('🛒 Comprar na Amazon', xPos + cardWidth/2, yPosition + 43, { align: 'center' });
      
      if (index % 2 === 1) {
        yPosition += cardHeight + 12;
      }
    };

    // Função para adicionar lista com estilo brasileiro
    const addStyledList = (items: string[], bullet: string = '✅', color: number[] = colors.text) => {
      items.forEach((item) => {
        if (yPosition > pageHeight - 30) {
          doc.addPage();
          yPosition = 20;
        }
        
        // Ícone colorido
        doc.setFontSize(12);
        doc.setTextColor(colors.green[0], colors.green[1], colors.green[2]);
        doc.text(bullet, margin, yPosition);
        
        // Texto
        doc.setTextColor(color[0], color[1], color[2]);
        doc.text(item, margin + 15, yPosition);
        
        yPosition += 8;
      });
    };

    // Função para adicionar CTA com gatilhos mentais
    const addCTA = (title: string, description: string, buttonText: string, bgColor: number[] = colors.blue, urgency?: string) => {
      if (yPosition > pageHeight - 60) {
        doc.addPage();
        yPosition = 20;
      }
      
      yPosition += 10;
      
      // Background do CTA com gradiente
      doc.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
      doc.roundedRect(margin, yPosition, contentWidth, 40, 10, 10, 'F');
      
      // Urgência no canto superior direito
      if (urgency) {
        doc.setFontSize(8);
        doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
        doc.setFont('helvetica', 'bold');
        doc.text(urgency, margin + contentWidth - 20, yPosition + 8, { align: 'right' });
      }
      
      // Título
      doc.setFontSize(16);
      doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
      doc.setFont('helvetica', 'bold');
      doc.text(title, margin + 15, yPosition + 12);
      
      // Descrição
      doc.setFontSize(10);
      doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
      doc.setFont('helvetica', 'normal');
      doc.text(description, margin + 15, yPosition + 20);
      
      // Botão destacado
      doc.setFillColor(colors.white[0], colors.white[1], colors.white[2]);
      doc.roundedRect(margin + contentWidth - 90, yPosition + 8, 80, 22, 5, 5, 'F');
      
      doc.setFontSize(11);
      doc.setTextColor(bgColor[0], bgColor[1], bgColor[2]);
      doc.setFont('helvetica', 'bold');
      doc.text(buttonText, margin + contentWidth - 50, yPosition + 21, { align: 'center' });
      
      yPosition += 45;
    };

    // ===== PÁGINA 1: CAPA + VALOR IMEDIATO =====
    
    // Background com gradiente brasileiro
    addGradientBackground(0, 0, pageWidth, pageHeight, colors.green, colors.blue);
    
    // Logo/Header centralizado
    doc.setFontSize(28);
    doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
    doc.setFont('helvetica', 'bold');
    doc.text('MeuPortalFit', pageWidth / 2, 35, { align: 'center' });
    
    // Subtitle com bandeiras
    doc.setFontSize(12);
    doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
    doc.setFont('helvetica', 'normal');
    doc.text('🇧🇷 Para Brasileiros nos Estados Unidos 🇺🇸', pageWidth / 2, 42, { align: 'center' });
    
    // Título principal personalizado
    doc.setFontSize(22);
    doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
    doc.setFont('helvetica', 'bold');
    doc.text(`🎉 ${result.title}`, pageWidth / 2, 65, { align: 'center' });
    
    // Nome personalizado
    doc.setFontSize(18);
    doc.setTextColor(colors.amberSoft[0], colors.amberSoft[1], colors.amberSoft[2]);
    doc.setFont('helvetica', 'bold');
    doc.text(`Plano Personalizado para ${userName}`, pageWidth / 2, 80, { align: 'center' });
    
    // Descrição
    doc.setFontSize(11);
    doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
    doc.setFont('helvetica', 'normal');
    doc.text(result.description, pageWidth / 2, 95, { align: 'center' });
    
    // QR Code simulado para instalação
    doc.setFillColor(colors.white[0], colors.white[1], colors.white[2]);
    doc.roundedRect(pageWidth / 2 - 30, 110, 60, 60, 8, 8, 'F');
    
    doc.setFontSize(8);
    doc.setTextColor(colors.green[0], colors.green[1], colors.green[2]);
    doc.text('📱 Instalar App', pageWidth / 2, 140, { align: 'center' });
    doc.text('meuportalfit.com', pageWidth / 2, 145, { align: 'center' });
    
    // VALOR IMEDIATO - Recomendações prioritárias
    yPosition = 160;
    doc.setFontSize(14);
    doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
    doc.setFont('helvetica', 'bold');
    doc.text('🎯 Suas Recomendações Prioritárias:', pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 15;
    if (result.personalizedRecommendations) {
      result.personalizedRecommendations.slice(0, 3).forEach((rec: string) => {
        doc.setFontSize(10);
        doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
        doc.setFont('helvetica', 'normal');
        doc.text(`✨ ${rec}`, pageWidth / 2, yPosition, { align: 'center' });
        yPosition += 8;
      });
    }
    
    // Áreas de foco em chips
    if (result.priorityAreas) {
      yPosition += 10;
      doc.setFontSize(12);
      doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
      doc.setFont('helvetica', 'bold');
      doc.text('⭐ Suas Áreas de Foco:', pageWidth / 2, yPosition, { align: 'center' });
      
      yPosition += 15;
      let chipX = pageWidth / 2 - 60;
      result.priorityAreas.slice(0, 4).forEach((area: string) => {
        chipX += addChip(area, chipX, yPosition, colors.white) + 8;
        if (chipX > pageWidth - 60) {
          chipX = pageWidth / 2 - 60;
          yPosition += 15;
        }
      });
    }
    
    // Mensagem de encorajamento
    if (result.encouragement) {
      yPosition += 20;
      doc.setFontSize(11);
      doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
      doc.setFont('helvetica', 'normal');
      doc.text(`"${result.encouragement}"`, pageWidth / 2, yPosition, { align: 'center' });
    }
    
    // ===== PÁGINA 2: ANÁLISE COMPLETA =====
    doc.addPage();
    yPosition = 20;
    
    // Header da página
    addGradientBackground(0, 0, pageWidth, 30, colors.green, colors.blue);
    doc.setFontSize(18);
    doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
    doc.setFont('helvetica', 'bold');
    doc.text('📊 Sua Análise Personalizada Completa', pageWidth / 2, 20, { align: 'center' });
    
    yPosition = 40;

    // Recomendações Personalizadas completas
    if (result.personalizedRecommendations) {
      addSectionTitle('🎯 Recomendações Personalizadas', '');
      addStyledList(result.personalizedRecommendations, '✨', colors.text);
      yPosition += 10;
    }

    // Áreas de Prioridade
    if (result.priorityAreas) {
      addSectionTitle('⭐ Áreas de Prioridade', '');
      addStyledList(result.priorityAreas, '🎯', colors.blue);
      yPosition += 10;
    }

    // Fatores de Risco
    if (result.riskFactors) {
      addSectionTitle('⚠️ Fatores de Risco', '');
      addStyledList(result.riskFactors, '🔍', colors.amber);
      yPosition += 10;
    }

    // ===== PÁGINA 3: HÁBITOS E PRODUTOS =====
    doc.addPage();
    yPosition = 20;
    
    // Header da página
    addGradientBackground(0, 0, pageWidth, 30, colors.blue, colors.purple);
    doc.setFontSize(18);
    doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
    doc.setFont('helvetica', 'bold');
    doc.text('✅ Seu Plano de Ação + Produtos', pageWidth / 2, 20, { align: 'center' });
    
    yPosition = 40;

    // Novos Hábitos
    if (result.newHabits) {
      addSectionTitle('✔ Checklist de Hábitos para Você', '');
      addStyledList(result.newHabits, '✅', colors.green);
      yPosition += 10;
    }

    // Próximos Passos
    if (result.nextSteps) {
      addSectionTitle('🚀 Próximos Passos', '');
      addStyledList(result.nextSteps, '→', colors.blue);
      yPosition += 10;
    }

    // Produtos Amazon em cards com foco em conversão
    if (result.amazonProducts && result.amazonProducts.length > 0) {
      addSectionTitle('🛒 Produtos Recomendados (Links Diretos Amazon)', '');
      
      result.amazonProducts.forEach((product: { name: string; price: string; description: string; url: string }, index: number) => {
        addProductCard(product, index);
      });
      
      yPosition += 20;
    }

    // ===== PÁGINA 4: OFERTAS E CTAs COM GATILHOS MENTAIS =====
    doc.addPage();
    yPosition = 20;
    
    // Header da página
    addGradientBackground(0, 0, pageWidth, 30, colors.purple, colors.amber);
    doc.setFontSize(18);
    doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
    doc.setFont('helvetica', 'bold');
    doc.text('🎁 Ofertas Exclusivas para Brasileiras nos EUA!', pageWidth / 2, 20, { align: 'center' });
    
    yPosition = 40;

    // CTA Coach Brasileira com urgência
    addCTA(
      '👩‍💻 Coach Brasileira Especializada',
      'Análise personalizada • Plano de 30 dias customizado • Suporte via WhatsApp • Resposta em até 2 horas',
      'Falar Agora',
      colors.blue,
      '⚡ 2h'
    );

    // CTA Receitas com escassez
    addCTA(
      '🍽️ Receitas Brasileiras Exclusivas',
      'Feijoada light • Pão de açúcar saudável • Brigadeiro fit • Ingredientes adaptados para os EUA',
      'Ver Receitas',
      colors.green,
      '🔥 Novo'
    );

    // CTA Comunidade com social proof
    addCTA(
      '👥 Comunidade de Brasileiras nos EUA',
      '+1.247 brasileiras já transformaram suas vidas • Grupo exclusivo WhatsApp • Dicas diárias • Suporte emocional',
      'Entrar Agora',
      colors.purple,
      '👥 1.2k'
    );

    // Mensagem de Encorajamento
    if (result.encouragement) {
      addSectionTitle('💪 Mensagem de Encorajamento', '');
      addText(result.encouragement, 14, colors.text, true, 'center');
      yPosition += 20;
    }

    // Promessa de Receitas
    if (result.promise) {
      addSectionTitle('🍽️ Receitas Exclusivas!', '');
      addText(result.promise, 12, colors.text, false, 'center');
      yPosition += 20;
    }

    // ===== PÁGINA 5: INSTALAÇÃO E VIRALIZAÇÃO =====
    doc.addPage();
    yPosition = 20;
    
    // Header da página
    addGradientBackground(0, 0, pageWidth, 30, colors.amber, colors.green);
    doc.setFontSize(18);
    doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
    doc.setFont('helvetica', 'bold');
    doc.text('📱 Instale Nosso App + Compartilhe com Amigas!', pageWidth / 2, 20, { align: 'center' });
    
    yPosition = 40;

    // Instruções de instalação
    addSectionTitle('🚀 Como Instalar o App', '');
    
    const installSteps = [
      '1. Acesse: meuportalfit.com',
      '2. Clique em "Instalar App" no seu celular',
      '3. Adicione à tela inicial',
      '4. Acesse receitas, produtos e Coach 24/7'
    ];
    
    addStyledList(installSteps, '📱', colors.blue);

    // Contatos reais apenas
    addSectionTitle('📞 Entre em Contato', '');
    
    const contacts = [
      'WhatsApp: (786) 253-5032',
      'Website: meuportalfit.com'
    ];
    
    addStyledList(contacts, '📞', colors.green);

    // Call-to-action para viralização
    addCTA(
      '💝 Compartilhe com uma Amiga Brasileira!',
      'Ajude outra brasileira nos EUA a transformar sua vida • Link direto para instalação • Experiência completa',
      'Compartilhar Agora',
      colors.amber,
      '💝 Viral'
    );

    // Footer final com informações essenciais
    yPosition = pageHeight - 40;
    addGradientBackground(0, yPosition, pageWidth, 40, colors.green, colors.blue);
    
    doc.setFontSize(12);
    doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
    doc.setFont('helvetica', 'bold');
    doc.text('MeuPortalFit - Saúde dos Brasileiros nos EUA', pageWidth / 2, yPosition + 15, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
    doc.setFont('helvetica', 'normal');
    doc.text('meuportalfit.com | WhatsApp: (786) 253-5032', pageWidth / 2, yPosition + 25, { align: 'center' });

    // Gerar PDF
    const pdfBuffer = doc.output('arraybuffer');
    
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="MeuPlanoPersonalizado-${userName}.pdf"`,
      },
    });

  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}