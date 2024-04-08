'use client';

import { Header } from '@/components/Header';
import {
  getUserLoongList,
  loongFarming,
  loongApproveFarming,
  getUserLoongFarmingList,
  getLoongFarmingResult,
  redeemLoong,
  getTimeReductionCardNum,
  reduceSleepingTime,
} from '@/utils/farming';
import { useWeb3ModalProvider } from '@web3modal/ethers/react';
import { Suspense, useEffect, useState } from 'react';
import {
  getGreatLoongImageData,
  getBabyLoongImageData,
  getGreatLoongImageUrl,
  getBabyLoongImageUrl,
  formatCountdownMs,
  extractReason,
} from '@/utils';
import {
  ILoongFarmingData,
  ILoongFarmingResult,
  ILoongImageData,
} from '@/types';
import Image from 'next/image';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { message } from 'antd';
import { useSelector } from 'react-redux';
import Loading from '@/components/loading';
import store from '@/store';
import { saveLoading } from '@/store/reducer';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import Link from 'next/link';

function LoongImage({
  id,
  isGreatL,
  onSuccess,
}: {
  id: string;
  isGreatL: boolean;
  onSuccess?: () => void;
}) {
  const { walletProvider } = useWeb3ModalProvider();
  const [data, setData] = useState<ILoongImageData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const doFarming = async () => {
    if (!walletProvider) return;
    // approve
    store.dispatch(saveLoading(true));
    try {
      message.info('approving...');
      await loongApproveFarming(walletProvider, id, isGreatL);
      message.success('approve success! now farming...');
    } catch (e) {
      store.dispatch(saveLoading(false));
      message.error('approve error.');
      console.error(e);
      return;
    }
    // farming
    try {
      await loongFarming(walletProvider, id, isGreatL);
      store.dispatch(saveLoading(false));
      message.success('farming success!');
      setIsModalOpen(false);
      onSuccess?.();
    } catch (e) {
      store.dispatch(saveLoading(false));
      message.error('farming error.');
      console.error(e);
      return;
    }
  };

  const getLoongImageData = isGreatL
    ? getGreatLoongImageData
    : getBabyLoongImageData;
  const getLoongImageUrl = isGreatL
    ? getGreatLoongImageUrl
    : getBabyLoongImageUrl;

  useEffect(() => {
    const fetchData = async () => {
      const data = await getLoongImageData(id);
      setData(data);
    };

    fetchData();
  }, [getLoongImageData, id]);

  return (
    <Suspense fallback={null}>
      {data && (
        <div className='shrink-0 space-y-3 pb-8'>
          <div className='overflow-hidden rounded-md'>
            <Image
              src={getLoongImageUrl(data.image)}
              width={256}
              height={256}
              alt={data.name}
              className='object-cover transition-all hover:scale-105'
            />
          </div>
          <div className='space-y-2 text-sm'>
            <div className='text-center text-xs leading-none'>{data.name}</div>
            <button
              onClick={() => setIsModalOpen(true)}
              className='mx-auto block rounded-lg bg-[#ebe0cc] px-12 py-2 text-base font-bold text-[#0a0a0b]'
            >
              Explore
            </button>
          </div>
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title='Farming'
            className='!max-w-[380px]'
          >
            <div>
              Are you sure you want to send me on an adventure? You might win
              substantial rewards, or you might encounter evil spirits!
            </div>
            <div className='mt-6 flex items-center justify-center space-x-8'>
              <Button
                onClick={() => setIsModalOpen(false)}
                className='!border !border-solid !border-gray-500 !bg-white !text-[#6b6c6e]'
              >
                Cancel
              </Button>
              <Button onClick={() => doFarming()}>Confirm</Button>
            </div>
          </Modal>
        </div>
      )}
    </Suspense>
  );
}

