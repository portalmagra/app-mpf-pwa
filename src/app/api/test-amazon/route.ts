import { NextResponse } from 'next/server'
import { searchAmazonAPI } from '@/lib/amazon-api'

export async function POST() {
  try {
    console.log('🧪 Testing Amazon API directly...');
    
    const products = await searchAmazonAPI('vitamin c', 1, {
      minRating: 4.0,
      preferBestSellers: true,
      preferAmazonChoice: true,
      sortBy: 'Featured'
    });
    
    console.log('📊 Direct API test results:', products);
    
    return NextResponse.json({
      success: true,
      products,
      count: products.length
    });
  } catch (error: any) {
    console.error('❌ Direct API test failed:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    });
  }
}
