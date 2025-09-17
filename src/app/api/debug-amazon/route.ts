import { NextResponse } from 'next/server'

export async function GET() {
  const AWS_ACCESS_KEY = process.env.AMAZON_ACCESS_KEY_ID;
  const AWS_SECRET_KEY = process.env.AMAZON_SECRET_ACCESS_KEY;
  const ASSOCIATE_TAG = 'portalsolutio-20';
  
  const CREDENTIALS_VALID = !!(
    AWS_ACCESS_KEY && 
    AWS_ACCESS_KEY !== 'undefined' && 
    AWS_ACCESS_KEY.length >= 10 &&
    AWS_SECRET_KEY && 
    AWS_SECRET_KEY !== 'undefined' &&
    AWS_SECRET_KEY.length >= 20
  );

  return NextResponse.json({
    credentialsValid: CREDENTIALS_VALID,
    associateTag: ASSOCIATE_TAG,
    accessKeyLength: AWS_ACCESS_KEY?.length || 0,
    secretKeyLength: AWS_SECRET_KEY?.length || 0,
    hasAccessKey: !!AWS_ACCESS_KEY,
    hasSecretKey: !!AWS_SECRET_KEY,
    accessKeyPreview: AWS_ACCESS_KEY ? `${AWS_ACCESS_KEY.substring(0, 5)}...` : 'undefined',
    secretKeyPreview: AWS_SECRET_KEY ? `${AWS_SECRET_KEY.substring(0, 5)}...` : 'undefined',
    nodeEnv: process.env.NODE_ENV
  });
}
