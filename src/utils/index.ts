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
