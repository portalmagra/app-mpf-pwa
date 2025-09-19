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
      // Tentar diferentes métodos para obter thumbnail
      // Método 1: Google Drive thumbnail
      viewerUrl = `https://drive.google.com/thumbnail?id=${fileId}&sz=w400-h600`
    }
  }
  
  return viewerUrl
}

// Função para testar se a imagem carrega e tentar métodos alternativos
export async function getPDFThumbnailWithFallback(pdfUrl: string): Promise<string> {
  if (!pdfUrl.includes('drive.google.com')) {
    return pdfUrl
  }

  const fileIdMatch = pdfUrl.match(/\/file\/d\/([a-zA-Z0-9-_]+)/)
  if (!fileIdMatch) {
    return pdfUrl
  }

  const fileId = fileIdMatch[1]
  
  // Lista de métodos para tentar
  const methods = [
    `https://drive.google.com/thumbnail?id=${fileId}&sz=w400-h600`,
    `https://lh3.googleusercontent.com/d/${fileId}=w400-h600`,
    `https://drive.google.com/thumbnail?id=${fileId}&sz=w400`,
    `https://drive.google.com/file/d/${fileId}/preview`
  ]

  // Testar cada método
  for (const method of methods) {
    try {
      const response = await fetch(method, { method: 'HEAD' })
      if (response.ok) {
        return method
      }
    } catch (error) {
      console.log(`Método ${method} falhou:`, error)
    }
  }

  // Se todos os métodos falharem, retornar o primeiro
  return methods[0]
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
