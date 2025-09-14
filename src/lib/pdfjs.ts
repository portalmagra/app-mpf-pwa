// Gerar miniatura do PDF usando Google Drive Viewer
export function generatePDFThumbnail(pdfUrl: string): string {
  // Converter URL do Google Drive para formato de visualização
  let viewerUrl = pdfUrl
  
  // Se for URL do Google Drive, converter para formato de visualização
  if (pdfUrl.includes('drive.google.com')) {
    // Extrair o ID do arquivo
    const fileIdMatch = pdfUrl.match(/\/file\/d\/([a-zA-Z0-9-_]+)/)
    if (fileIdMatch) {
      const fileId = fileIdMatch[1]
      // Usar Google Drive Viewer para gerar miniatura
      viewerUrl = `https://drive.google.com/thumbnail?id=${fileId}&sz=w400-h600`
    }
  }
  
  return viewerUrl
}

// Função alternativa usando PDF.js (mantida como backup)
export async function extractImageFromPDF(pdfUrl: string, pageNumber: number = 1, scale: number = 2.0): Promise<string> {
  // Verificar se estamos no lado do cliente
  if (typeof window === 'undefined') {
    throw new Error('PDF extraction only works on the client side')
  }

  try {
    // Usar PDF.js via CDN para evitar problemas de build
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.min.js'
    
    return new Promise((resolve, reject) => {
      script.onload = async () => {
        try {
          // @ts-expect-error - PDF.js está disponível globalmente via CDN
          const pdfjsLib = window.pdfjsLib
          
          // Configurar worker
          pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js'
          
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
            viewport: viewport
          }).promise
          
          // Converter canvas para blob e criar URL
          canvas.toBlob((blob) => {
            if (blob) {
              const imageUrl = URL.createObjectURL(blob)
              resolve(imageUrl)
            } else {
              reject(new Error('Erro ao converter canvas para blob'))
            }
          }, 'image/jpeg', 0.8)
          
        } catch (error) {
          console.error('Erro ao extrair imagem do PDF:', error)
          reject(error)
        }
      }
      
      script.onerror = () => {
        reject(new Error('Erro ao carregar PDF.js'))
      }
      
      document.head.appendChild(script)
    })
    
  } catch (error) {
    console.error('Erro ao extrair imagem do PDF:', error)
    throw error
  }
}
