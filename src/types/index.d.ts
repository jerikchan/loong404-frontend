export interface IUsage {
  id: number;
  address: string;
  month: string;
  count: number;
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      RELEASE_TARGET: 'development' | 'production' | undefined;
      NEXT_PUBLIC_GREAT_LOONG_IMAGE_CID: string;
      NEXT_PUBLIC_BABY_LOONG_IMAGE_CID: string;
    }
  }
}

export interface ILoongImageData {
  image: string;
  name: string;
}

export interface ILoongFarmingData {
  id: string;
  farmingEndTime: Date;
  sleepEndTime: Date;
  farmingStatus: boolean;
}

/**
 * 1 成功
 * 2 失败
 * 3 睡眠
 */
export type IFarmingResult = '1' | '2' | '3';

/**
 * 0 无
 * 1 开光符
 * 2 eth 盲盒
 * 3 token 盲盒
 * 4 装备盲盒
 * 5 au 盲盒
 */
export type IFarmingReward = '0' | '1' | '2' | '3' | '4' | '5';
export interface ILoongFarmingResult {
  id: string;
  // farmingEndTime: Date;
  farmingReward: IFarmingReward;
  farmingResult: IFarmingResult;
}

export interface IUnopenedBlindBox {
  ethBlindBox: number;
  loongTokenBlindBox: number;
  equipBlindBox: number;
  aUBlindBox: number;
}

export interface IFarmingETHAmount {
  ethAmount: string;
  ethExtractAmount: string;
  ethToBeExtractedAmount: string;
}

export interface IFarmingTokenAmount {
  farmingTokenAmount: number;
  extractAmount: number;
  toBeExtractedAmount: number;
  toBeExtractedUnlockingAmount: number;
  taxationAmount: number;
}
