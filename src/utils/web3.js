import SwapABI from "./abi/ISwap.json";
import GreatLABI from "./abi/GreatL.json";
import BabyLABI from "./abi/BabyL.json";
import DataABI from "./abi/IDataStorage.json";
import MintABI from "./abi/IMint.json";
import { ethers } from "ethers";
import { chain } from "../common/config";
import { message } from "antd";
import Decimal from "decimal.js";

const { GreatLoongAddress, BabyLoongAddress, swapAddress, dataAddress, greatLMintAddr, babyLMintAddr } = chain.contract;

/**
 * Swap commission
 * @param {* this is a browser provider ethers can use} walletProvider 
 * @param {* this is a number or string you need to swap} amount 
 * @param {* boolean check is or not Great to Baby} isGreat 
 */
export const getSwapCommission = async(walletProvider) => {
    const ethersProvider = new ethers.BrowserProvider(walletProvider)
    const signer = ethersProvider.getSigner()
    const contract = new ethers.Contract(swapAddress, SwapABI.abi, signer)
    return contract.commission()
}

/**
 * Swap tokens
 * @param {* this is a browser provider ethers can use} walletProvider 
 * @param {* this is a number or string you need to swap} amount 
 * @param {* boolean check is or not Great to Baby} isGreat 
 */
export const swap = async (walletProvider, amount, isGreat) => {
    if (amount == 0) {
        throw new Error('Amount must be greater than 0')
    }
    const ethersProvider = new ethers.BrowserProvider(walletProvider)
    const signer = await ethersProvider.getSigner()
    const balance = await getBalanceLoong(walletProvider, isGreat)
    let approveContract
    if (isGreat) {
        approveContract = new ethers.Contract(GreatLoongAddress, GreatLABI.abi, signer)
    } else {
        approveContract = new ethers.Contract(BabyLoongAddress, BabyLABI.abi, signer)
    }
    if (balance < amount) {
        throw new Error('Insufficient balance')
    }
    const value = ethers.parseEther(amount.toString())
    const approveTx = await approveContract.approve(swapAddress, value)
    message.info('Approving, please wait')
    await approveTx.wait()
    message.info('Approved, swap now')
    const contract = new ethers.Contract(swapAddress, SwapABI.abi, signer)
    if (isGreat) {
        const tx = await contract.swap(GreatLoongAddress, BabyLoongAddress, value)
        await tx.wait()
    } else {
        const tx = await contract.swap(BabyLoongAddress, GreatLoongAddress, value)
        await tx.wait()
    }
}

/**
 * Get balance token of Loong
 * @param {* this is a browser provider ethers can use} walletProvider 
 * @returns amount of GreatLoong
 */
export const getBalanceLoong = async (walletProvider, isGreateL) => {
    const ethersProvider = new ethers.BrowserProvider(walletProvider)
    const signer = await ethersProvider.getSigner()
    const contract = new ethers.Contract(
        isGreateL ? GreatLoongAddress : BabyLoongAddress, 
        isGreateL ? GreatLABI.abi : BabyLABI.abi,
        signer
    )
    const balance = await contract.balanceOf(signer.getAddress())
    const balanceStr = ethers.formatEther(balance)
    return balanceStr.toString()
}

/**
 * Get balance token of Loong
 * @param {* this is a browser provider ethers can use} walletProvider 
 * @returns amount of GreatLoong
 */
export const getOwnerOfLoong = async (walletProvider, isGreateL, id) => {
    const ethersProvider = new ethers.BrowserProvider(walletProvider)
    const signer = await ethersProvider.getSigner()
    const contract = new ethers.Contract(
        isGreateL ? GreatLoongAddress : BabyLoongAddress, 
        isGreateL ? GreatLABI.abi : BabyLABI.abi,
        signer
    )
    const ownerNum = await contract.ownerOf(id)
    const ownerNumStr = ethers.formatEther(ownerNum)
    return ownerNumStr.toString()
}

/**
 * Get invite code
 * @param {* this is a browser provider ethers can use} walletProvider
 * @returns invite code
 */
export const getInviteCode = async (walletProvider) => {
    const ethersProvider = new ethers.BrowserProvider(walletProvider)
    const signer = await ethersProvider.getSigner()
    const contract = new ethers.Contract(dataAddress, DataABI.abi, signer)
    const inviteCode = await contract.getInviteCode(signer.getAddress())
    return inviteCode
}

/**
 * Generate invite code
 * @param {* this is a browser provider ethers can use} walletProvider
 * @returns invite code
 */
