import { NextRequest, NextResponse } from 'next/server'
import { productService, categoryService } from '@/lib/supabase'
import fs from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Iniciando sincronização com MeuPortalFit...')

    // Verificar se os arquivos de dados existem
    const dataDir = path.join(process.cwd(), 'data')
    const productsFile = path.join(dataDir, 'products.json')
    const categoriesFile = path.join(dataDir, 'categories.json')

    if (!fs.existsSync(productsFile) || !fs.existsSync(categoriesFile)) {
      return NextResponse.json(
        { 
          error: 'Arquivos de dados não encontrados. Execute primeiro o script sync-meuportalfit.js' 
        },
        { status: 404 }
      )
    }

    // Ler dados dos arquivos
    const productsData = JSON.parse(fs.readFileSync(productsFile, 'utf8'))
    const categoriesData = JSON.parse(fs.readFileSync(categoriesFile, 'utf8'))

    console.log(`📊 Dados encontrados: ${productsData.length} produtos, ${categoriesData.length} categorias`)

    // Sincronizar categorias primeiro
    let categoriesSynced = 0
    for (const category of categoriesData) {
      try {
        // Verificar se a categoria já existe
        const existingCategory = await categoryService.getCategoryById(category.id)
        
        if (!existingCategory) {
          // Criar nova categoria
          const success = await categoryService.createCategory(category)
          if (success) {
            categoriesSynced++
            console.log(`✅ Categoria criada: ${category.name}`)
          }
        } else {
          // Atualizar categoria existente
          const success = await categoryService.updateCategory(category.id, category)
          if (success) {
            categoriesSynced++
            console.log(`🔄 Categoria atualizada: ${category.name}`)
          }
        }
      } catch (error) {
        console.error(`❌ Erro ao sincronizar categoria ${category.name}:`, error)
      }
    }

    // Sincronizar produtos
    let productsSynced = 0
    let mercadoProducts = 0
    
    for (const product of productsData) {
      try {
        // Verificar se o produto já existe
        const existingProduct = await productService.getProductById(product.id)
        
        if (!existingProduct) {
          // Criar novo produto
          const success = await productService.createProduct(product)
          if (success) {
            productsSynced++
            if (product.is_mentoria) mercadoProducts++
            console.log(`✅ Produto criado: ${product.name}`)
          }
        } else {
          // Atualizar produto existente
          const success = await productService.updateProduct(product.id, product)
          if (success) {
            productsSynced++
            if (product.is_mentoria) mercadoProducts++
            console.log(`🔄 Produto atualizado: ${product.name}`)
          }
        }
      } catch (error) {
        console.error(`❌ Erro ao sincronizar produto ${product.name}:`, error)
      }
    }

    // Estatísticas finais
    const stats = {
      categories: {
        total: categoriesData.length,
        synced: categoriesSynced
      },
      products: {
        total: productsData.length,
        synced: productsSynced,
        mercado: mercadoProducts
      }
    }

    console.log('✅ Sincronização concluída:', stats)

    return NextResponse.json({
      success: true,
      message: 'Sincronização concluída com sucesso!',
      stats
    })

  } catch (error) {
    console.error('❌ Erro durante a sincronização:', error)
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor durante a sincronização',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verificar status da sincronização
    const dataDir = path.join(process.cwd(), 'data')
    const productsFile = path.join(dataDir, 'products.json')
    const categoriesFile = path.join(dataDir, 'categories.json')

    const hasDataFiles = fs.existsSync(productsFile) && fs.existsSync(categoriesFile)
    
    let dataStats = null
    if (hasDataFiles) {
      const productsData = JSON.parse(fs.readFileSync(productsFile, 'utf8'))
      const categoriesData = JSON.parse(fs.readFileSync(categoriesFile, 'utf8'))
      
      dataStats = {
        products: productsData.length,
        categories: categoriesData.length,
        mercadoProducts: productsData.filter((p: any) => p.is_mentoria).length
      }
    }

    return NextResponse.json({
      hasDataFiles,
      dataStats,
      message: hasDataFiles 
        ? 'Arquivos de dados encontrados. Use POST para sincronizar.' 
        : 'Arquivos de dados não encontrados. Execute primeiro o script sync-meuportalfit.js'
    })

  } catch (error) {
    console.error('❌ Erro ao verificar status:', error)
    return NextResponse.json(
      { error: 'Erro ao verificar status da sincronização' },
      { status: 500 }
    )
  }
}
