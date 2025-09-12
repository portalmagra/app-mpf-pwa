import { NextRequest, NextResponse } from 'next/server';
import jsPDF from 'jspdf';

export async function POST(request: NextRequest) {
  try {
    const { userName, result } = await request.json();

    // Criar PDF
    const doc = new jsPDF();
    
    // Configurações
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPosition = 20;
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);

    // Cores (aproximadas para PDF)
    const colors = {
      green: [22, 107, 57], // brand-green
      blue: [59, 130, 246], // brand-blue
      amber: [245, 158, 11], // brand-amber
      gray: [107, 114, 128], // brand-text2
      darkGray: [31, 41, 55] // brand-text
    };

    // Função para adicionar texto com quebra de linha
    const addText = (text: string, fontSize: number, color: number[] = colors.darkGray, isBold: boolean = false) => {
      doc.setFontSize(fontSize);
      doc.setTextColor(color[0], color[1], color[2]);
      if (isBold) {
        doc.setFont('helvetica', 'bold');
      } else {
        doc.setFont('helvetica', 'normal');
      }
      
      const lines = doc.splitTextToSize(text, contentWidth);
      doc.text(lines, margin, yPosition);
      yPosition += lines.length * (fontSize * 0.4) + 5;
    };

    // Função para adicionar título de seção
    const addSectionTitle = (title: string, icon: string) => {
      if (yPosition > pageHeight - 40) {
        doc.addPage();
        yPosition = 20;
      }
      
      yPosition += 10;
      addText(`${icon} ${title}`, 14, colors.green, true);
      yPosition += 5;
    };

    // Função para adicionar lista
    const addList = (items: string[], bullet: string = '•') => {
      items.forEach(item => {
        if (yPosition > pageHeight - 30) {
          doc.addPage();
          yPosition = 20;
        }
        addText(`${bullet} ${item}`, 10, colors.darkGray);
      });
    };

    // Header profissional
    doc.setFillColor(colors.green[0], colors.green[1], colors.green[2]);
    doc.rect(0, 0, pageWidth, 35, 'F');
    
    // Logo/Title
    doc.setFontSize(18);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text('MeuPortalFit', margin, 20);
    
    // Subtitle
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'normal');
    doc.text('Saúde dos Brasileiros nos EUA', margin, 28);
    
    yPosition = 45;

    // Título principal
    addText(result.title, 18, colors.green, true);
    yPosition += 10;

    // Descrição
    addText(result.description, 12, colors.gray);
    yPosition += 15;

    // Recomendações Personalizadas
    if (result.personalizedRecommendations) {
      addSectionTitle('Recomendações Personalizadas', '🎯');
      addList(result.personalizedRecommendations, '✅');
      yPosition += 10;
    }

    // Áreas de Prioridade
    if (result.priorityAreas) {
      addSectionTitle('Áreas de Prioridade', '⭐');
      addList(result.priorityAreas, '→');
      yPosition += 10;
    }

    // Fatores de Risco
    if (result.riskFactors) {
      addSectionTitle('Fatores de Risco', '⚠️');
      addList(result.riskFactors, '!');
      yPosition += 10;
    }

    // Novos Hábitos
    if (result.newHabits) {
      addSectionTitle('Checklist de Hábitos para Você', '✔');
      addList(result.newHabits, '✅');
      yPosition += 10;
    }

    // Próximos Passos
    if (result.nextSteps) {
      addSectionTitle('Próximos Passos', '🚀');
      addList(result.nextSteps, '→');
      yPosition += 10;
    }

    // Produtos Amazon
    if (result.amazonProducts && result.amazonProducts.length > 0) {
      addSectionTitle('Produtos Recomendados', '🛒');
      
      result.amazonProducts.forEach((product: { name: string; price: string; description: string; url: string }) => {
        if (yPosition > pageHeight - 50) {
          doc.addPage();
          yPosition = 20;
        }
        
        addText(product.name, 12, colors.green, true);
        addText(product.description || '', 10, colors.gray);
        addText(`Preço: ${product.price}`, 10, colors.amber, true);
        addText(`Link: ${product.url}`, 8, colors.blue);
        yPosition += 10;
      });
    }

    // Mensagem de Encorajamento
    if (result.encouragement) {
      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = 20;
      }
      
      yPosition += 10;
      addText('💪 Mensagem de Encorajamento', 14, colors.green, true);
      addText(result.encouragement, 12, colors.gray);
    }

    // Promessa de Receitas
    if (result.promise) {
      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = 20;
      }
      
      yPosition += 10;
      addText('🍽️ Receitas Exclusivas!', 14, colors.amber, true);
      addText(result.promise, 12, colors.gray);
    }

    // Promoções Extras
    if (yPosition > pageHeight - 80) {
      doc.addPage();
      yPosition = 20;
    }
    
    yPosition += 15;
    addSectionTitle('🎁 Ofertas Exclusivas para Você!', '');
    
    // Oferta Coach
    addText('👩‍💻 Coach Brasileira Especializada', 12, colors.blue, true);
    addText('Converse com uma Coach Brasileira especializada em adaptação nos EUA', 10, colors.gray);
    addText('• Análise personalizada do seu caso', 9, colors.darkGray);
    addText('• Plano de 30 dias customizado', 9, colors.darkGray);
    addText('• Suporte via WhatsApp', 9, colors.darkGray);
    addText('• Resposta em até 2 horas', 9, colors.darkGray);
    addText('WhatsApp: (786) 253-5032', 10, colors.amber, true);
    yPosition += 10;
    
    // Oferta Receitas
    addText('🍽️ Receitas Brasileiras Exclusivas', 12, colors.green, true);
    addText('Receba receitas adaptadas para os EUA com ingredientes locais', 10, colors.gray);
    addText('• Feijoada light com ingredientes americanos', 9, colors.darkGray);
    addText('• Pão de açúcar saudável', 9, colors.darkGray);
    addText('• Brigadeiro fit com proteína', 9, colors.darkGray);
    addText('• Dicas de onde comprar ingredientes brasileiros', 9, colors.darkGray);
    yPosition += 10;
    
    // Oferta Comunidade
    addText('👥 Comunidade de Brasileiras nos EUA', 12, colors.purple, true);
    addText('Conecte-se com outras brasileiras na mesma jornada', 10, colors.gray);
    addText('• Grupo exclusivo no WhatsApp', 9, colors.darkGray);
    addText('• Dicas diárias de adaptação', 9, colors.darkGray);
    addText('• Suporte emocional e prático', 9, colors.darkGray);
    addText('• Eventos e encontros virtuais', 9, colors.darkGray);
    yPosition += 10;
    
    // Call to Action Final
    addText('🚀 Próximos Passos:', 12, colors.green, true);
    addText('1. Implemente os hábitos do seu plano', 10, colors.darkGray);
    addText('2. Entre em contato com nossa Coach', 10, colors.darkGray);
    addText('3. Junte-se à nossa comunidade', 10, colors.darkGray);
    addText('4. Compartilhe com outras brasileiras', 10, colors.darkGray);
    
    // Footer
    const footerY = pageHeight - 20;
    doc.setFontSize(8);
    doc.setTextColor(colors.gray[0], colors.gray[1], colors.gray[2]);
    doc.text('MeuPortalFit - Saúde dos Brasileiros nos EUA', margin, footerY);
    doc.text('www.meuportalfit.com | WhatsApp: (786) 253-5032', pageWidth - margin - 80, footerY);

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
