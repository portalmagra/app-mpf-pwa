// PDF.js só funciona no lado do cliente
export async function extractImageFromPDF(pdfUrl: string, pageNumber: number = 1, scale: number = 2.0): Promise<string> {
  // Verificar se estamos no lado do cliente
  if (typeof window === 'undefined') {
    throw new Error('PDF extraction only works on the client side')
  }

  try {
    // Importar PDF.js dinamicamente apenas no cliente
    const pdfjsLib = await import('pdfjs-dist')
    
    // Configurar worker do PDF.js
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`
    
    // Carregar o PDF
    const pdf = await pdfjsLib.getDocument(pdfUrl).promise
    
    // Pegar a página especificada
    const page = await pdf.getPage(pageNumber)
    
    // Configurar o viewport
    const viewport = page.getViewport({ scale })
    
    // Criar canvas
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    
    if (!context) {
      throw new Error('Não foi possível criar contexto do canvas')
    }
    
    canvas.height = viewport.height
    canvas.width = viewport.width
    
    // Renderizar a página no canvas
    await page.render({
      canvasContext: context,
      viewport: viewport,
      canvas: canvas
    }).promise
    
    // Converter canvas para blob e criar URL
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          const imageUrl = URL.createObjectURL(blob)
          resolve(imageUrl)
        } else {
          reject(new Error('Erro ao converter canvas para blob'))
        }
      }, 'image/jpeg', 0.8)
    })
    
  } catch (error) {
    console.error('Erro ao extrair imagem do PDF:', error)
    throw error
  }
}
