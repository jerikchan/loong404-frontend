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
import { Suspense, useCallback, useEffect, useState } from 'react';
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

function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-xl [background-color:hsl(240_4.8%_95.9%)] ${className}`}
    ></div>
  );
}

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
  const [url, setUrl] = useState<string>('');

  const doFarming = async () => {
    if (!walletProvider) return;
    // approve
    store.dispatch(saveLoading(true));
    try {
      message.info('approving...');
      await loongApproveFarming(walletProvider, id, isGreatL);
      message.success('approve success!');
    } catch (e) {
      store.dispatch(saveLoading(false));
      message.error(extractReason((e as Error).message) || 'approve failed.');
      console.error(e);
      return;
    }
    // farming
    try {
      message.info('farming...');
      await loongFarming(walletProvider, id, isGreatL);
      store.dispatch(saveLoading(false));
      message.success('farming success!');
      setIsModalOpen(false);
      onSuccess?.();
    } catch (e) {
      store.dispatch(saveLoading(false));
      message.error(extractReason((e as Error).message) || 'farming failed.');
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

  useEffect(() => {
    const doGetLoongImageUrl = async () => {
      if (!data) return;
      const url = await getLoongImageUrl(data.image);
      setUrl(url);
    };
    doGetLoongImageUrl();
  }, [data, getLoongImageUrl]);

  return (
    <>
      {data && (
        <div className='shrink-0 space-y-3 pb-8'>
          <div className='overflow-hidden rounded-md'>
            {url ? (
              <Image
                src={url}
                width={256}
                height={256}
                alt={data.name}
                className='object-cover transition-all hover:scale-105'
              />
            ) : (
              <Skeleton className='h-[256px] w-[256px]' />
            )}
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
    </>
  );
}

function LoongImageSkeleton() {
  return (
    <div className='shrink-0 space-y-3 pb-8'>
      <Skeleton className='h-[256px] w-[256px]' />
      <div>
        <div className='mt-2 px-16'>
          <Skeleton className='h-[12px] w-full' />
        </div>
        <div className='mt-2 px-4'>
          <Skeleton className='h-[40px] w-full' />
        </div>
      </div>
    </div>
  );
}

function LoongFarmingImage({
  data,
  isGreatL,
  onSuccess,
  onError,
  timeReductionCardNum,
}: {
  data: ILoongFarmingData;
  isGreatL: boolean;
  onSuccess?: () => void;
  onError?: () => void;
  timeReductionCardNum: number;
}) {
  const { walletProvider } = useWeb3ModalProvider();
  const [imageData, setImageData] = useState<ILoongImageData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [farmingResult, setFarmingResult] =
    useState<ILoongFarmingResult | null>(null);
  const [farmingCountdownMs, setFarmingCountdownMs] = useState(0);
  const [sleepCountdownMs, setSleepCountdownMs] = useState(0);
  const [url, setUrl] = useState('');

  const doFarmingAgain = async () => {
    if (!walletProvider) return;
    store.dispatch(saveLoading(true));
    // farming
    try {
      message.info('farming...');
      await loongFarming(walletProvider, data.id, isGreatL);
      store.dispatch(saveLoading(false));
      message.success('farming success!');
      onSuccess?.();
    } catch (e) {
      store.dispatch(saveLoading(false));
      message.error(extractReason((e as Error).message) || 'farming failed.');
      console.error(e);
      onError?.();
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
      console.log('result:', result, 'isGreatL:', isGreatL);
      setFarmingResult(result);

      store.dispatch(saveLoading(false));
      message.success('get farming result success!');
      setIsModalOpen(true);
    } catch (e) {
      store.dispatch(saveLoading(false));
      message.error(
        extractReason((e as Error).message) || 'get farming result failed.'
      );
      console.error(e);
      return;
    }
  };
  const closeModal = () => {
    setIsModalOpen(false);
    onSuccess?.();
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
      message.error(extractReason((e as Error).message) || 'redeem failed.');
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
        extractReason((e as Error).message) || 'reduce sleeping time failed.'
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

  useEffect(() => {
    const doGetLoongImageUrl = async () => {
      if (!imageData) return;
      const url = await getLoongImageUrl(imageData.image);
      setUrl(url);
    };
    doGetLoongImageUrl();
  }, [imageData, getLoongImageUrl]);

  let resultMessage = 'loading...';
  if (farmingResult) {
    if (farmingResult.farmingResult === '1') {
      if (farmingResult.farmingReward === '0') {
        // nothing
        resultMessage = `Although it's a bit awkward, this expedition was uneventful, which might also be considered a kind of luck~:)`;
      } else if (farmingResult.farmingReward === '2') {
        // eth
        resultMessage = `I found this in the cyber world, it seems quite valuable, it's all yours now.`;
      } else if (farmingResult.farmingReward === '3') {
        // token
        resultMessage = `I found Loong God energy fragments scattered in the cyber world! Collecting a certain amount can summon my kinfolk.`;
      } else {
        // others
        resultMessage = `Hey! Look what I brought? Humans seem to call this a blind box!`;
      }
    } else if (farmingResult.farmingResult === '3') {
      // sleep
      resultMessage = `I can't imagine there's such a powerful evil spirit in the Cyber World, my father destroyed it and now he's going into seclusion to recuperate`;
    } else {
      // fail
      resultMessage = `Although it's a bit awkward, this expedition was uneventful, which might also be considered a kind of luck~:)`;
    }
  }

  const isFarming = farmingCountdownMs > 0;
  const isSleeping = sleepCountdownMs > 0;

  useEffect(() => {
    const tick = setInterval(check, 1000);
    function check() {
      const left = data.farmingEndTime.getTime() - Date.now();
      if (left > 0) {
        setFarmingCountdownMs(left);
      } else {
        setFarmingCountdownMs(0);
        clearInterval(tick);
      }
    }
    check();
    return () => clearInterval(tick);
  }, [data.farmingEndTime]);

  useEffect(() => {
    const tick = setInterval(check, 1000);
    function check() {
      const left = data.sleepEndTime.getTime() - Date.now();
      if (left > 0) {
        setSleepCountdownMs(left);
      } else {
        setSleepCountdownMs(0);
        clearInterval(tick);
      }
    }
    check();
    return () => clearInterval(tick);
  }, [data.sleepEndTime]);

  return (
    <div className='shrink-0 space-y-3 pb-8'>
      {data && imageData && (
        <>
          <div className='overflow-hidden rounded-md'>
            {url ? (
              <Image
                src={url}
                width={256}
                height={256}
                alt={imageData.name}
                className='object-cover transition-all hover:scale-105'
              />
            ) : (
              <Skeleton className='h-[256px] w-[256px]' />
            )}
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
              <div className='flex h-[40px] flex-col items-center justify-center space-y-2 text-center text-xs leading-none'>
                <div className=''>
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
                  className='mx-auto block rounded-lg bg-[#ebe0cc] px-6 py-2 text-base font-bold text-[#0a0a0b]'
                >
                  Redeem
                </button>
                <button
                  onClick={() => doFarmingAgain()}
                  className='mx-auto block rounded-lg bg-[#ebe0cc] px-6 py-2 text-base font-bold text-[#0a0a0b]'
                >
                  Explore
                </button>
              </div>
            )}
          </div>
          <Modal
            isOpen={isModalOpen}
            onClose={closeModal}
            title='Explore Results'
            className='!max-w-[480px]'
          >
            <>
              <div>{resultMessage}</div>
              <div className='mt-6 flex items-center justify-center space-x-8'>
                <Button onClick={closeModal}>Confirm</Button>
                <Link href='/treasure'>
                  <Button>View treasure</Button>
                </Link>
              </div>
            </>
          </Modal>
        </>
      )}
    </div>
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
  const [timeReductionCardNumGreat, setTimeReductionCardNumGreat] = useState(0);
  const [timeReductionCardNumBaby, setTimeReductionCardNumBaby] = useState(0);
  const [loadingLoongIds, setLoadingLoongIds] = useState(false);
  const [loadingLoongFarmingDataList, setLoadingLoongFarmingDataList] =
    useState(false);

  useEffect(() => {
    if (walletProvider) return;
    setGreatLoongIds([]);
    setBabyLoongIds([]);
    setGreatLoongFarmingDataList([]);
    setBabyLoongFarmingDataList([]);
  }, [walletProvider]);

  useEffect(() => {
    const fetchTimeReductionCardNum = async () => {
      if (!walletProvider) return;
      // 不分大小龙，随便取一个，取大龙的
      const [numGreat, numBaby] = await Promise.all([
        getTimeReductionCardNum(walletProvider, true),
        getTimeReductionCardNum(walletProvider, false),
      ]);
      setTimeReductionCardNumGreat(numGreat);
      setTimeReductionCardNumBaby(numBaby);
    };
    fetchTimeReductionCardNum();
  }, [walletProvider, refresh]);

  useEffect(() => {
    const fetchLoongList = async () => {
      if (!walletProvider) return;
      setLoadingLoongIds(true);
      const [greatLoongIds, babyLoongIds] = await Promise.all([
        getUserLoongList(walletProvider, true),
        getUserLoongList(walletProvider, false),
      ]);
      console.log('greatLoongIds:', greatLoongIds);
      console.log('babyLoongIds:', babyLoongIds);
      setGreatLoongIds(greatLoongIds);
      setBabyLoongIds(babyLoongIds);
      setLoadingLoongIds(false);
    };

    fetchLoongList();
  }, [walletProvider, refresh]);

  useEffect(() => {
    const fetchLoongFarmingList = async () => {
      if (!walletProvider) return;
      setLoadingLoongFarmingDataList(true);
      const [greatLoongFarmingDataList, babyLoongFarmingDataList] =
        await Promise.all([
          getUserLoongFarmingList(walletProvider, true),
          getUserLoongFarmingList(walletProvider, false),
        ]);
      console.log('greatLoongFarmingDataList:', greatLoongFarmingDataList);
      console.log('babyLoongFarmingDataList:', babyLoongFarmingDataList);
      setGreatLoongFarmingDataList(
        greatLoongFarmingDataList.filter((item) => item.id !== '0')
      );
      setBabyLoongFarmingDataList(
        babyLoongFarmingDataList.filter((item) => item.id !== '0')
      );
      setLoadingLoongFarmingDataList(false);
    };

    fetchLoongFarmingList();
  }, [walletProvider, refresh]);

  const delayRefresh = useCallback(() => {
    const tick = setTimeout(() => {
      setRefresh(refresh + 1);
    }, 1000);
    return () => clearTimeout(tick);
  }, [refresh]);

  return (
    <div className='min-h-screen bg-[#533837] pt-32'>
      {loading && <Loading />}
      <Header dark={true} />
      <div className='px-[5vw] md:px-[40px]'>
        <h1 className='mb-4 text-2xl font-semibold'>
          Your divine loong sprite friend
        </h1>
        <div className='flex h-[360px] flex-nowrap space-x-8 overflow-x-auto'>
          {!loadingLoongIds ? (
            <>
              {greatLoongIds.map((id) => (
                <LoongImage
                  key={id}
                  id={id}
                  isGreatL={true}
                  onSuccess={() => delayRefresh()}
                />
              ))}
              {babyLoongIds.map((id) => (
                <LoongImage
                  key={id}
                  id={id}
                  isGreatL={false}
                  onSuccess={() => delayRefresh()}
                />
              ))}
              {!greatLoongIds.length && !babyLoongIds.length && (
                <div className='flex h-[360px] w-[100%] items-center justify-center text-xl text-white'>
                  You don&apos;t have a loong yet.
                </div>
              )}
            </>
          ) : (
            <>
              {[1, 2, 3, 4, 5].map((i) => (
                <LoongImageSkeleton key={i} />
              ))}
            </>
          )}
        </div>
      </div>
      <div className='px-[5vw] md:px-[40px]'>
        <h1 className='mb-4 text-2xl font-semibold'>
          Your explorer loong sprite
        </h1>
        <div className='flex h-[360px] flex-nowrap space-x-8 overflow-x-auto'>
          {!loadingLoongFarmingDataList ? (
            <>
              {greatLoongFarmingDataList.map((data) => (
                <LoongFarmingImage
                  key={data.id}
                  data={data}
                  isGreatL={true}
                  timeReductionCardNum={timeReductionCardNumGreat}
                  onSuccess={() => delayRefresh()}
                  onError={() => delayRefresh()}
                />
              ))}
              {babyLoongFarmingDataList.map((data) => (
                <LoongFarmingImage
                  key={data.id}
                  data={data}
                  isGreatL={false}
                  timeReductionCardNum={timeReductionCardNumBaby}
                  onSuccess={() => delayRefresh()}
                  onError={() => delayRefresh()}
                />
              ))}
              {!greatLoongFarmingDataList.length &&
                !babyLoongFarmingDataList.length && (
                  <div className='flex h-[360px] w-[100%] items-center justify-center text-xl text-white'>
                    You don&apos;t have an explorer loong yet.
                  </div>
                )}
            </>
          ) : (
            <>
              {[1, 2, 3, 4, 5].map((i) => (
                <LoongImageSkeleton key={i} />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