export const generateInviteCode = async (walletProvider) => {
    const ethersProvider = new ethers.BrowserProvider(walletProvider)
    const signer = await ethersProvider.getSigner()
    const contract = new ethers.Contract(dataAddress, DataABI.abi, signer)
    const codes = await getInviteCodes(walletProvider)
    let code = createSixLetterNum()
    for (let i = 0; i < 20; i++) {
        if (!codes.includes(code)) {
            break
        }
        code = createSixLetterNum()
    }
    const tx = await contract.generateInviteCode(code)
    await tx.wait()
    return code
}

/**
 * Get invite codes
 * @param {* this is a browser provider ethers can use} walletProvider
 * @returns invite codes
 */
export const getInviteCodes = async (walletProvider) => {
    const ethersProvider = new ethers.BrowserProvider(walletProvider)
    const signer = await ethersProvider.getSigner()
    const contract = new ethers.Contract(dataAddress, DataABI.abi, signer)
    const codes = await contract.getInviteCodes()
    return codes
}

/**
 * Create a 6-letter invite code
 * @returns 6-letter invite code
 */
export const createSixLetterNum = () => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < 6; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

/**
 * Get discount list
 * @param {* this is a browser provider ethers can use} walletProvider
 * @returns {* boolean is or not white list} isWhiteList
 */
export const getDiscountList = async (walletProvider) => {
    const ethersProvider = new ethers.BrowserProvider(walletProvider)
    const signer = await ethersProvider.getSigner()
    const contract = new ethers.Contract(dataAddress, DataABI.abi, signer)
    const num = await contract.getDiscountList(signer.getAddress())
    return num > 0
}

/**
 * get free greatL amount
 * @param {* this is a browser provider ethers can use} walletProvider
 * @returns amount of adult L
 */
export const buyListAdultL = async (walletProvider) => {
    const ethersProvider = new ethers.BrowserProvider(walletProvider)
    const signer = await ethersProvider.getSigner()
    const contract = new ethers.Contract(dataAddress, DataABI.abi, signer)
    const num = await contract.buyListAdultL(signer.getAddress())
    return num
}

/**
 * get free babyL amount
 * @param {* this is a browser provider ethers can use} walletProvider
 * @returns amount of baby L
 */
export const buyListBabyL = async (walletProvider) => {
    const ethersProvider = new ethers.BrowserProvider(walletProvider)
    const signer = await ethersProvider.getSigner()
    const contract = new ethers.Contract(dataAddress, DataABI.abi, signer)
    const num = await contract.buyListBabyL(signer.getAddress())
    return num
}

/**
 * get invite rewards
 * @param {* this is a browser provider ethers can use} walletProvider
 * @param {* boolean check is or not GreatL} isGreateL
 * @returns amount of greatL or babyL
 */
export const getInviteRewards = async (walletProvider, isGreateL) => {
    const ethersProvider = new ethers.BrowserProvider(walletProvider)
    const signer = await ethersProvider.getSigner()
    const contract = new ethers.Contract(isGreateL ? greatLMintAddr : babyLMintAddr, MintABI.abi, signer)
    const num = await contract.getInviteRewards(signer.getAddress())
    const numReal = ethers.formatEther(num)
    return numReal.toString()
}

/**
 * get claim amount
 * @param {* this is a browser provider ethers can use} walletProvider
 * @param {* boolean check is or not GreatL} isGreateL
 * @returns amount of claim current day
 */
export const getClaimAmount = async (walletProvider, isGreateL) => {
    const ethersProvider = new ethers.BrowserProvider(walletProvider)
    const signer = await ethersProvider.getSigner()
    const contract = new ethers.Contract(isGreateL ? greatLMintAddr : babyLMintAddr, MintABI.abi, signer)
    const num = await contract.getClaimAmount(signer.getAddress())
    const numReal = ethers.formatEther(num)
    return numReal.toString()
}

/**
 * claim rewards
 * @param {* this is a browser provider ethers can use} walletProvider
 * @param {* boolean check is or not GreatL} isGreateL
 */
export const claimRewards = async (walletProvider, isGreateL) => {
    const ethersProvider = new ethers.BrowserProvider(walletProvider)
    const signer = await ethersProvider.getSigner()
    const contract = new ethers.Contract(isGreateL ? greatLMintAddr : babyLMintAddr, MintABI.abi, signer)
    const tx = await contract.claim()
    await tx.wait()
}

/**
 * free mint
 * @param {* this is a browser provider ethers can use} walletProvider
 * @param {* boolean check is or not GreatL} isGreateL
 */
export const freeMint = async (walletProvider, isGreateL) => {
    const ethersProvider = new ethers.BrowserProvider(walletProvider)
    const signer = await ethersProvider.getSigner()
    const contract = new ethers.Contract(isGreateL ? greatLMintAddr : babyLMintAddr, MintABI.abi, signer)
    const tx = await contract.freeMint()
    await tx.wait()
}

