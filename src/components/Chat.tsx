'use client';
import { createElement, useCallback, useEffect, useState } from 'react';
import { nanoid } from 'nanoid';
import { base64Encode } from '@/utils';
import { useRouter } from 'next/navigation';
import debounce from 'lodash/debounce';
import { ChatMessage } from '@ant-design/pro-chat/es/types/message';
import dynamic from 'next/dynamic'; // 生成 ID
import RisingBg from '@/assets/rising-bg.jpg';
import { Header } from './Header';
import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from '@web3modal/ethers/react';
import { IUsage } from '@/types';
import { getNftIds } from '@/utils/web3';

// import ProChat from './ProChat';
const ProChat = dynamic(() => import('./ProChat'), { ssr: false });

interface UsageResult {
  msg: string;
  code: number;
  data: IUsage;
}

// 生成 ID
const userId = nanoid();
const defaultHelloMessage =
  '神龙精灵保佑你赚大钱！2024年运气如何？让神秘的东方玄学给你分析一下吧！';

interface ChatProps {
  freeAccess?: boolean;
}
export function Chat(props: ChatProps) {
  useEffect(() => {
    // 1s 后模拟点击html一下
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        const html = document.querySelector('html');
        if (html) {
          html.click();
          console.log('click html');
        }
      }
    }, 1000);
  }, []);

  const router = useRouter();

  const [chats, setChats] = useState<ChatMessage[]>([]);
  const { address } = useWeb3ModalAccount();
  const [usageCount, setUsageCount] = useState<number>(Infinity);
  const [isFirstChat, setIsFirstChat] = useState<boolean>(true);
  const [inputDisabled, setInputDisabled] = useState<boolean>(true);
  const { walletProvider } = useWeb3ModalProvider();
  const [myNTFs, setMyNTFs] = useState({ babyLoong: 0, greatLoong: 0 });
  const canRequestWallet = Boolean(address && walletProvider);
  const [helloMessage, setHelloMessage] = useState<string>(defaultHelloMessage);
  const [loading, setLoading] = useState<boolean>(false);

  const navigateDebounced = debounce((url) => {
    router.push(url);
  }, 1000);
  // 1000ms的防抖时间

  const getUsage = async (address: string, month: string) => {
    const response = await fetch(
      `/api/usage?address=${address}&month=${month}`,
      {
        method: 'GET',
      }
    );
    const result: UsageResult | null = await response.json();

    if (result?.data === null) {
      setUsageCount(0);
    } else if (result?.data?.count !== undefined) {
      setUsageCount(result.data.count);
    } else {
      console.error(result?.msg || '获取使用次数失败');
    }
  };

  const addUsageCount = async (address: string, month: string) => {
    const response = await fetch(`/api/usage`, {
      method: 'POST',
      body: JSON.stringify({
        address,
        month,
      }),
    });
    const result: UsageResult = await response.json();
    if (result?.data?.count !== undefined) {
      // setUsageCount(result.data.count);
      console.log(result);
    } else {
      console.error(result.msg);
    }
  };

  // 提示语
  useEffect(() => {
    if (!canRequestWallet) {
      setHelloMessage('在使用前，请首先登录你的钱包。');
      setInputDisabled(true);
      return;
    }
    if (loading) {
      return;
    }
    console.log(
      'great loong remain:',
      myNTFs.greatLoong,
      'baby loong remain:',
      myNTFs.babyLoong,
      'usage count:',
      usageCount
    );

    if (!props.freeAccess) {
      if (myNTFs.greatLoong === 0 && myNTFs.babyLoong === 0) {
        setHelloMessage('在进行对话前，请确保你已经拥有神龙NFT。');
        setInputDisabled(true);
        return;
      }
      if (myNTFs.greatLoong === 0 && myNTFs.babyLoong > 0) {
        if (usageCount >= myNTFs.babyLoong) {
          setHelloMessage('本月的算命机会你已经用完了。请下个月再来试试吧！');
          setInputDisabled(true);
          return;
        }
      }
    }

    setHelloMessage(defaultHelloMessage);
    setInputDisabled(false);
  }, [canRequestWallet, myNTFs, usageCount, loading, props.freeAccess]);

  // 获取 NFT
  useEffect(() => {
    if (!canRequestWallet) {
      return;
    }

    const assetsInit = async () => {
      setLoading(true);
      const [greatLoongNFTRemain, babyLoongNFTRemain] = await Promise.all([
        getNftIds(walletProvider, true),
        getNftIds(walletProvider, false),
      ]);
      setMyNTFs({
        babyLoong: babyLoongNFTRemain.length,
        greatLoong: greatLoongNFTRemain.length,
      });
      setLoading(false);
    };
    assetsInit();
  }, [canRequestWallet, walletProvider]);

  // 获取使用次数
  useEffect(() => {
    if (!canRequestWallet || !address) {
      return;
    }
    const now = new Date();
    const month = `${now.getFullYear()}-${now.getMonth() + 1}`;
    getUsage(address, month);
  }, [canRequestWallet, address]);

  const renderInputArea = (defaultInputArea: React.ReactNode) => {
    return (
      <div
        style={
          inputDisabled
            ? {
                cursor: 'not-allowed',
                pointerEvents: 'none',
                position: 'relative',
              }
            : {}
        }
      >
        {defaultInputArea}
        {inputDisabled && (
          <div
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
              position: 'absolute',
              inset: '16px',
              borderRadius: '8px',
              zIndex: 99999,
            }}
          ></div>
        )}
      </div>
    );
  };

  return (
    <div
      style={{
        backgroundImage: `url(${RisingBg.src})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        paddingTop: '100px',
        width: '100vw',
        height: '100vh',
      }}
    >
      <Header />
      <ProChat
        renderInputArea={(_) => renderInputArea(_)}
        loading={loading}
        chats={chats}
        style={{
          height: '100%',
          width: '100%',
          position: 'relative',
          zIndex: 1,
        }}
        helloMessage={helloMessage}
        request={async (messages) => {
          const date = new Date();
          const systemMessages: ChatMessage[] = [
            {
              content: `今天的日期是${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`,
              id: nanoid(),
              createAt: date.getTime(),
              updateAt: date.getTime(),
              role: 'system',
            },
          ];
          const response = await fetch('/api/openai', {
            method: 'POST',
            body: JSON.stringify({
              messages: systemMessages.concat(messages),
              userId: userId,
            }),
          });

          // 第一次对话后，把轮数加1
          if (isFirstChat && address) {
            try {
              await addUsageCount(
                address,
                `${new Date().getFullYear()}-${new Date().getMonth() + 1}`
              );
            } finally {
              setIsFirstChat(false);
            }
          }
          return response;
        }}
        chatItemRenderConfig={{
          avatarRender: false,
          actionsRender: false,
        }}
      />
    </div>
  );
}
