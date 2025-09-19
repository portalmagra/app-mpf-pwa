/* eslint-disable @typescript-eslint/no-explicit-any */
import * as crypto from 'crypto';

// === Amazon Product Advertising API v5 Configuration ===
const AWS_ACCESS_KEY = process.env.AMAZON_ACCESS_KEY_ID!;
const AWS_SECRET_KEY = process.env.AMAZON_SECRET_ACCESS_KEY!;
const ASSOCIATE_TAG = process.env.AMAZON_ASSOCIATE_TAG || 'portalsolutio-20';
const AWS_REGION = 'us-east-1';
const SERVICE = 'ProductAdvertisingAPI';
const HOST = 'webservices.amazon.com';
const URI = '/paapi5/searchitems';
const ENDPOINT = `https://${HOST}${URI}`;

// Validação de credenciais
const CREDENTIALS_VALID = !!(
  AWS_ACCESS_KEY && 
  AWS_ACCESS_KEY !== 'undefined' && 
  AWS_ACCESS_KEY.length >= 10 &&
  AWS_SECRET_KEY && 
  AWS_SECRET_KEY !== 'undefined' &&
  AWS_SECRET_KEY.length >= 20
);

// === AWS Signature V4 Utility Functions ===
function hmac(key: crypto.BinaryLike | crypto.KeyObject, data: string | Buffer) {
  return crypto.createHmac('sha256', key).update(data).digest();
}

function sha256Hex(data: string | Buffer) {
  return crypto.createHash('sha256').update(data).digest('hex');
}

function getSigningKey(secretKey: string, dateStamp: string, region: string, service: string) {
  const kDate = hmac('AWS4' + secretKey, dateStamp);
  const kRegion = hmac(kDate, region);
  const kService = hmac(kRegion, service);
  const kSigning = hmac(kService, 'aws4_request');
  return kSigning;
}