/**
 * 
 * @param {* this is a browser provider ethers can use} walletProvider 
 * @param {* boolean check is or not GreatL} isGreateL 
 * @param {* num of mint} amount 
 * @param {* this is a six code you will get from other people, can be empty} inviteCode
 */
export const mint = async (walletProvider, isGreateL, amount, price, inviteCode) => {
    const ethersProvider = new ethers.BrowserProvider(walletProvider)
    const signer = await ethersProvider.getSigner()
    const contract = new ethers.Contract(isGreateL ? greatLMintAddr : babyLMintAddr, MintABI.abi, signer)
    const realPrice = new Decimal(price || "0").mul(new Decimal(amount.toString())).toString()
    const value = ethers.parseEther(realPrice)
    const tx = await contract.mint(amount, inviteCode || "", {
        value,
    })
    await tx.wait()
}

/**
 * check Free mint
 * @param {* this is a browser provider ethers can use} walletProvider
 * @param {* boolean check is or not GreatL} isGreateL
 * @returns boolean can or not free mint
 */
export const checkFreeMint = async (walletProvider, isGreateL) => {
    const ethersProvider = new ethers.BrowserProvider(walletProvider)
    const signer = await ethersProvider.getSigner()
    const contract = new ethers.Contract(isGreateL ? greatLMintAddr : babyLMintAddr, MintABI.abi, signer)
    const canFreeMint = await contract.checkFree(signer.getAddress())
    return canFreeMint
}

/**
 * get total minted num
 * @param {* this is a browser provider ethers can use} walletProvider
 * @param {* boolean check is or not GreatL} isGreateL
 * @returns amount of total minted
 */
export const getTotalMinted = async (walletProvider, isGreateL) => {
    const ethersProvider = new ethers.BrowserProvider(walletProvider)
    const signer = await ethersProvider.getSigner()
    const contract = new ethers.Contract(isGreateL ? greatLMintAddr : babyLMintAddr, MintABI.abi, signer)
    const num = await contract.mintedNum()
    return num.toString()
}

// totalSupply
export const totalSupply = async (walletProvider, isGreateL) => {
    const ethersProvider = new ethers.BrowserProvider(walletProvider)
    const signer = await ethersProvider.getSigner()
    const contract = new ethers.Contract(
        isGreateL ? GreatLoongAddress : BabyLoongAddress,
        isGreateL ? GreatLABI.abi : BabyLABI.abi,
        signer
    )
    const num = await contract.totalSupply()
    const numReal = ethers.formatEther(num)
    return numReal.toString()
}

// getPrice
export const getPrice = async (walletProvider, isGreateL) => {
    const ethersProvider = new ethers.BrowserProvider(walletProvider)
    const signer = await ethersProvider.getSigner()
    const contract = new ethers.Contract(isGreateL ? greatLMintAddr : babyLMintAddr, MintABI.abi, signer)
    const num = await contract.price()
    const numReal = ethers.formatEther(num)
    return numReal.toString()
}

// getLimitMemberMint
export const getLimitMemberMint = async (walletProvider, isGreateL) => {
    const ethersProvider = new ethers.BrowserProvider(walletProvider)
    const signer = await ethersProvider.getSigner()
    const contract = new ethers.Contract(isGreateL ? greatLMintAddr : babyLMintAddr, MintABI.abi, signer)
    const num = await contract.limitMintMap(signer.getAddress())
    return Number(num)
}

// getOwned
export const getNftIds = async (walletProvider, isGreateL) => {
    const ethersProvider = new ethers.BrowserProvider(walletProvider)
    const signer = await ethersProvider.getSigner()
    const contract = new ethers.Contract(
        isGreateL ? GreatLoongAddress : BabyLoongAddress,
        isGreateL ? GreatLABI.abi : BabyLABI.abi,
        signer
    )
    const oldData = await contract.getOwned(signer.getAddress())
    const arr = []
    oldData.forEach((item, index) => {
        arr.push(item.toString())
    })
    return arr
}

// getTokenURI
export const getTokenURI = async (walletProvider, isGreateL, tokenId) => {
    const ethersProvider = new ethers.BrowserProvider(walletProvider)
    const signer = await ethersProvider.getSigner()
    const contract = new ethers.Contract(
        isGreateL ? GreatLoongAddress : BabyLoongAddress,
        isGreateL ? GreatLABI.abi : BabyLABI.abi,
        signer
    )
    const uri = await contract.tokenURI(tokenId)
    return uri
}