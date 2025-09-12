import { ProductAdvertisingAPIv1 } from 'paapi5-nodejs-sdk'

// Configuração da API da Amazon
const accessKey = process.env.AMAZON_ACCESS_KEY_ID!
const secretKey = process.env.AMAZON_SECRET_ACCESS_KEY!
const partnerTag = process.env.AMAZON_ASSOCIATE_TAG!
const marketplace = process.env.AMAZON_MARKETPLACE!
const region = process.env.AMAZON_REGION!

export const amazonApi = new ProductAdvertisingAPIv1({
  accessKey,
  secretKey,
  partnerTag,
  marketplace,
  region
})

// Função para buscar produtos por categoria
export async function searchProductsByCategory(category: string, keywords: string[]) {
  try {
    const request = {
      Keywords: keywords.join(' '),
      SearchIndex: category,
      ItemCount: 10,
      Resources: [
        'ItemInfo.Title',
        'ItemInfo.ByLineInfo',
        'ItemInfo.ContentInfo',
        'ItemInfo.Classifications',
        'ItemInfo.ExternalIds',
        'ItemInfo.Features',
        'ItemInfo.ManufactureInfo',
        'ItemInfo.ProductInfo',
        'ItemInfo.TechnicalInfo',
        'ItemInfo.TradeInInfo',
        'Offers.Listings.Price',
        'Offers.Listings.Availability',
        'Offers.Listings.Condition',
        'Offers.Listings.DeliveryInfo',
        'Offers.Listings.MerchantInfo',
        'Offers.Summaries.HighestPrice',
        'Offers.Summaries.LowestPrice',
        'Offers.Summaries.OfferCount',
        'Images.Primary.Small',
        'Images.Primary.Medium',
        'Images.Primary.Large',
        'Images.Variants.Small',
        'Images.Variants.Medium',
        'Images.Variants.Large'
      ]
    }

    const response = await amazonApi.searchItems(request)
    return response.SearchResult?.Items || []
  } catch (error) {
    console.error('Erro ao buscar produtos Amazon:', error)
    return []
  }
}

// Função para buscar produtos específicos por ASIN
export async function getProductsByASIN(asins: string[]) {
  try {
    const request = {
      ItemIds: asins,
      Resources: [
        'ItemInfo.Title',
        'ItemInfo.ByLineInfo',
        'ItemInfo.ContentInfo',
        'ItemInfo.Classifications',
        'ItemInfo.ExternalIds',
        'ItemInfo.Features',
        'ItemInfo.ManufactureInfo',
        'ItemInfo.ProductInfo',
        'ItemInfo.TechnicalInfo',
        'ItemInfo.TradeInInfo',
        'Offers.Listings.Price',
        'Offers.Listings.Availability',
        'Offers.Listings.Condition',
        'Offers.Listings.DeliveryInfo',
        'Offers.Listings.MerchantInfo',
        'Offers.Summaries.HighestPrice',
        'Offers.Summaries.LowestPrice',
        'Offers.Summaries.OfferCount',
        'Images.Primary.Small',
        'Images.Primary.Medium',
        'Images.Primary.Large',
        'Images.Variants.Small',
        'Images.Variants.Medium',
        'Images.Variants.Large'
      ]
    }

    const response = await amazonApi.getItems(request)
    return response.ItemsResult?.Items || []
  } catch (error) {
    console.error('Erro ao buscar produtos por ASIN:', error)
    return []
  }
}