function buildCanonicalRequest(method: string, uri: string, queryString: string, headers: Record<string, string>, payloadHash: string) {
  const canonicalHeaders = Object.entries(headers)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k.toLowerCase()}:${v}`)
    .join('\n') + '\n';
  
  const signedHeaders = Object.keys(headers).sort().join(';');
  
  return [
    method,
    uri,
    queryString,
    canonicalHeaders,
    signedHeaders,
    payloadHash
  ].join('\n');
}

function buildStringToSign(amzDate: string, dateStamp: string, region: string, service: string, canonicalRequest: string) {
  return [
    'AWS4-HMAC-SHA256',
    amzDate,
    `${dateStamp}/${region}/${service}/aws4_request`,
    sha256Hex(canonicalRequest)
  ].join('\n');
}

function buildAuthHeader(accessKey: string, dateStamp: string, region: string, service: string, signedHeaders: string, signature: string) {
  return `AWS4-HMAC-SHA256 Credential=${accessKey}/${dateStamp}/${region}/${service}/aws4_request, SignedHeaders=${signedHeaders}, Signature=${signature}`;
}

// === Interface para produtos Amazon ===
export interface RealAmazonProduct {
  name: string;
  asin: string;
  price: string;
  rating: number;
  imageUrl: string;
  detailPageURL: string;
  isValid: boolean;
  isBestSeller: boolean;
  isAmazonChoice: boolean;
  reviewCount: number;
  brand?: string;
  ingredients?: string[];
  nutritionalValue?: string;
}

// === Função principal de busca real na Amazon ===
export async function searchRealAmazonProducts(
  query: string, 
  maxResults: number = 3,
  specificProduct: boolean = false
): Promise<RealAmazonProduct[]> {
  
  console.log(`🔍 REAL AMAZON SEARCH: "${query}"`);
  
  if (!CREDENTIALS_VALID) {
    console.log('❌ Amazon credentials invalid');
    throw new Error('Amazon credentials invalid');
  }

  try {
    const now = new Date();
    const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
    const dateStamp = amzDate.slice(0, 8);

    let payloadObj: any;
    let optimizedQuery = query; // Definir para ambos os casos

    // Se é busca específica por ASIN, usar busca direta
    if (specificProduct && query.match(/^[A-Z0-9]{10}$/)) {
      console.log(`🎯 Buscando produto específico por ASIN: ${query}`);
      
      payloadObj = {
        ItemIds: [query], // Busca direta por ASIN
        Resources: [
          'Images.Primary.Large',
          'ItemInfo.Title',
          'ItemInfo.Features',
          'ItemInfo.ProductInfo',
          'ItemInfo.ManufactureInfo',
          'Offers.Listings.Price',
          'BrowseNodeInfo',
          'CustomerReviews'
        ],
        PartnerTag: ASSOCIATE_TAG,
        PartnerType: 'Associates',
        Marketplace: 'www.amazon.com'
      };
    } else {
      // Otimizar query para melhores resultados
      optimizedQuery = query
        .replace(/supplement/gi, '') // Amazon já entende que é suplemento
        .replace(/\s+/g, ' ')
        .trim();

      payloadObj = {
        Keywords: optimizedQuery,
        Resources: [
          'Images.Primary.Large',
          'ItemInfo.Title',
          'ItemInfo.Features',
          'ItemInfo.ProductInfo',
          'ItemInfo.ManufactureInfo',
          'Offers.Listings.Price',
          'BrowseNodeInfo',
          'CustomerReviews'
        ],
        PartnerTag: ASSOCIATE_TAG,
        PartnerType: 'Associates',
        Marketplace: 'www.amazon.com',
        ItemCount: Math.min(maxResults * 5, 20), // Pegar mais para filtrar
        SearchIndex: 'All',
        SortBy: 'AvgCustomerReviews' // Ordenar por reviews primeiro
      };
    }
    
    const payload = JSON.stringify(payloadObj);
    const payloadHash = sha256Hex(payload);

    const headers: Record<string,string> = {
      'content-type': 'application/json; charset=utf-8',
      'host': HOST,
      'x-amz-target': 'com.amazon.paapi5.v1.ProductAdvertisingAPIv1.SearchItems',
      'x-amz-date': amzDate,
      'x-amz-content-sha256': payloadHash,
    };

    const canonicalRequest = buildCanonicalRequest('POST', URI, '', headers, payloadHash);
    const stringToSign = buildStringToSign(amzDate, dateStamp, AWS_REGION, SERVICE, canonicalRequest);
    const signingKey = getSigningKey(AWS_SECRET_KEY, dateStamp, AWS_REGION, SERVICE);
    const signature = crypto.createHmac('sha256', signingKey).update(stringToSign).digest('hex');
    
    const signedHeaders = Object.keys(headers).sort().join(';');
    const authorization = buildAuthHeader(AWS_ACCESS_KEY, dateStamp, AWS_REGION, SERVICE, signedHeaders, signature);

    console.log(`📡 Making REAL Amazon API call...`);
    console.log(`🎯 Query: "${optimizedQuery}" | Max: ${maxResults}`);

    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        ...headers,
        'Authorization': authorization,
      },
      body: payload,
    });

    const text = await res.text();
    
    console.log(`📊 Amazon API Response: ${res.status}`);
    
    if (!res.ok) {
      console.error(`❌ Amazon API Error ${res.status}:`, text.substring(0, 500));
      throw new Error(`Amazon API Error ${res.status}: ${text.substring(0, 200)}`);
    }

    const data = JSON.parse(text);
    
    if (!data.SearchResult?.Items?.length) {
      console.log('📭 No products found in Amazon');
      return [];
    }

    console.log(`📦 Found ${data.SearchResult.Items.length} products from Amazon`);

    // Processar produtos reais da Amazon
    const amazonProducts = data.SearchResult.Items.map((item: any) => {
      const asin = item.ASIN;
      let url = item.DetailPageURL || `https://www.amazon.com/dp/${asin}`;
      
      // Garantir tag de afiliado - sempre substituir por nossa tag
      if (url.includes('tag=')) {
        // Substituir tag existente pela nossa
        url = url.replace(/tag=[^&]*/, `tag=${ASSOCIATE_TAG}`);
      } else {
        // Adicionar nossa tag
        url = url.includes('?') ? `${url}&tag=${ASSOCIATE_TAG}` : `${url}?tag=${ASSOCIATE_TAG}`;
      }

      return {
        name: item.ItemInfo?.Title?.DisplayValue || 'Product',
        asin,
        price: item.Offers?.Listings?.[0]?.Price?.DisplayAmount || '$29.99',
        rating: item.CustomerReviews?.StarRating?.Value || 4.0,
        imageUrl: item.Images?.Primary?.Large?.URL || '',
        detailPageURL: url,
        isValid: true,
        isBestSeller: item.BrowseNodeInfo?.WebsiteSalesRank?.Rank <= 100,
        isAmazonChoice: item.ItemInfo?.ProductInfo?.IsAmazonChoice || false,
        reviewCount: item.CustomerReviews?.Count || 0,
        brand: item.ItemInfo?.ManufactureInfo?.DisplayValue || '',
        ingredients: item.ItemInfo?.Features?.DisplayValues || [],
        nutritionalValue: item.ItemInfo?.ProductInfo?.UnitCount?.DisplayValue || ''
      };
    });

    // === CURADORIA INTELIGENTE ===
    console.log(`🎯 Applying intelligent curation...`);
    
    const curatedProducts = amazonProducts
      .filter((p: RealAmazonProduct) => p.rating >= 4.0 && p.reviewCount >= 100) // Filtro básico de qualidade
      .sort((a: RealAmazonProduct, b: RealAmazonProduct) => {
        // 1. Priorizar Amazon's Choice
        if (a.isAmazonChoice && !b.isAmazonChoice) return -1;
        if (!a.isAmazonChoice && b.isAmazonChoice) return 1;
        
        // 2. Priorizar Best Sellers
        if (a.isBestSeller && !b.isBestSeller) return -1;
        if (!a.isBestSeller && b.isBestSeller) return 1;
        
        // 3. Ordenar por rating (mais alto primeiro)
        if (Math.abs(a.rating - b.rating) > 0.1) return b.rating - a.rating;
        
        // 4. Ordenar por número de reviews (mais confiável)
        return b.reviewCount - a.reviewCount;
      })
      .slice(0, maxResults);

    console.log(`✅ Curated ${curatedProducts.length} high-quality products from Amazon`);
    
    return curatedProducts;
    
  } catch (error) {
    console.error('❌ Real Amazon API failed:', error);
    throw error;
  }
}