function LoongFarmingImage({
  data,
  isGreatL,
  onSuccess,
  timeReductionCardNum,
}: {
  data: ILoongFarmingData;
  isGreatL: boolean;
  onSuccess?: () => void;
  timeReductionCardNum: number;
}) {
  const { walletProvider } = useWeb3ModalProvider();
  const [imageData, setImageData] = useState<ILoongImageData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [farmingResult, setFarmingResult] =
    useState<ILoongFarmingResult | null>(null);
  const [time, setTime] = useState(0);
  const [farmingCountdownMs, setFarmingCountdownMs] = useState(0);
  const [sleepCountdownMs, setSleepCountdownMs] = useState(0);

  const doFarming = async () => {
    if (!walletProvider) return;
    // approve
    store.dispatch(saveLoading(true));
    try {
      message.info('approving...');
      await loongApproveFarming(walletProvider, data.id, isGreatL);
      message.success('approve success! now farming...');
    } catch (e) {
      store.dispatch(saveLoading(false));
      message.error(extractReason((e as Error).message) || 'approve error.');
      console.error(e);
      return;
    }
    // farming
    try {
      await loongFarming(walletProvider, data.id, isGreatL);
      store.dispatch(saveLoading(false));
      message.success('farming success!');
      onSuccess?.();
    } catch (e) {
      store.dispatch(saveLoading(false));
      message.error(extractReason((e as Error).message) || 'farming error.');
      console.error(e);
      return;
    }
  };

  const fetchLoongFarmingResult = async () => {
    if (!walletProvider) return;
    store.dispatch(saveLoading(true));
    try {
      const result = await getLoongFarmingResult(
        walletProvider,
        data.id,
        isGreatL
      );
      setFarmingResult(result);
      store.dispatch(saveLoading(false));
      message.success('get farming result success!');
      setIsModalOpen(true);
      onSuccess?.();
    } catch (e) {
      store.dispatch(saveLoading(false));
      message.error(
        extractReason((e as Error).message) || 'get farming result error.'
      );
      console.error(e);
      return;
    }
  };

  const doRedeem = async () => {
    if (!walletProvider) return;
    store.dispatch(saveLoading(true));
    try {
      await redeemLoong(walletProvider, data.id, isGreatL);
      store.dispatch(saveLoading(false));
      message.success('redeem success!');
      onSuccess?.();
    } catch (e) {
      store.dispatch(saveLoading(false));
      message.error(extractReason((e as Error).message) || 'redeem error.');
      console.error(e);
      return;
    }
  };

  const doReduceSleepingTime = async () => {
    if (!walletProvider) return;
    store.dispatch(saveLoading(true));
    try {
      await reduceSleepingTime(walletProvider, data.id, isGreatL);
      store.dispatch(saveLoading(false));
      message.success('reduce sleeping time success!');
      onSuccess?.();
    } catch (e) {
      store.dispatch(saveLoading(false));
      message.error(
        extractReason((e as Error).message) || 'reduce sleeping time error.'
      );
      console.error(e);
      return;
    }
  };

  const getLoongImageData = isGreatL
    ? getGreatLoongImageData
    : getBabyLoongImageData;
  const getLoongImageUrl = isGreatL
    ? getGreatLoongImageUrl
    : getBabyLoongImageUrl;

  useEffect(() => {
    const fetchData = async () => {
      const imageData = await getLoongImageData(data.id);
      setImageData(imageData);
    };

    fetchData();
  }, [getLoongImageData, data]);

  let resultMessage = 'loading...';
  if (farmingResult) {
    if (farmingResult.farmingResult === '1') {
      if (farmingResult.farmingReward === '2') {
        resultMessage = `I found this in the cyber world, it seems quite valuable, it's all yours now.`;
      } else if (farmingResult.farmingReward === '3') {
        resultMessage = `I found Loong God energy fragments scattered in the cyber world! Collecting a certain amount can summon my kinfolk.`;
      } else {
        resultMessage = `Hey! Look what I brought? Humans seem to call this a mystery box!`;
      }
    } else {
      resultMessage = `Although it's a bit awkward, this expedition was uneventful, which might also be considered a kind of luck~:)`;
    }
  }

  const isFarming = farmingCountdownMs > 0;
  const isSleeping = sleepCountdownMs > 0;

  useEffect(() => {
    const tick = setInterval(() => {
      const left = data.farmingEndTime.getTime() - Date.now();
      if (left > 0) {
        setFarmingCountdownMs(left);
      } else {
        setFarmingCountdownMs(0);
        clearInterval(tick);
      }
    }, 1000);

    return () => clearInterval(tick);
  }, [data.farmingEndTime]);

  useEffect(() => {
    const tick = setInterval(() => {
      const left = data.sleepEndTime.getTime() - Date.now();
      if (left > 0) {
        setSleepCountdownMs(left);
      } else {
        setSleepCountdownMs(0);
        clearInterval(tick);
      }
    }, 1000);

    return () => clearInterval(tick);
  }, [data.sleepEndTime]);

  return (
    <Suspense fallback={null}>
      {data && imageData && (
        <div className='shrink-0 space-y-3 pb-8'>
          <div className='overflow-hidden rounded-md'>
            <Image
              src={getLoongImageUrl(imageData.image)}
              width={256}
              height={256}
              alt={imageData.name}
              className='object-cover transition-all hover:scale-105'
            />
          </div>
          <div className='space-y-2 text-sm'>
            <div className='text-center text-xs leading-none'>
              {imageData.name}
            </div>
            {data.farmingStatus && isFarming && (
              <div className='flex h-[40px] items-center justify-center text-center text-xs leading-none'>
                Exploring, remaining time:{' '}
                {formatCountdownMs(farmingCountdownMs)}
              </div>
            )}
            {data.farmingStatus && !isFarming && (
              <button
                onClick={() => fetchLoongFarmingResult()}
                className='mx-auto block rounded-lg bg-[#ebe0cc] px-12 py-2 text-base font-bold text-[#0a0a0b]'
              >
                View results
              </button>
            )}
            {!data.farmingStatus && isSleeping && (
              <div className='flex h-[40px] items-center justify-center text-center text-xs leading-none'>
                <div className='flex-1'>
                  Sleeping, remaining time:{' '}
                  {formatCountdownMs(sleepCountdownMs)}
                </div>
                {timeReductionCardNum > 0 && (
                  <button
                    className='space-x-2 rounded-lg bg-[#ebe0cc] px-2 py-1 text-xs font-bold text-[#0a0a0b]'
                    onClick={doReduceSleepingTime}
                  >
                    <span>Time Reduction Card</span>
                    <Tooltip
                      title={`Acquired from blind boxes, it's used to reduce sleep time. Remaining: ${timeReductionCardNum} cards.`}
                    >
                      <InfoCircleOutlined />
                    </Tooltip>
                  </button>
                )}
              </div>
            )}
            {!data.farmingStatus && !isSleeping && (
              <div className='flex items-center justify-between'>
                <button
                  onClick={() => doRedeem()}
                  className='mx-auto block rounded-lg bg-[#ebe0cc] px-8 py-2 text-base font-bold text-[#0a0a0b]'
                >
                  Redeem
                </button>
                <button
                  onClick={() => doFarming()}
                  className='mx-auto block rounded-lg bg-[#ebe0cc] px-8 py-2 text-base font-bold text-[#0a0a0b]'
                >
                  Explore
                </button>
              </div>
            )}
          </div>
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title='Explore Results'
            className='!max-w-[380px]'
          >
            <>
              <div>{resultMessage}</div>
              <div className='mt-6 flex items-center justify-center space-x-8'>
                <Button onClick={() => setIsModalOpen(false)}>Confirm</Button>
                <Link href='/treasure'>
                  <Button onClick={() => setIsModalOpen(false)}>
                    View the treasure chest
                  </Button>
                </Link>
              </div>
            </>
          </Modal>
        </div>
      )}
    </Suspense>
  );
}

