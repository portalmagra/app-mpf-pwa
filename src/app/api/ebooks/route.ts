import { NextResponse } from 'next/server'
import { ebookService } from '@/lib/supabase'

export async function GET() {
  try {
    console.log('🔄 API eBooks: Buscando eBooks ativos...')
    const ebooks = await ebookService.getActiveEbooks()
    return NextResponse.json({ success: true, data: ebooks })
  } catch (error) {
    console.error('❌ Erro ao buscar eBooks:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar eBooks' },
      { status: 500 }
    )
  }
}
