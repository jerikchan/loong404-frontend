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
