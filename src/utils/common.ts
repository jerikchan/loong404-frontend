import { chain } from '@/common/config';
import GreatLFarmingABI from './abi/GreatLFarming.json';
import BabyLFarmingABI from './abi/BabyLFarming.json';
import GreatLoongABI from './abi/GreatL.json';
import BabyLoongABI from './abi/BabyL.json';
import { ethers } from 'ethers';

const {
  greatLFarmingAddr,
  babyLFarmingAddr,
  GreatLoongAddress,
  BabyLoongAddress,
} = chain.contract;

export function getLoongFarmingAddress(isGreatL: boolean) {
  return isGreatL ? greatLFarmingAddr : babyLFarmingAddr;
}

export function getLoongFarmingABI(isGreatL: boolean) {
  return isGreatL ? GreatLFarmingABI.abi : BabyLFarmingABI.abi;
}

export function getLoongAddress(isGreatL: boolean) {
  return isGreatL ? GreatLoongAddress : BabyLoongAddress;
}

export function getLoongABI(isGreatL: boolean) {
  return isGreatL ? GreatLoongABI.abi : BabyLoongABI.abi;
}

export async function getLoongFarmingContract(
  isGreatL: boolean,
  walletProvider: ethers.Eip1193Provider
) {
  const ethersProvider = new ethers.BrowserProvider(walletProvider);
  const signer = await ethersProvider.getSigner();
  const contract = new ethers.Contract(
    getLoongFarmingAddress(isGreatL),
    getLoongFarmingABI(isGreatL),
    signer
  );
  return contract;
}

export async function getLoongContract(
  isGreatL: boolean,
  walletProvider: ethers.Eip1193Provider
) {
  const ethersProvider = new ethers.BrowserProvider(walletProvider);
  const signer = await ethersProvider.getSigner();
  const contract = new ethers.Contract(
    getLoongAddress(isGreatL),
    getLoongABI(isGreatL),
    signer
  );
  return contract;
}
