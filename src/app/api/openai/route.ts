import { AIStream } from 'ai';
import { type ServerRuntime } from 'next';

const API_KEY = process.env.OPENAI_API_KEY;

export const runtime: ServerRuntime = 'edge';
export const maxDuration = 300;
export const dynamic = 'force-dynamic';

// 自定义解析器实现
const customParser = (data: string) => {
  try {
    if (data === '[DONE]') {
    }
    const text = data;
    try {
      const json = JSON.parse(text) as {
        choices: Array<{
          delta: {
            content: string;
          };
        }>;
      };
      return json.choices[0]?.delta?.content;
    } catch (e) {
      console.error('[Request] parse error', text);
    }
  } catch (error) {
    console.error('解析错误', error);
  }
};

// 实现POST处理函数
export async function POST(request: Request) {
  const {
    messages = [],
    userId,
  }: Partial<{ messages: Array<any>; userId: string }> = await request.json();

  const requestPayload = {
    messages,
    chatId: userId,
    stream: true,
    model: 'gpt-3.5-turbo',
  };
  // console.log('requestPayload', requestPayload);
  // console.log('api key', API_KEY)

  const chatPath = 'https://ashley.lonic.tech/api/' + 'v1/chat/completions';

  const response = await fetch(chatPath, {
    method: 'POST',
    body: JSON.stringify(requestPayload),
    headers: {
      'Content-Type': 'application/json',
      'x-requested-with': 'XMLHttpRequest',
      Accept: 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
  });

  if (!response.ok) {
    // 如果响应不是2xx，抛出错误
    throw new Error(`网络错误: ${response.statusText}`);
  }

  // 使用AIStream处理响应流
  const stream = AIStream(response, customParser);

  // 将ReadableStream转换为Response并返回
  return new Response(stream);
}
