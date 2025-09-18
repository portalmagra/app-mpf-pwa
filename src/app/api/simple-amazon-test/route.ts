import { NextResponse } from 'next/server'
import * as crypto from 'crypto'

export async function POST() {
  try {
    const AWS_ACCESS_KEY = process.env.AMAZON_ACCESS_KEY_ID!;
    const AWS_SECRET_KEY = process.env.AMAZON_SECRET_ACCESS_KEY!;
    const ASSOCIATE_TAG = 'portalsolutio-20';
    const AWS_REGION = 'us-east-1';
    const SERVICE = 'ProductAdvertisingAPI';
    const HOST = 'webservices.amazon.com';
    const URI = '/paapi5/searchitems';
    const ENDPOINT = `https://${HOST}${URI}`;

    const now = new Date();
    const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
    const dateStamp = amzDate.slice(0, 8);

    const payloadObj = {
      Keywords: 'vitamin c',
      Resources: [
        'Images.Primary.Large',
        'ItemInfo.Title',
        'Offers.Listings.Price',
        'CustomerReviews'
      ],
      PartnerTag: ASSOCIATE_TAG,
      PartnerType: 'Associates',
      Marketplace: 'www.amazon.com',
      ItemCount: 3,
      SearchIndex: 'HealthPersonalCare',
      SortBy: 'Featured'
    };
    
    const payload = JSON.stringify(payloadObj);
    const payloadHash = crypto.createHash('sha256').update(payload).digest('hex');

    const headers = {
      'content-type': 'application/json; charset=utf-8',
      'host': HOST,
      'x-amz-target': 'com.amazon.paapi5.v1.ProductAdvertisingAPIv1.SearchItems',
      'x-amz-date': amzDate,
      'x-amz-content-sha256': payloadHash,
    };

    // Criar assinatura AWS V4
    const canonicalRequest = [
      'POST',
      URI,
      '',
      Object.entries(headers).map(([k, v]) => `${k.toLowerCase()}:${v}`).join('\n') + '\n',
      Object.keys(headers).sort().join(';'),
      payloadHash
    ].join('\n');

    const stringToSign = [
      'AWS4-HMAC-SHA256',
      amzDate,
      `${dateStamp}/${AWS_REGION}/${SERVICE}/aws4_request`,
      crypto.createHash('sha256').update(canonicalRequest).digest('hex')
    ].join('\n');

    const getSigningKey = (secretKey: string, dateStamp: string, region: string, service: string) => {
      const kDate = crypto.createHmac('sha256', 'AWS4' + secretKey).update(dateStamp).digest();
      const kRegion = crypto.createHmac('sha256', kDate).update(region).digest();
      const kService = crypto.createHmac('sha256', kRegion).update(service).digest();
      return crypto.createHmac('sha256', kService).update('aws4_request').digest();
    };

    const signingKey = getSigningKey(AWS_SECRET_KEY, dateStamp, AWS_REGION, SERVICE);
    const signature = crypto.createHmac('sha256', signingKey).update(stringToSign).digest('hex');
    
    const signedHeaders = Object.keys(headers).sort().join(';');
    const authorization = `AWS4-HMAC-SHA256 Credential=${AWS_ACCESS_KEY}/${dateStamp}/${AWS_REGION}/${SERVICE}/aws4_request, SignedHeaders=${signedHeaders}, Signature=${signature}`;

    console.log('🧪 Making direct Amazon API call...');
    console.log('📡 Endpoint:', ENDPOINT);
    console.log('📄 Payload:', payload);
    console.log('🔑 Authorization:', authorization.substring(0, 100) + '...');

    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        ...headers,
        'Authorization': authorization,
      },
      body: payload,
    });

    const text = await res.text();
    
    console.log('📊 Response status:', res.status);
    console.log('📄 Response body:', text.substring(0, 1000));

    return NextResponse.json({
      success: res.ok,
      status: res.status,
      response: text.substring(0, 1000),
      error: res.ok ? null : text
    });

  } catch (error: any) {
    console.error('❌ Simple test failed:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    });
  }
}
