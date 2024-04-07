'use client';

import { Header } from '@/components/Header';
import Loading from '@/components/loading';
import { useSelector } from 'react-redux';
import {
  claimEthBlindBox,
  claimLoongTokenBlindBox,
  extractFarmingEthAmount,
  extractFarmingTokenAmount,
  getFarmingEthAmount,
  getFarmingTokenAmount,
  getTalismanNum,
  getTimeReductionCardNum,
  getUserUnopenedBlindBox,
} from '@/utils/farming';
import { useEffect, useState } from 'react';
import { useWeb3ModalProvider } from '@web3modal/ethers/react';
import {
  IFarmingETHAmount,
  IFarmingTokenAmount,
  IUnopenedBlindBox,
} from '@/types';
import Image, { type StaticImageData } from 'next/image';
import TreasureImage from '@/assets/treasure/image.png';
import TreasureImage2 from '@/assets/treasure/image2.png';
import TreasureImage3 from '@/assets/treasure/image3.png';
import TreasureImage4 from '@/assets/treasure/image4.png';
import TreasureImage5 from '@/assets/treasure/image5.png';
import { message } from 'antd';
import { extractReason } from '@/utils';
import { Eip1193Provider } from 'ethers';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';

function BlindBox({
  num,
  name,
  image,
  onOpen,
  disabled,
}: {
  num: number;
  name: string;
  image: StaticImageData;
  onOpen?: (walletProvider: Eip1193Provider) => Promise<void>;
  disabled?: boolean;
}) {
  const { walletProvider } = useWeb3ModalProvider();
  const onClick = async () => {
    if (!walletProvider) return;
    if (!onOpen) {
      message.info('敬请期待~');
      return;
    }
    if (!num) {
      message.warning('你还没有盲盒~');
      return;
    }

    message.info('opening...');
    try {
      await onOpen(walletProvider);
      message.success('open success!');
    } catch (e) {
      message.error(extractReason((e as Error).message) || 'open failed.');
      console.error(e);
      return;
    }
  };

  return (
    <div className='shrink-0 space-y-3 pb-8'>
      <div className='overflow-hidden rounded-md'>
        <Image
          src={image}
          width={256}
          height={256}
          alt={name}
          className='object-cover transition-all hover:scale-105'
        />
      </div>
      <div className='space-y-2 text-sm'>
        <div className='text-center text-xs leading-none'>
          {name} * {num}
        </div>
        {!!onOpen && (
          <button
            disabled={disabled}
            onClick={onClick}
            className='mx-auto block rounded-lg bg-[#ebe0cc] px-12 py-2 text-base font-bold text-[#0a0a0b] disabled:cursor-not-allowed disabled:bg-opacity-50 disabled:text-gray-500'
          >
            打开盲盒
          </button>
        )}
      </div>
    </div>
  );
}

