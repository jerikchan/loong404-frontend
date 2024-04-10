import { type Eip1193Provider, ethers, EventLog, AbiCoder } from 'ethers';
import { chain } from '../common/config';
import GreatLFarmingABI from './abi/GreatLFarming.json';
import BabyLFarmingABI from './abi/BabyLFarming.json';
import {
  getLoongContract,
  getLoongFarmingContract,
  getLoongFarmingAddress,
  getLoongFarmingABI,
} from './common';
import {
  IFarmingETHAmount,
  IFarmingResult,
  IFarmingReward,
  IFarmingTokenAmount,
  ILoongFarmingData,
  ILoongFarmingResult,
  IUnopenedBlindBox,
} from '@/types';
import { weiToDate } from '.';

export const getUserLoongList = async (
  walletProvider: Eip1193Provider,
  isGreatL: boolean
) => {
  const contract = await getLoongFarmingContract(isGreatL, walletProvider);
  const data: ethers.BigNumberish[] = await contract.getUserDragons();
  const result = data.map((item) => ethers.formatUnits(item, 'wei'));
  return result;
};

export const loongApproveFarming = async (
  walletProvider: Eip1193Provider,
  id: string,
  isGreatL: boolean
) => {
  const contract = await getLoongContract(isGreatL, walletProvider);
  const tx: ethers.ContractTransactionResponse = await contract.approve(
    chain.contract.farmingDataStrongAddr,
    ethers.parseUnits(id, 'wei')
  );
  await tx.wait();
};

export const loongFarming = async (
  walletProvider: Eip1193Provider,
  id: string,
  isGreatL: boolean
) => {
  const contract = await getLoongFarmingContract(isGreatL, walletProvider);
  const tx: ethers.ContractTransactionResponse = await contract.dragonFraming(
    ethers.parseUnits(id, 'wei')
  );
  await tx.wait();
};

export const getUserLoongFarmingList = async (
  walletProvider: Eip1193Provider,
  isGreatL: boolean
) => {
  const contract = await getLoongFarmingContract(isGreatL, walletProvider);
  const data: [bigint, bigint, bigint, boolean][] =
    await contract.getDragonFramingList();
  const result: ILoongFarmingData[] = data.map((item) => {
    return {
      id: ethers.formatUnits(item[0], 'wei'),
      farmingEndTime: weiToDate(item[1]),
      sleepEndTime: weiToDate(item[2]),
      farmingStatus: item[3],
    };
  });
  return result;
};

export const getLoongFarmingResult = async (
  walletProvider: Eip1193Provider,
  id: string,
  isGreatL: boolean
) => {
  const contract = await getLoongFarmingContract(isGreatL, walletProvider);
  const tx = <ethers.ContractTransactionResponse>(
    await contract.getDragonFarmingResult(ethers.parseUnits(id, 'wei'))
  );
  const receipt = <ethers.ContractTransactionReceipt>await tx.wait();
  const data = <[bigint, bigint, bigint, bigint]>(
    (<ethers.EventLog>receipt.logs.at(-1)).args.toArray()
  );
  const result: ILoongFarmingResult = {
    id: ethers.formatUnits(data[0], 'wei'),
    // farmingEndTime: weiToDate(data[1]),
    farmingResult: ethers.formatUnits(data[1], 'wei') as IFarmingResult,
    farmingReward: ethers.formatUnits(data[2], 'wei') as IFarmingReward,
  };
  return result;
};

export const getUserUnopenedBlindBox = async (
  walletProvider: Eip1193Provider,
  isGreatL: boolean
) => {
  const contract = await getLoongFarmingContract(isGreatL, walletProvider);
  const data: ethers.Result = await contract.getUserUnopenedBlindBox();
  const result: IUnopenedBlindBox = {
    ethBlindBox: Number(ethers.formatUnits(data[0], 'wei')),
    loongTokenBlindBox: Number(ethers.formatUnits(data[1], 'wei')),
    equipBlindBox: Number(ethers.formatUnits(data[2], 'wei')),
    aUBlindBox: Number(ethers.formatUnits(data[3], 'wei')),
  };
  return result;
};

export const redeemLoong = async (
  walletProvider: Eip1193Provider,
  id: string,
  isGreatL: boolean
) => {
  const contract = await getLoongFarmingContract(isGreatL, walletProvider);
  await contract.redeemDragon(id);
};

export const getTimeReductionCardNum = async (
  walletProvider: Eip1193Provider,
  isGreatL: boolean
) => {
  const contract = await getLoongFarmingContract(isGreatL, walletProvider);
  const num = await contract.getTimeReductionCardNum();
  return Number(ethers.formatUnits(num, 'wei'));
};

export const reduceSleepingTime = async (
  walletProvider: Eip1193Provider,
  id: string,
  isGreatL: boolean
) => {
  const contract = await getLoongFarmingContract(isGreatL, walletProvider);
  await contract.reduceSleepingTime(id);
};

export const claimLoongTokenBlindBox = async (
  walletProvider: Eip1193Provider,
  isGreatL: boolean
) => {
  const contract = await getLoongFarmingContract(isGreatL, walletProvider);
  const data = await contract.claimLongTokenBlindBox();
  return data;
};

export const extractFarmingTokenAmount = async (
  walletProvider: Eip1193Provider,
  amount: number,
  isGreatL: boolean
) => {
  const contract = await getLoongFarmingContract(isGreatL, walletProvider);
  await contract.extractFarmingTokenAmount(
    ethers.parseUnits(String(amount), 'wei')
  );
};

export const getFarmingTokenAmount = async (
  walletProvider: Eip1193Provider,
  isGreatL: boolean
) => {
  const contract = await getLoongFarmingContract(isGreatL, walletProvider);
  const data: [bigint, bigint, bigint, bigint, bigint] =
    await contract.getFarmingTokenAmount();
  const result: IFarmingTokenAmount = {
    farmingTokenAmount: Number(ethers.formatUnits(data[0], 'wei')),
    extractAmount: Number(ethers.formatUnits(data[1], 'wei')),
    toBeExtractedAmount: Number(ethers.formatUnits(data[2], 'wei')),
    toBeExtractedUnlockingAmount: Number(ethers.formatUnits(data[3], 'wei')),
    taxationAmount: Number(ethers.formatUnits(data[4], 'wei')),
  };
  return result;
};

// only great loong
export const claimEthBlindBox = async (walletProvider: Eip1193Provider) => {
  const contract = await getLoongFarmingContract(true, walletProvider);
  await contract.claimEthBlindBox();
};

// only great loong
export const getTalismanNum = async (walletProvider: Eip1193Provider) => {
  const contract = await getLoongFarmingContract(true, walletProvider);
  const num = await contract.getTalismanNum();
  return Number(ethers.formatUnits(num, 'wei'));
};

// only great loong
export const getFarmingEthAmount = async (walletProvider: Eip1193Provider) => {
  const contract = await getLoongFarmingContract(true, walletProvider);
  const data: [bigint, bigint, bigint] = await contract.getFarmingEthAmount();
  const result: IFarmingETHAmount = {
    ethAmount: ethers.formatUnits(data[0], 'ether'),
    ethExtractAmount: ethers.formatUnits(data[1], 'ether'),
    ethToBeExtractedAmount: ethers.formatUnits(data[2], 'ether'),
  };
  return result;
};

// only great loong
export const extractFarmingEthAmount = async (
  walletProvider: Eip1193Provider
) => {
  const contract = await getLoongFarmingContract(true, walletProvider);
  const tx: ethers.ContractTransactionResponse =
    await contract.extractFarmingEthAmount();
  await tx.wait();
};
