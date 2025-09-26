const fs = require('fs');
const path = require('path');
const { PDFDocument } = require('pdf-lib');

async function combineAllProtocols() {
  try {
    console.log('🔄 Combinando todos os protocolos em um único PDF...\n');

    const protocolosDir = path.join(__dirname, '..', 'protocolos');
    const outputPath = path.join(protocolosDir, 'PACOTE-COMPLETO-TODOS-PROTOCOLOS.pdf');

    // Lista dos protocolos na ordem correta
    const protocolos = [
      'PROTOCOLO SUPORTE COM AS CANETAS EMAGRECEDORAS.pdf',
      'PROTOCOLO-PRE-CANETA.pdf',
      'PROTOCOLO-POS-CANETA-MANUTENCAO.pdf',
      'PROTOCOLO-PROTEINA-and-MASSA-MAGRA.pdf',
      'PROTOCOLO-INTESTINO-LIVRE.pdf',
      'PROTOCOLO-NAUSEA-and-REFLUXO.pdf',
      'PROTOCOLO-ENERGIA-E-IMUNIDADE.pdf',
      'PROTOCOLO-IMUNIDADE-AVANCADA.pdf',
      'PROTOCOLO-DETOX-LEVE.pdf',
      'PROTOCOLO-ANTI-INFLAMATORIO.pdf',
      'PROTOCOLO-MULHERES-40.pdf',
      'PROTOCOLO-PELE-CABELO-and-UNHAS.pdf',
      'PROTOCOLO-SONO-and-ANSIEDADE.pdf',
      'PROTOCOLO-FITNESS-and-PERFORMANCE.pdf',
      'PROTOCOLO ALTERNATIVA SEM CANETA.pdf'
    ];

    // Criar novo documento PDF
    const combinedPdf = await PDFDocument.create();

    let totalPages = 0;
    let processedFiles = 0;

    for (const fileName of protocolos) {
      const filePath = path.join(protocolosDir, fileName);
      
      if (!fs.existsSync(filePath)) {
        console.log(`⚠️ Arquivo não encontrado: ${fileName}`);
        continue;
      }

      try {
        console.log(`📄 Processando: ${fileName}`);
        
        // Ler o arquivo PDF
        const pdfBytes = fs.readFileSync(filePath);
        const pdf = await PDFDocument.load(pdfBytes);
        
        // Copiar todas as páginas
        const pages = await combinedPdf.copyPages(pdf, pdf.getPageIndices());
        
        // Adicionar páginas ao documento combinado
        for (const page of pages) {
          combinedPdf.addPage(page);
        }
        
        totalPages += pdf.getPageCount();
        processedFiles++;
        
        console.log(`✅ Adicionado: ${pdf.getPageCount()} páginas`);
        
      } catch (error) {
        console.error(`❌ Erro ao processar ${fileName}:`, error.message);
      }
    }

    if (processedFiles === 0) {
      console.log('❌ Nenhum arquivo foi processado com sucesso');
      return;
    }

    // Salvar o PDF combinado
    const combinedPdfBytes = await combinedPdf.save();
    fs.writeFileSync(outputPath, combinedPdfBytes);

    console.log('\n🎉 PDF combinado criado com sucesso!');
    console.log(`📁 Local: ${outputPath}`);
    console.log(`📊 Estatísticas:`);
    console.log(`   - Arquivos processados: ${processedFiles}/${protocolos.length}`);
    console.log(`   - Total de páginas: ${totalPages}`);
    console.log(`   - Tamanho do arquivo: ${(combinedPdfBytes.length / 1024 / 1024).toFixed(2)} MB`);

    console.log('\n📤 Próximos passos:');
    console.log('1. Faça upload do arquivo para o Supabase Storage');
    console.log('2. Ou use a API de combinação dinâmica (já implementada)');

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

// Verificar se pdf-lib está instalado
try {
  require('pdf-lib');
  combineAllProtocols().catch(console.error);
} catch (error) {
  console.log('📦 Instalando pdf-lib...');
  const { execSync } = require('child_process');
  try {
    execSync('npm install pdf-lib', { stdio: 'inherit' });
    console.log('✅ pdf-lib instalado com sucesso!');
    combineAllProtocols().catch(console.error);
  } catch (installError) {
    console.error('❌ Erro ao instalar pdf-lib:', installError.message);
    console.log('\n💡 Execute manualmente: npm install pdf-lib');
  }
}
