import { NextRequest } from 'next/server';
import { getBabyLoongImageData, getBabyLoongImageUrl } from '@/utils';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const data = await getBabyLoongImageData(id);
  const url = await getBabyLoongImageUrl(data.image, true);
  const buffer = await fetch(url).then((res) => res.arrayBuffer());

  return new Response(buffer, {
    headers: {
      'content-type': 'image/png',
    },
  });
}