function OpenedTreasure() {
  const { walletProvider } = useWeb3ModalProvider();
  const [talismanNum, setTalismanNum] = useState<number>();
  const [farmingEthAmount, setFarmingEthAmount] = useState<IFarmingETHAmount>();
  const [greatFarmingTokenAmount, setGreatFarmingTokenAmount] =
    useState<IFarmingTokenAmount>();
  const [babyFarmingTokenAmount, setBabyFarmingTokenAmount] =
    useState<IFarmingTokenAmount>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGreatClaiming, setIsGreatClaiming] = useState(false);
  const [toBeExtractedAmount, setToBeExtractedAmount] = useState(0);

  const doExtractFarmingEthAmount = async () => {
    if (!walletProvider) return;
    if (!farmingEthAmount) return;
    if (farmingEthAmount.ethToBeExtractedAmount === '0.0') {
      message.warning('你没有待提取的ETH~');
      return;
    }
    message.info('extracting...');
    try {
      await extractFarmingEthAmount(walletProvider);
      message.success('extract success!');
    } catch (e) {
      message.error(extractReason((e as Error).message) || 'extract failed.');
      console.error(e);
      return;
    }
  };

  const openExtractFarmingTokenAmount = (isGreatL: boolean) => {
    setIsModalOpen(true);
    setIsGreatClaiming(isGreatL);
    setToBeExtractedAmount(
      (isGreatL
        ? greatFarmingTokenAmount?.toBeExtractedAmount
        : babyFarmingTokenAmount?.toBeExtractedAmount) || 0
    );
  };

  const doExtractFarmingTokenAmount = async (isGreatL: boolean) => {
    if (!walletProvider) return;
    const data = isGreatL ? greatFarmingTokenAmount : babyFarmingTokenAmount;
    if (!data) return;
    if (data.toBeExtractedAmount === 0) {
      message.warning('你没有待提取的token~');
      return;
    }
    if (toBeExtractedAmount > data.toBeExtractedAmount) {
      message.warning('提取数量大于待提取数量');
      return;
    }
    message.info('extracting...');
    try {
      await extractFarmingTokenAmount(
        walletProvider,
        toBeExtractedAmount,
        isGreatL
      );
      message.success('extract success!');
    } catch (e) {
      message.error(extractReason((e as Error).message) || 'extract failed.');
      console.error(e);
      return;
    }
  };

  useEffect(() => {
    const fetchGreatFarmingTokenAmount = async () => {
      if (!walletProvider) return;
      const data = await getFarmingTokenAmount(walletProvider, true);
      setGreatFarmingTokenAmount(data);
    };

    fetchGreatFarmingTokenAmount();
  }, [walletProvider]);

  useEffect(() => {
    const fetchBabyFarmingTokenAmount = async () => {
      if (!walletProvider) return;
      const data = await getFarmingTokenAmount(walletProvider, false);
      setBabyFarmingTokenAmount(data);
    };

    fetchBabyFarmingTokenAmount();
  }, [walletProvider]);

  useEffect(() => {
    const fetchTalismanNum = async () => {
      if (!walletProvider) return;
      const num = await getTalismanNum(walletProvider);
      setTalismanNum(num);
    };

    fetchTalismanNum();
  }, [walletProvider]);

  useEffect(() => {
    const fetchFarmingEthAmount = async () => {
      if (!walletProvider) return;
      const data = await getFarmingEthAmount(walletProvider);
      setFarmingEthAmount(data);
    };

    fetchFarmingEthAmount();
  }, [walletProvider]);

  return (
    <div className='mb-4 flex w-full max-w-[900px] flex-col space-y-6 pb-4 md:space-y-2'>
      {/* 大龙 */}
      <div className='flex flex-col items-center justify-between space-y-4 md:flex-row'>
        <div className='flex items-center space-x-2 md:space-x-4'>
          <div>
            大龙token：{greatFarmingTokenAmount?.farmingTokenAmount ?? '???'}
          </div>
          <div>已提取：{greatFarmingTokenAmount?.extractAmount ?? '???'}</div>
          <div>
            待提取：{greatFarmingTokenAmount?.toBeExtractedAmount ?? '???'}
          </div>
          <div>
            待提取解锁：
            {greatFarmingTokenAmount?.toBeExtractedUnlockingAmount ?? '???'}
          </div>
          <div>税收：{greatFarmingTokenAmount?.taxationAmount ?? '???'}</div>
        </div>
        <button
          onClick={() => openExtractFarmingTokenAmount(true)}
          className='block rounded-lg bg-[#ebe0cc] px-6 py-1 text-base font-bold text-[#0a0a0b] disabled:cursor-not-allowed disabled:bg-opacity-50 disabled:text-gray-500'
        >
          Claim
        </button>
      </div>
      {/* 小龙 */}
      <div className='flex flex-col items-center justify-between space-y-4 md:flex-row'>
        <div className='flex items-center space-x-2 md:space-x-4'>
          <div>
            小龙token：{babyFarmingTokenAmount?.farmingTokenAmount ?? '???'}
          </div>
          <div>已提取：{babyFarmingTokenAmount?.extractAmount ?? '???'}</div>
          <div>
            待提取：{babyFarmingTokenAmount?.toBeExtractedAmount ?? '???'}
          </div>
          <div>
            待提取解锁：
            {babyFarmingTokenAmount?.toBeExtractedUnlockingAmount ?? '???'}
          </div>
          <div>税收：{babyFarmingTokenAmount?.taxationAmount ?? '???'}</div>
        </div>
        <button
          onClick={() => openExtractFarmingTokenAmount(false)}
          className='block rounded-lg bg-[#ebe0cc] px-6 py-1 text-base font-bold text-[#0a0a0b] disabled:cursor-not-allowed disabled:bg-opacity-50 disabled:text-gray-500'
        >
          Claim
        </button>
      </div>
      {/* ETH */}
      <div className='flex flex-col items-center justify-between space-y-4 md:flex-row'>
        <div className='flex items-center space-x-2 md:space-x-4'>
          <div>ETH：{farmingEthAmount?.ethAmount ?? '???'}</div>
          <div>已提取：{farmingEthAmount?.ethExtractAmount ?? '???'}</div>
          <div>待提取：{farmingEthAmount?.ethToBeExtractedAmount ?? '???'}</div>
        </div>
        <button
          disabled={!farmingEthAmount?.ethToBeExtractedAmount}
          onClick={doExtractFarmingEthAmount}
          className='block rounded-lg bg-[#ebe0cc] px-6 py-1 text-base font-bold text-[#0a0a0b] disabled:cursor-not-allowed disabled:bg-opacity-50 disabled:text-gray-500'
        >
          Claim
        </button>
      </div>

      {/* 开光护身符 */}
      <div className='flex flex-col items-center justify-between space-y-4 md:flex-row'>
        <div className='flex items-center space-x-2 md:space-x-4'>
          <div>开光护身符：{talismanNum ?? '???'}</div>
        </div>
        <button
          disabled
          className='block rounded-lg bg-[#ebe0cc] px-6 py-1 text-base font-bold text-[#0a0a0b] disabled:cursor-not-allowed disabled:bg-opacity-50 disabled:text-gray-500'
        >
          Claim
        </button>
      </div>
      {/* <div className="flex items-center justify-center w-[100%] h-[360px] text-white text-xl">你还没有宝藏~</div> */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isGreatClaiming ? 'Great Loong Claim' : 'Baby Loong Claim'}
        className='!max-w-[380px]'
      >
        <div className='space-y-2'>
          <div>
            提取（Max:{' '}
            {(isGreatClaiming
              ? greatFarmingTokenAmount?.toBeExtractedAmount
              : babyFarmingTokenAmount?.toBeExtractedAmount) ?? '???'}
            ）：
          </div>
          <input
            type='number'
            value={toBeExtractedAmount}
            max={
              isGreatClaiming
                ? greatFarmingTokenAmount?.toBeExtractedAmount
                : babyFarmingTokenAmount?.toBeExtractedAmount
            }
            className='h-12 w-full rounded-lg border border-solid border-gray-500 bg-white px-4 py-2'
            placeholder='输入提取数量'
          />
        </div>
        <div className='mt-4 text-sm text-gray-700'>
          金额大于待提解锁（
          {(isGreatClaiming
            ? greatFarmingTokenAmount?.toBeExtractedUnlockingAmount
            : babyFarmingTokenAmount?.toBeExtractedUnlockingAmount) ?? '???'}
          ）将产生税收
        </div>
        <div className='mt-6 flex items-center justify-center space-x-8'>
          <Button
            onClick={() => setIsModalOpen(false)}
            className='!border !border-solid !border-gray-500 !bg-white !text-[#6b6c6e]'
          >
            取消
          </Button>
          <Button onClick={() => doExtractFarmingTokenAmount(isGreatClaiming)}>
            提取
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export default function Page() {
  const { walletProvider } = useWeb3ModalProvider();
  const loading = useSelector((state: { loading: boolean }) => state.loading);
  const [userUnopenedBlindBox, setUserUnopenedBlindBox] =
    useState<IUnopenedBlindBox>({
      ethBlindBox: 0,
      loongTokenBlindBox: 0,
      equipBlindBox: 0,
      aUBlindBox: 0,
    });
  const [timeReductionCardNum, setTimeReductionCardNum] = useState(0);

  useEffect(() => {
    const fetchTimeReductionCardNum = async () => {
      if (!walletProvider) return;
      // 不分大小龙，随便取一个，取大龙的
      const num = await getTimeReductionCardNum(walletProvider, true);
      setTimeReductionCardNum(num);
    };
    fetchTimeReductionCardNum();
  }, [walletProvider]);

  const openBlindBox = async () => {
    if (!walletProvider) return;
  };

  useEffect(() => {
    const fetchUserUnopenedBlindBox = async () => {
      if (!walletProvider) return;
      const data = await getUserUnopenedBlindBox(walletProvider, true);
      console.log('get user unopened blind box:', data);
      setUserUnopenedBlindBox(data);
    };
    fetchUserUnopenedBlindBox();
  }, [walletProvider]);

  const showBlindBox = true;

  return (
    <div className='min-h-screen bg-[#533837] pt-32'>
      {loading && <Loading />}
      <Header dark={true} />
      <div className='px-[5vw] md:px-[40px]'>
        <h1 className='mb-4 text-2xl font-semibold'>未开启的宝藏</h1>
        <div className='mb-4 flex flex-nowrap space-x-16 overflow-x-auto pb-4'>
          {(userUnopenedBlindBox.ethBlindBox > 0 || showBlindBox) && (
            <BlindBox
              name='以太盲盒'
              num={userUnopenedBlindBox.ethBlindBox}
              image={TreasureImage}
              onOpen={claimEthBlindBox}
            />
          )}
          {(userUnopenedBlindBox.loongTokenBlindBox > 0 || showBlindBox) && (
            <BlindBox
              name='精灵碎片盲盒'
              num={userUnopenedBlindBox.loongTokenBlindBox}
              image={TreasureImage2}
              onOpen={claimLoongTokenBlindBox}
            />
          )}
          {(userUnopenedBlindBox.equipBlindBox > 0 || showBlindBox) && (
            <BlindBox
              disabled
              name='神龙装备盲盒'
              num={userUnopenedBlindBox.equipBlindBox}
              image={TreasureImage3}
              onOpen={openBlindBox}
            />
          )}
          {(userUnopenedBlindBox.aUBlindBox > 0 || showBlindBox) && (
            <BlindBox
              disabled
              name='星球盲盒'
              num={userUnopenedBlindBox.aUBlindBox}
              image={TreasureImage4}
              onOpen={openBlindBox}
            />
          )}
          {!showBlindBox &&
            userUnopenedBlindBox.ethBlindBox === 0 &&
            userUnopenedBlindBox.loongTokenBlindBox === 0 &&
            userUnopenedBlindBox.equipBlindBox === 0 &&
            userUnopenedBlindBox.aUBlindBox === 0 && (
              <div className='flex h-[360px] w-[100%] items-center justify-center text-xl text-white'>
                你还没有盲盒~
              </div>
            )}
        </div>
      </div>

      <div className='px-[5vw] md:px-[40px]'>
        <h1 className='mb-4 text-2xl font-semibold'>已获取的宝藏</h1>
        <OpenedTreasure />
      </div>

      <div className='px-[5vw] md:px-[40px]'>
        <h1 className='mb-4 text-2xl font-semibold'>道具</h1>
        <div className='flex h-[360px] flex-nowrap space-x-8 overflow-x-auto pb-4'>
          <BlindBox
            name='沉睡减时卡【3天】'
            num={timeReductionCardNum}
            image={TreasureImage5}
          />
          {/* <div className="flex items-center justify-center w-[100%] h-[360px] text-white text-xl">你还没有道具~</div> */}
        </div>
      </div>
    </div>
  );
}
