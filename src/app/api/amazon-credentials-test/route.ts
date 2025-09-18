import { NextResponse } from 'next/server'

export async function GET() {
  const AWS_ACCESS_KEY = process.env.AMAZON_ACCESS_KEY_ID;
  const AWS_SECRET_KEY = process.env.AMAZON_SECRET_ACCESS_KEY;
  const ASSOCIATE_TAG = process.env.AMAZON_ASSOCIATE_TAG;
  
  // Verificar se as credenciais estão no formato correto
  const accessKeyValid = AWS_ACCESS_KEY && AWS_ACCESS_KEY.startsWith('AKIA') && AWS_ACCESS_KEY.length === 20;
  const secretKeyValid = AWS_SECRET_KEY && AWS_SECRET_KEY.length === 40;
  const associateTagValid = ASSOCIATE_TAG && ASSOCIATE_TAG.includes('-');
  
  return NextResponse.json({
    credentials: {
      accessKey: {
        present: !!AWS_ACCESS_KEY,
        valid: accessKeyValid,
        length: AWS_ACCESS_KEY?.length || 0,
        startsWithAKIA: AWS_ACCESS_KEY?.startsWith('AKIA') || false,
        preview: AWS_ACCESS_KEY ? `${AWS_ACCESS_KEY.substring(0, 8)}...` : 'undefined'
      },
      secretKey: {
        present: !!AWS_SECRET_KEY,
        valid: secretKeyValid,
        length: AWS_SECRET_KEY?.length || 0,
        preview: AWS_SECRET_KEY ? `${AWS_SECRET_KEY.substring(0, 8)}...` : 'undefined'
      },
      associateTag: {
        present: !!ASSOCIATE_TAG,
        valid: associateTagValid,
        value: ASSOCIATE_TAG || 'undefined'
      }
    },
    overallValid: accessKeyValid && secretKeyValid && associateTagValid
  });
}
