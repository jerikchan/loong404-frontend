import { NextRequest } from 'next/server';
import { getGreatLoongImageData, getGreatLoongImageUrl } from '@/utils';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const data = await getGreatLoongImageData(id);
  const url = await getGreatLoongImageUrl(data.image, true);
  const buffer = await fetch(url).then((res) => res.arrayBuffer());

  return new Response(buffer, {
    headers: {
      'content-type': 'image/png',
    },
  });
}
