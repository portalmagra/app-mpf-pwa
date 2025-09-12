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

    // Cores atualizadas com gradientes e paleta brasileira
    const colors = {
      // Gradientes principais
      green: [16, 185, 129], // #10b981 - brand-green
      greenDark: [5, 150, 105], // #059669 - brand-greenDark
      greenSoft: [240, 253, 244], // #f0fdf4 - brand-greenSoft
      blue: [59, 130, 246], // #3b82f6 - brand-blue
      blueDark: [29, 78, 216], // #1d4ed8 - brand-blueDark
      blueSoft: [239, 246, 255], // #eff6ff - brand-blueSoft
      blueLight: [96, 165, 250], // #60a5fa - brand-blueLight
      amber: [245, 158, 11], // #f59e0b - brand-amber
      amberDark: [217, 119, 6], // #d97706 - brand-amberDark
      amberSoft: [254, 243, 199], // #fef3c7 - brand-amberSoft
      purple: [124, 58, 237], // #7c3aed - brand-purple
      purpleDark: [109, 40, 217], // #6d28d9 - brand-purpleDark
      // Neutros
      cream: [248, 250, 252], // #f8fafc - brand-cream
      text: [31, 41, 55], // #1f2937 - brand-text
      text2: [107, 114, 128], // #6b7280 - brand-text2
      border: [229, 231, 235], // #e5e7eb - brand-border
      success: [16, 185, 129], // #10b981 - brand-success
      white: [255, 255, 255],
      black: [0, 0, 0]
    };

    // Função para criar gradiente (simulado com múltiplas linhas)
    const addGradientBackground = (x: number, y: number, width: number, height: number, color1: number[], color2: number[]) => {
      const steps = 20;
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

    // Função para adicionar texto com estilo
    const addText = (text: string, fontSize: number, color: number[] = colors.text, isBold: boolean = false, align: string = 'left') => {
      doc.setFontSize(fontSize);
      doc.setTextColor(color[0], color[1], color[2]);
      if (isBold) {
        doc.setFont('helvetica', 'bold');
      } else {
        doc.setFont('helvetica', 'normal');
      }
      
      const lines = doc.splitTextToSize(text, contentWidth);
      const xPos = align === 'center' ? pageWidth / 2 : margin;
      doc.text(lines, xPos, yPosition, { align });
      yPosition += lines.length * (fontSize * 0.4) + 5;
    };

    // Função para adicionar título de seção com estilo
    const addSectionTitle = (title: string, icon: string, bgColor: number[] = colors.greenSoft) => {
      if (yPosition > pageHeight - 50) {
        doc.addPage();
        yPosition = 20;
      }
      
      yPosition += 15;
      
      // Background da seção
      doc.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
      doc.roundedRect(margin, yPosition - 8, contentWidth, 25, 3, 3, 'F');
      
      // Título com ícone
      doc.setFontSize(16);
      doc.setTextColor(colors.green[0], colors.green[1], colors.green[2]);
      doc.setFont('helvetica', 'bold');
      doc.text(`${icon} ${title}`, margin + 10, yPosition + 5);
      
      yPosition += 20;
    };

    // Função para adicionar card de produto
    const addProductCard = (product: { name: string; price: string; description: string; url: string }) => {
      if (yPosition > pageHeight - 60) {
        doc.addPage();
        yPosition = 20;
      }
      
      const cardWidth = contentWidth / 2 - 5;
      const cardHeight = 40;
      const xPos = margin + (index % 2) * (cardWidth + 10);
      
      // Background do card
      doc.setFillColor(colors.white[0], colors.white[1], colors.white[2]);
      doc.setDrawColor(colors.border[0], colors.border[1], colors.border[2]);
      doc.roundedRect(xPos, yPosition, cardWidth, cardHeight, 5, 5, 'FD');
      
      // Título do produto
      doc.setFontSize(12);
      doc.setTextColor(colors.green[0], colors.green[1], colors.green[2]);
      doc.setFont('helvetica', 'bold');
      doc.text(product.name, xPos + 8, yPosition + 8);
      
      // Preço destacado
      doc.setFontSize(14);
      doc.setTextColor(colors.amber[0], colors.amber[1], colors.amber[2]);
      doc.setFont('helvetica', 'bold');
      doc.text(product.price, xPos + 8, yPosition + 20);
      
      // Link Amazon
      doc.setFontSize(8);
      doc.setTextColor(colors.blue[0], colors.blue[1], colors.blue[2]);
      doc.setFont('helvetica', 'normal');
      doc.text('🛒 Comprar na Amazon', xPos + 8, yPosition + 32);
      
      if (index % 2 === 1) {
        yPosition += cardHeight + 10;
      }
    };

    // Função para adicionar lista com estilo
    const addStyledList = (items: string[], bullet: string = '✅', color: number[] = colors.text) => {
      items.forEach((item, index) => {
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

    // Função para adicionar call-to-action destacado
    const addCTA = (title: string, description: string, buttonText: string, bgColor: number[] = colors.blue) => {
      if (yPosition > pageHeight - 50) {
        doc.addPage();
        yPosition = 20;
      }
      
      yPosition += 10;
      
      // Background do CTA
      doc.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
      doc.roundedRect(margin, yPosition, contentWidth, 35, 8, 8, 'F');
      
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
      
      // Botão simulado
      doc.setFillColor(colors.white[0], colors.white[1], colors.white[2]);
      doc.roundedRect(margin + contentWidth - 80, yPosition + 8, 70, 18, 3, 3, 'F');
      
      doc.setFontSize(10);
      doc.setTextColor(bgColor[0], bgColor[1], bgColor[2]);
      doc.setFont('helvetica', 'bold');
      doc.text(buttonText, margin + contentWidth - 45, yPosition + 19, { align: 'center' });
      
      yPosition += 40;
    };

    // ===== PÁGINA 1: COVER ESPETACULAR =====
    
    // Background com gradiente brasileiro
    addGradientBackground(0, 0, pageWidth, pageHeight, colors.green, colors.blue);
    
    // Logo/Header centralizado
    doc.setFontSize(28);
    doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
    doc.setFont('helvetica', 'bold');
    doc.text('MeuPortalFit', pageWidth / 2, 40, { align: 'center' });
    
    // Subtitle
    doc.setFontSize(14);
    doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
    doc.setFont('helvetica', 'normal');
    doc.text('🇧🇷 Para Brasileiros nos Estados Unidos 🇺🇸', pageWidth / 2, 50, { align: 'center' });
    
    // Título principal com destaque
    doc.setFontSize(24);
    doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
    doc.setFont('helvetica', 'bold');
    doc.text(`🎉 ${result.title}`, pageWidth / 2, 80, { align: 'center' });
    
    // Nome personalizado
    doc.setFontSize(20);
    doc.setTextColor(colors.amberSoft[0], colors.amberSoft[1], colors.amberSoft[2]);
    doc.setFont('helvetica', 'bold');
    doc.text(`Plano Personalizado para ${userName}`, pageWidth / 2, 100, { align: 'center' });
    
    // Descrição
    doc.setFontSize(12);
    doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
    doc.setFont('helvetica', 'normal');
    doc.text(result.description, pageWidth / 2, 120, { align: 'center' });
    
    // QR Code simulado (placeholder)
    doc.setFillColor(colors.white[0], colors.white[1], colors.white[2]);
    doc.roundedRect(pageWidth / 2 - 30, 140, 60, 60, 5, 5, 'F');
    
    doc.setFontSize(8);
    doc.setTextColor(colors.green[0], colors.green[1], colors.green[2]);
    doc.text('📱 Instalar App', pageWidth / 2, 200, { align: 'center' });
    doc.text('app.meuportalfit.com', pageWidth / 2, 205, { align: 'center' });
    
    // ===== PÁGINA 2: ANÁLISE PERSONALIZADA =====
    doc.addPage();
    yPosition = 20;
    
    // Header da página
    addGradientBackground(0, 0, pageWidth, 30, colors.green, colors.blue);
    doc.setFontSize(18);
    doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
    doc.setFont('helvetica', 'bold');
    doc.text('📊 Sua Análise Personalizada', pageWidth / 2, 20, { align: 'center' });
    
    yPosition = 40;

    // Recomendações Personalizadas
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
    doc.text('✅ Seu Plano de Ação', pageWidth / 2, 20, { align: 'center' });
    
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

    // Produtos Amazon em cards
    if (result.amazonProducts && result.amazonProducts.length > 0) {
      addSectionTitle('🛒 Produtos Recomendados', '');
      
      result.amazonProducts.forEach((product: { name: string; price: string; description: string; url: string }) => {
        addProductCard(product, index);
      });
      
      yPosition += 20;
    }

    // ===== PÁGINA 4: OFERTAS E CALL-TO-ACTIONS =====
    doc.addPage();
    yPosition = 20;
    
    // Header da página
    addGradientBackground(0, 0, pageWidth, 30, colors.purple, colors.amber);
    doc.setFontSize(18);
    doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
    doc.setFont('helvetica', 'bold');
    doc.text('🎁 Ofertas Exclusivas para Você!', pageWidth / 2, 20, { align: 'center' });
    
    yPosition = 40;

    // CTA Coach Brasileira
    addCTA(
      '👩‍💻 Coach Brasileira Especializada',
      'Converse com uma Coach Brasileira especializada • Análise personalizada • Plano de 30 dias • Suporte via WhatsApp',
      'Falar Agora',
      colors.blue
    );

    // CTA Receitas
    addCTA(
      '🍽️ Receitas Brasileiras Exclusivas',
      'Receba receitas adaptadas para os EUA • Feijoada light • Pão de açúcar saudável • Brigadeiro fit',
      'Ver Receitas',
      colors.green
    );

    // CTA Comunidade
    addCTA(
      '👥 Comunidade de Brasileiras nos EUA',
      'Conecte-se com outras brasileiras • Grupo exclusivo WhatsApp • Dicas diárias • Suporte emocional',
      'Entrar Agora',
      colors.purple
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

    // ===== PÁGINA 5: INSTALAÇÃO E CONTATO =====
    doc.addPage();
    yPosition = 20;
    
    // Header da página
    addGradientBackground(0, 0, pageWidth, 30, colors.amber, colors.green);
    doc.setFontSize(18);
    doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
    doc.setFont('helvetica', 'bold');
    doc.text('📱 Instale Nosso App Agora!', pageWidth / 2, 20, { align: 'center' });
    
    yPosition = 40;

    // Instruções de instalação
    addSectionTitle('🚀 Como Instalar o App', '');
    
    const installSteps = [
      '1. Acesse: app.meuportalfit.com',
      '2. Clique em "Instalar App" no seu celular',
      '3. Adicione à tela inicial',
      '4. Acesse receitas, produtos e Coach 24/7'
    ];
    
    addStyledList(installSteps, '📱', colors.blue);

    // Contatos
    addSectionTitle('📞 Entre em Contato', '');
    
    const contacts = [
      'WhatsApp: (786) 253-5032',
      'Website: app.meuportalfit.com',
      'Email: contato@meuportalfit.com',
      'Horário: 9h às 18h (EST)'
    ];
    
    addStyledList(contacts, '📞', colors.green);

    // Footer final
    yPosition = pageHeight - 40;
    addGradientBackground(0, yPosition, pageWidth, 40, colors.green, colors.blue);
    
    doc.setFontSize(12);
    doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
    doc.setFont('helvetica', 'bold');
    doc.text('MeuPortalFit - Saúde dos Brasileiros nos EUA', pageWidth / 2, yPosition + 15, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
    doc.setFont('helvetica', 'normal');
    doc.text('app.meuportalfit.com | WhatsApp: (786) 253-5032', pageWidth / 2, yPosition + 25, { align: 'center' });

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