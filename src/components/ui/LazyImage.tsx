import Image from 'next/image';
import { loadImage } from '@/utils';
import { Skeleton } from './Skeleton';
import { useEffect, useState } from 'react';

export function LazyImage({ src }: { src: string }) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    loadImage(src).then(() => setUrl(src));
  }, [src]);

  return (
    <>
      {url ? (
        <Image
          src={url}
          width={256}
          height={256}
          alt={url}
          className='object-cover transition-all hover:scale-105'
        />
      ) : (
        <Skeleton className='h-[256px] w-[256px]' />
      )}
    </>
  );
}
