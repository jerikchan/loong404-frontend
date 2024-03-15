import { getPrice, checkFreeMint, getLimitMemberMint } from "../utils/web3"

export const getInitMintInfo = async (walletProvider: any, isGreatL: boolean) => {
  const [price, isFree, limitMember] = await Promise.all([
    getPrice(walletProvider, isGreatL),
    checkFreeMint(walletProvider, isGreatL),
    getLimitMemberMint(walletProvider, isGreatL)
  ])
  return {
    price,
    isFree,
    limitMember,
  }
}

export const getPercent = (minted: number, total: number) => {
  return Number((minted / total) * 100).toFixed(2);
}

export const addCommasToNumber =(number: number) =>{
  let numbB = Number(number)
  return numbB?.toLocaleString('en-US');
}