export default function Page() {
  const { walletProvider } = useWeb3ModalProvider();

  const [greatLoongIds, setGreatLoongIds] = useState<string[]>([]);
  const [babyLoongIds, setBabyLoongIds] = useState<string[]>([]);
  const [greatLoongFarmingDataList, setGreatLoongFarmingDataList] = useState<
    ILoongFarmingData[]
  >([]);
  const [babyLoongFarmingDataList, setBabyLoongFarmingDataList] = useState<
    ILoongFarmingData[]
  >([]);
  const [refresh, setRefresh] = useState(0);
  const loading = useSelector(({ loading }: { loading: boolean }) => loading);
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

  useEffect(() => {
    const fetchLoongList = async () => {
      if (!walletProvider) return;
      const [greatLoongIds, babyLoongIds] = await Promise.all([
        getUserLoongList(walletProvider, true),
        getUserLoongList(walletProvider, false),
      ]);
      setGreatLoongIds(greatLoongIds);
      setBabyLoongIds(babyLoongIds);
    };

    fetchLoongList();
  }, [walletProvider, refresh]);

  useEffect(() => {
    const fetchLoongFarmingList = async () => {
      if (!walletProvider) return;
      const [greatLoongFarmingDataList, babyLoongFarmingDataList] =
        await Promise.all([
          getUserLoongFarmingList(walletProvider, true),
          getUserLoongFarmingList(walletProvider, false),
        ]);
      console.log('greatLoongFarmingDataList:', greatLoongFarmingDataList);
      console.log('babyLoongFarmingDataList:', babyLoongFarmingDataList);
      setGreatLoongFarmingDataList(greatLoongFarmingDataList);
      setBabyLoongFarmingDataList(babyLoongFarmingDataList);
    };

    fetchLoongFarmingList();
  }, [walletProvider, refresh]);

  const delayCallback = (callback: () => void, delay?: number) => {
    setTimeout(callback, delay || 1000);
  };

  return (
    <div className='min-h-screen bg-[#533837] pt-32'>
      {loading && <Loading />}
      <Header dark={true} />
      <div className='px-[5vw] md:px-[40px]'>
        <h1 className='mb-4 text-2xl font-semibold'>
          Your divine loong sprite friend
        </h1>
        <div className='flex h-[360px] flex-nowrap space-x-8 overflow-x-auto'>
          {greatLoongIds.map((id) => (
            <LoongImage
              key={id}
              id={id}
              isGreatL={true}
              onSuccess={() => delayCallback(() => setRefresh(refresh + 1))}
            />
          ))}
          {babyLoongIds.map((id) => (
            <LoongImage
              key={id}
              id={id}
              isGreatL={false}
              onSuccess={() => delayCallback(() => setRefresh(refresh + 1))}
            />
          ))}
          {!greatLoongIds.length && !babyLoongIds.length && (
            <div className='flex h-[360px] w-[100%] items-center justify-center text-xl text-white'>
              You don&apos;t have a loong yet.
            </div>
          )}
        </div>
      </div>
      <div className='px-[5vw] md:px-[40px]'>
        <h1 className='mb-4 text-2xl font-semibold'>
          Your explorer loong sprite
        </h1>
        <div className='flex h-[360px] flex-nowrap space-x-8 overflow-x-auto'>
          {greatLoongFarmingDataList.map((data) => (
            <LoongFarmingImage
              key={data.id}
              data={data}
              isGreatL={true}
              timeReductionCardNum={timeReductionCardNum}
              onSuccess={() => delayCallback(() => setRefresh(refresh + 1))}
            />
          ))}
          {babyLoongFarmingDataList.map((data) => (
            <LoongFarmingImage
              key={data.id}
              data={data}
              isGreatL={false}
              timeReductionCardNum={timeReductionCardNum}
              onSuccess={() => delayCallback(() => setRefresh(refresh + 1))}
            />
          ))}
          {!greatLoongFarmingDataList.length &&
            !babyLoongFarmingDataList.length && (
              <div className='flex h-[360px] w-[100%] items-center justify-center text-xl text-white'>
                You don&apos;t have an explorer loong yet.
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
