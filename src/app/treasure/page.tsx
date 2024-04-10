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
import { useCallback, useEffect, useState } from 'react';
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
import TreasureImage6 from '@/assets/treasure/image6.png';
import TreasureImageCard from '@/assets/treasure/image_card.png';
import TreasureImageCard2 from '@/assets/treasure/image_card2.png';

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
  desc,
}: {
  num: number;
  name: string;
  image: StaticImageData;
  onOpen?: () => Promise<void>;
  disabled?: boolean;
  desc?: string;
}) {
  const { walletProvider } = useWeb3ModalProvider();
  const onClick = async () => {
    if (!walletProvider) return;
    if (!onOpen) {
      message.info('Stay tuned.');
      return;
    }
    if (!num) {
      message.warning(`You don't have a blind box yet.`);
      return;
    }

    message.info('opening...');
    try {
      await onOpen();
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
          {name} * {num ?? '???'}
        </div>
        {desc && (
          <div className='mt-2 text-center text-xs leading-none text-gray-400'>
            {desc}
          </div>
        )}
        {!!onOpen && (
          <button
            disabled={disabled}
            onClick={onClick}
            className='mx-auto block rounded-lg bg-[#ebe0cc] px-12 py-2 text-base font-bold text-[#0a0a0b] disabled:cursor-not-allowed disabled:bg-opacity-50 disabled:text-gray-500'
          >
            Open
          </button>
        )}
      </div>
    </div>
  );
}

function OpenedTreasure({
  refresh,
  onRefresh,
}: {
  refresh?: number;
  onRefresh?: () => void;
}) {
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
      message.warning('You have no ETH to be withdrawn.');
      return;
    }
    message.info('extracting...');
    try {
      await extractFarmingEthAmount(walletProvider);
      message.success('extract success!');
      onRefresh?.();
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
      message.warning('You have no token to be withdrawn.');
      return;
    }
    if (toBeExtractedAmount > data.toBeExtractedAmount) {
      message.warning(
        'The withdrawal amount exceeds the amount available for withdrawal.'
      );
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
      setIsModalOpen(false);
      onRefresh?.();
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
      console.log('get great farming token amount:', data);
      setGreatFarmingTokenAmount(data);
    };

    fetchGreatFarmingTokenAmount();
  }, [walletProvider, refresh]);

  useEffect(() => {
    const fetchBabyFarmingTokenAmount = async () => {
      if (!walletProvider) return;
      const data = await getFarmingTokenAmount(walletProvider, false);
      console.log('get baby farming token amount:', data);
      setBabyFarmingTokenAmount(data);
    };

    fetchBabyFarmingTokenAmount();
  }, [walletProvider, refresh]);

  useEffect(() => {
    const fetchTalismanNum = async () => {
      if (!walletProvider) return;
      const num = await getTalismanNum(walletProvider);
      console.log('get talisman num:', num);
      setTalismanNum(num);
    };

    fetchTalismanNum();
  }, [walletProvider, refresh]);

  useEffect(() => {
    const fetchFarmingEthAmount = async () => {
      if (!walletProvider) return;
      const data = await getFarmingEthAmount(walletProvider);
      console.log('get farming eth amount:', data);
      setFarmingEthAmount(data);
    };

    fetchFarmingEthAmount();
  }, [walletProvider, refresh]);

  return (
    <div className='mb-4 flex w-full flex-col space-y-6 pb-4 md:space-y-2'>
      {/* 大龙 */}
      <div className='flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-x-4 '>
        <div className='flex flex-col flex-wrap text-sm lg:flex-row lg:items-center lg:space-x-4'>
          <div>
            Great Loong Token:{' '}
            {greatFarmingTokenAmount?.farmingTokenAmount ?? '???'}
          </div>
          <div>
            Withdrawn: {greatFarmingTokenAmount?.extractAmount ?? '???'}
          </div>
          <div>
            Pending Withdrawal:
            {greatFarmingTokenAmount?.toBeExtractedAmount ?? '???'}
          </div>
          <div>
            Pending Unlock for Withdrawal:
            {greatFarmingTokenAmount?.toBeExtractedUnlockingAmount ?? '???'}
          </div>
          <div>
            Taxation: {greatFarmingTokenAmount?.taxationAmount ?? '???'}
          </div>
        </div>
        <button
          onClick={() => openExtractFarmingTokenAmount(true)}
          className='block rounded-lg bg-[#ebe0cc] px-6 py-1 text-base font-bold text-[#0a0a0b] disabled:cursor-not-allowed disabled:bg-opacity-50 disabled:text-gray-500'
        >
          Claim
        </button>
      </div>
      {/* 小龙 */}
      <div className='flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-x-4 '>
        <div className='flex flex-col flex-wrap text-sm lg:flex-row lg:items-center lg:space-x-4'>
          <div>
            Baby Loong Token:{' '}
            {babyFarmingTokenAmount?.farmingTokenAmount ?? '???'}
          </div>
          <div>Withdrawn: {babyFarmingTokenAmount?.extractAmount ?? '???'}</div>
          <div>
            Pending Withdrawal:{' '}
            {babyFarmingTokenAmount?.toBeExtractedAmount ?? '???'}
          </div>
          <div>
            Pending Unlock for Withdrawal:
            {babyFarmingTokenAmount?.toBeExtractedUnlockingAmount ?? '???'}
          </div>
          <div>Taxation: {babyFarmingTokenAmount?.taxationAmount ?? '???'}</div>
        </div>
        <button
          onClick={() => openExtractFarmingTokenAmount(false)}
          className='block rounded-lg bg-[#ebe0cc] px-6 py-1 text-base font-bold text-[#0a0a0b] disabled:cursor-not-allowed disabled:bg-opacity-50 disabled:text-gray-500'
        >
          Claim
        </button>
      </div>
      {/* ETH */}
      <div className='flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-x-4 '>
        <div className='flex flex-col flex-wrap text-sm lg:flex-row lg:items-center lg:space-x-4'>
          <div>ETH: {farmingEthAmount?.ethAmount ?? '???'}</div>
          <div>Withdrawn: {farmingEthAmount?.ethExtractAmount ?? '???'}</div>
          <div>
            Pending Withdrawn:
            {farmingEthAmount?.ethToBeExtractedAmount ?? '???'}
          </div>
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
      <div className='flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-x-4 '>
        <div className='flex flex-col flex-wrap text-sm lg:flex-row lg:items-center lg:space-x-4'>
          <div>Blessed Talisman: {talismanNum ?? '???'}</div>
        </div>
        <button
          disabled
          className='block rounded-lg bg-[#ebe0cc] px-6 py-1 text-base font-bold text-[#0a0a0b] disabled:cursor-not-allowed disabled:bg-opacity-50 disabled:text-gray-500'
        >
          Claim
        </button>
      </div>
      {/* <div className="flex items-center justify-center w-[100%] h-[360px] text-white text-xl">You don't have treasure yet.</div> */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          isGreatClaiming ? 'Great Loong Token Claim' : 'Baby Loong Token Claim'
        }
        className='!max-w-[380px]'
      >
        <div className='space-y-2'>
          <div>
            Withdrawn（Max:{' '}
            {(isGreatClaiming
              ? greatFarmingTokenAmount?.toBeExtractedAmount
              : babyFarmingTokenAmount?.toBeExtractedAmount) ?? '???'}
            ）：
          </div>
          <input
            type='number'
            value={toBeExtractedAmount}
            onChange={(e) => setToBeExtractedAmount(Number(e.target.value))}
            max={
              isGreatClaiming
                ? greatFarmingTokenAmount?.toBeExtractedAmount
                : babyFarmingTokenAmount?.toBeExtractedAmount
            }
            className='h-12 w-full rounded-lg border border-solid border-gray-500 bg-white px-4 py-2'
          />
        </div>
        <div className='mt-4 text-sm text-gray-700'>
          The amount is greater than the pending unlock for withdrawal(
          {(isGreatClaiming
            ? greatFarmingTokenAmount?.toBeExtractedUnlockingAmount
            : babyFarmingTokenAmount?.toBeExtractedUnlockingAmount) ?? '???'}
          ), which will generate tax revenue
        </div>
        <div className='mt-6 flex items-center justify-center space-x-8'>
          <Button
            onClick={() => setIsModalOpen(false)}
            className='!border !border-solid !border-gray-500 !bg-white !text-[#6b6c6e]'
          >
            Cancel
          </Button>
          <Button onClick={() => doExtractFarmingTokenAmount(isGreatClaiming)}>
            Claim
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export default function Page() {
  const { walletProvider } = useWeb3ModalProvider();
  const loading = useSelector((state: { loading: boolean }) => state.loading);
  const [refresh, setRefresh] = useState(0);
  // Eth 装备 大龙token是在大龙合约拿
  // 小龙token au盲盒在小龙
  const [userUnopenedBlindBoxGreat, setUserUnopenedBlindBoxGreat] =
    useState<IUnopenedBlindBox>({
      ethBlindBox: 0,
      loongTokenBlindBox: 0,
      equipBlindBox: 0,
      aUBlindBox: 0,
    });
  const [userUnopenedBlindBoxBaby, setUserUnopenedBlindBoxBaby] =
    useState<IUnopenedBlindBox>({
      ethBlindBox: 0,
      loongTokenBlindBox: 0,
      equipBlindBox: 0,
      aUBlindBox: 0,
    });
  const [timeReductionCardNumGreat, setTimeReductionCardNumGreat] = useState(0);
  const [timeReductionCardNumBaby, setTimeReductionCardNumBaby] = useState(0);

  useEffect(() => {
    const fetchTimeReductionCardNum = async () => {
      if (!walletProvider) return;
      const [numGreat, numBaby] = await Promise.all([
        getTimeReductionCardNum(walletProvider, true),
        getTimeReductionCardNum(walletProvider, false),
      ]);
      console.log('get time reduction card num:', numGreat, numBaby);
      setTimeReductionCardNumGreat(numGreat);
      setTimeReductionCardNumBaby(numBaby);
    };
    fetchTimeReductionCardNum();
  }, [walletProvider, refresh]);

  const onRefresh = useCallback(() => {
    const tick = setTimeout(() => {
      setRefresh(refresh + 1);
    }, 1000);
    return () => clearTimeout(tick);
  }, [refresh]);

  const openBlindBox = async () => {
    if (!walletProvider) return;
  };

  const doClaimEthBlindBox = async () => {
    if (!walletProvider) return;
    await claimEthBlindBox(walletProvider);
    onRefresh();
  };
  const doClaimLoongTokenBlindBox = async (isGreatL: boolean) => {
    if (!walletProvider) return;
    await claimLoongTokenBlindBox(walletProvider, isGreatL);
    onRefresh();
  };

  useEffect(() => {
    const fetchUserUnopenedBlindBox = async () => {
      if (!walletProvider) return;
      const [dataGreat, dataBaby] = await Promise.all([
        getUserUnopenedBlindBox(walletProvider, true),
        getUserUnopenedBlindBox(walletProvider, false),
      ]);
      console.log('get user unopened blind box:', dataGreat, dataBaby);
      setUserUnopenedBlindBoxGreat(dataGreat);
      setUserUnopenedBlindBoxBaby(dataBaby);
    };
    fetchUserUnopenedBlindBox();
  }, [walletProvider, refresh]);

  const showBlindBox = true;

  return (
    <div className='min-h-screen bg-[#533837] pt-32'>
      {loading && <Loading />}
      <Header dark={true} />
      <div className='px-[5vw] md:px-[40px]'>
        <h1 className='mb-4 text-2xl font-semibold'>Unopened Treasure</h1>
        <div className='mb-4 flex flex-nowrap space-x-16 overflow-x-auto pb-4'>
          {(userUnopenedBlindBoxGreat.ethBlindBox > 0 || showBlindBox) && (
            <BlindBox
              name='ETH Blind Box'
              desc='(from Great Loong)'
              num={userUnopenedBlindBoxGreat.ethBlindBox}
              image={TreasureImage}
              disabled={userUnopenedBlindBoxGreat.ethBlindBox === 0}
              onOpen={() => doClaimEthBlindBox()}
            />
          )}
          {(userUnopenedBlindBoxGreat.loongTokenBlindBox > 0 ||
            showBlindBox) && (
            <BlindBox
              name='Great Loong Token Blind Box'
              desc='(from Great Loong)'
              num={userUnopenedBlindBoxGreat.loongTokenBlindBox}
              image={TreasureImage2}
              disabled={userUnopenedBlindBoxGreat.loongTokenBlindBox === 0}
              onOpen={() => doClaimLoongTokenBlindBox(true)}
            />
          )}
          {(userUnopenedBlindBoxBaby.loongTokenBlindBox > 0 ||
            showBlindBox) && (
            <BlindBox
              name='Baby Loong Token Blind Box'
              desc='(from Baby Loong)'
              num={userUnopenedBlindBoxBaby.loongTokenBlindBox}
              image={TreasureImage6}
              disabled={userUnopenedBlindBoxBaby.loongTokenBlindBox === 0}
              onOpen={() => doClaimLoongTokenBlindBox(false)}
            />
          )}
          {(userUnopenedBlindBoxGreat.equipBlindBox > 0 || showBlindBox) && (
            <BlindBox
              disabled
              name='Equipment Blind Box'
              desc='(from Great Loong)'
              num={userUnopenedBlindBoxGreat.equipBlindBox}
              image={TreasureImage3}
              onOpen={openBlindBox}
            />
          )}
          {(userUnopenedBlindBoxBaby.aUBlindBox > 0 || showBlindBox) && (
            <BlindBox
              disabled
              name='AU Blind Box'
              desc='(from Baby Loong)'
              num={userUnopenedBlindBoxBaby.aUBlindBox}
              image={TreasureImage4}
              onOpen={openBlindBox}
            />
          )}
          {!showBlindBox &&
            userUnopenedBlindBoxGreat.ethBlindBox === 0 &&
            userUnopenedBlindBoxGreat.loongTokenBlindBox === 0 &&
            userUnopenedBlindBoxGreat.equipBlindBox === 0 &&
            userUnopenedBlindBoxGreat.aUBlindBox === 0 &&
            userUnopenedBlindBoxBaby.ethBlindBox === 0 &&
            userUnopenedBlindBoxBaby.loongTokenBlindBox === 0 &&
            userUnopenedBlindBoxBaby.equipBlindBox === 0 &&
            userUnopenedBlindBoxBaby.aUBlindBox === 0 && (
              <div className='flex h-[360px] w-[100%] items-center justify-center text-xl text-white'>
                You still don&apos;t have a blind box.
              </div>
            )}
        </div>
      </div>

      <div className='px-[5vw] md:px-[40px]'>
        <h1 className='mb-4 text-2xl font-semibold'>Acquired Treasure</h1>
        <OpenedTreasure refresh={refresh} onRefresh={onRefresh} />
      </div>

      <div className='px-[5vw] md:px-[40px]'>
        <h1 className='mb-4 text-2xl font-semibold'>Item</h1>
        <div className='flex h-[360px] flex-nowrap space-x-8 overflow-x-auto pb-4'>
          <BlindBox
            name='Sleep Time Reduction Card[3 Days]'
            desc='(for Great Loong)'
            num={timeReductionCardNumGreat}
            image={TreasureImageCard}
          />
          <BlindBox
            name='Sleep Time Reduction Card[3 Days]'
            desc='(for Baby Loong)'
            num={timeReductionCardNumBaby}
            image={TreasureImageCard2}
          />
          {/* <div className="flex items-center justify-center w-[100%] h-[360px] text-white text-xl">You don't have any items yet.</div> */}
        </div>
      </div>
    </div>
  );
}
