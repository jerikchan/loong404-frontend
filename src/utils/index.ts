import { ILoongImageData } from '@/types';
import { ethers } from 'ethers';

export function base64Encode(str: string) {
  // 首先使用 encodeURIComponent 对字符串进行编码
  const encodedUriComponent = encodeURIComponent(str);
  // 将编码后的字符串转换为 Base64
  const base64 = btoa(encodedUriComponent);
  return base64;
}

export function base64Decode(base64: string) {
  // 使用 atob 进行 Base64 解码
  const decodedUriComponent = atob(base64);
  // 将解码后的字符串转换回原始格式
  const originalStr = decodeURIComponent(decodedUriComponent);
  return originalStr;
}

export class MockResponse {
  private controller!: ReadableStreamDefaultController<Uint8Array>;
  private encoder = new TextEncoder();

  private stream: ReadableStream<Uint8Array>;

  constructor(
    private data: string,
    private delay: number = 300
  ) {
    this.stream = new ReadableStream({
      start: (controller) => {
        this.controller = controller;
        this.pushData();
      },
    });
  }

  private pushData() {
    if (this.data.length === 0) {
      this.controller.close();
      return;
    }

    const chunk = this.data.slice(0, 1);
    this.data = this.data.slice(1);

    this.controller.enqueue(this.encoder.encode(chunk));

    setTimeout(() => this.pushData(), this.delay);
  }

  getResponse() {
    return new Response(this.stream);
  }
}

function resolve(...paths: string[]) {
  return paths.map((path) => path.replace(/^\/|\/$/g, '')).join('/');
}

function getIPFSPrefixUrl() {
  return 'https://ipfs.io/ipfs/';
}

function createGetLoongImageData(cid: string) {
  return async (id: string) => {
    const res = await fetch(resolve(getIPFSPrefixUrl(), cid, id));
    const json: ILoongImageData = await res.json();
    return json;
  };
}

export const getGreatLoongImageData = createGetLoongImageData(
  process.env.NEXT_PUBLIC_GREAT_LOONG_IMAGE_CID
);
export const getBabyLoongImageData = createGetLoongImageData(
  process.env.NEXT_PUBLIC_BABY_LOONG_IMAGE_CID
);

export function loadImage(url: string) {
  return new Promise<string>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(url);
    img.onerror = reject;
    img.src = url;
  });
}

function createGetLoongImageUrl() {
  return async (image: string, sync?: boolean) => {
    const url = resolve(getIPFSPrefixUrl(), image.replace('ipfs://', ''));
    if (sync) return url;

    return loadImage(url);
  };
}

export const getGreatLoongImageUrl = createGetLoongImageUrl();
export const getBabyLoongImageUrl = createGetLoongImageUrl();

export function weiToDate(wei: bigint) {
  return new Date(Number(ethers.formatUnits(wei, 'wei')) * 1000);
}

export function formatCountdownMs(ms: number) {
  const hours = Math.floor(ms / 1000 / 60 / 60);
  const minutes = Math.floor(ms / 1000 / 60);
  const seconds = Math.floor(ms / 1000);
  return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
}

export function extractReason(message: string) {
  const reasonRegex = /reason="([^"]+)"/; // 匹配 reason="..." 中的内容
  const reasonMatch = message.match(reasonRegex); // 使用正则表达式匹配
  const error = /(.+?) \(action=/; // 匹配 Error 后面到第一个括号之间的内容
  const errorMatch = message.match(error); // 使用正则表达式匹配
  if (reasonMatch) {
    return reasonMatch[1]; // 返回匹配到的 reason 内容
  } else if (errorMatch) {
    return errorMatch[1]; // 返回匹配到的 Error 内容
  } else {
    return null; // 如果未匹配到，返回 null 或者其他默认值
  }
}
