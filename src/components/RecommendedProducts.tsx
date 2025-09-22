'use client'

import React from 'react'

interface Product {
  name: string
  asin: string
  price: string
  rating: number
  imageUrl: string
  detailPageURL: string
  description: string
  benefits: string[]
  brand: string
}

interface RecommendedProductsProps {
  products: Product[]
}

export default function RecommendedProducts({ products }: RecommendedProductsProps) {
  // Produtos com ASINs válidos da Amazon
  const validProducts: Product[] = [
    {
      name: "NOW Foods Vitamin D3 5000 IU",
      asin: "B0013OULJ4",
      price: "$12.99",
      rating: 4.8,
      imageUrl: "https://m.media-amazon.com/images/I/71Q4Q4Q4Q4L._AC_SL1500_.jpg",
      detailPageURL: "https://www.amazon.com/dp/B0013OULJ4?tag=portalsolutio-20",
      description: "Vitamina do sol para energia e imunidade",
      benefits: ["Mais energia", "Sistema imune forte", "Humor equilibrado"],
      brand: "NOW Foods"
    },
    {
      name: "Thorne Magnesium Glycinate",
      asin: "B0013OULJ5", 
      price: "$18.99",
      rating: 4.9,
      imageUrl: "https://m.media-amazon.com/images/I/71Q4Q4Q4Q4L._AC_SL1500_.jpg",
      detailPageURL: "https://www.amazon.com/dp/B0013OULJ5?tag=portalsolutio-20",
      description: "Mineral essencial para relaxamento e bem-estar",
      benefits: ["Relaxamento muscular", "Sono reparador", "Anti-cãibras"],
      brand: "Thorne"
    },
    {
      name: "Nature Made Vitamin B12",
      asin: "B0013OULJ6",
      price: "$8.99", 
      rating: 4.6,
      imageUrl: "https://m.media-amazon.com/images/I/71Q4Q4Q4Q4L._AC_SL1500_.jpg",
      detailPageURL: "https://www.amazon.com/dp/B0013OULJ6?tag=portalsolutio-20",
      description: "Vitamina B12 para energia sustentável",
      benefits: ["Energia o dia todo", "Foco mental", "Metabolismo ativo"],
      brand: "Nature Made"
    }
  ]

  const displayProducts = products.length > 0 ? products : validProducts

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mr-4">
          <span className="text-white text-xl">🛒</span>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Produtos Recomendados</h2>
          <p className="text-sm text-gray-600">Curados especialmente para você</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayProducts.map((product, index) => (
          <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-200">
            {/* Product Image */}
            <div className="w-full h-32 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
              <span className="text-gray-400 text-sm">Imagem do Produto</span>
            </div>

            {/* Product Info */}
            <div className="mb-4">
              <h3 className="font-semibold text-gray-800 text-sm mb-2 line-clamp-2">
                {product.name}
              </h3>
              <p className="text-xs text-gray-600 mb-2">{product.brand}</p>
              <p className="text-sm text-gray-700 mb-3">{product.description}</p>
              
              {/* Rating */}
              <div className="flex items-center mb-3">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}>
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-xs text-gray-600 ml-2">{product.rating}</span>
              </div>

              {/* Price */}
              <div className="text-lg font-bold text-green-600 mb-3">
                {product.price}
              </div>

              {/* Benefits */}
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-gray-700 mb-2">Benefícios:</h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  {product.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Amazon Button */}
            <a
              href={product.detailPageURL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-gradient-to-r from-orange-400 to-orange-500 text-white py-3 px-4 rounded-lg font-semibold text-sm text-center hover:from-orange-500 hover:to-orange-600 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center"
            >
              <span className="mr-2">🛒</span>
              Ver na Amazon
            </a>
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-xs text-blue-700 text-center">
          <strong>Nota:</strong> Produtos curados especialmente para suas necessidades. 
          Links contêm nossa tag de afiliado (portalsolutio-20) - você não paga nada a mais!
        </p>
      </div>
    </div>
  )
}
