import { chain } from '@/common/config';
import { SearchName } from '@/constant';
import {
  useDisconnect,
  useWeb3Modal,
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from '@web3modal/ethers/react';
import { Popover, message } from 'antd';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import CopySvg from '../assets/copy.svg';
import store from '../store/index.js';
import { saveLoading } from '../store/reducer.js';
import {
  claimRewards,
  generateInviteCode,
  getBalanceLoong,
  getClaimAmount,
  getInviteCode,
  getInviteRewards,
  getNftIds,
} from '../utils/web3';
import Button from './ui/Button';
import Modal from './ui/Modal';

const ConnectBtn = styled.button`
  background: #ebe0cc;
  color: #0a0a0b;
  border: 0;
  width: 145px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 16px;
  border-radius: 8px;
`;

const LineBox = styled.ul`
  li {
    width: 100px;
    height: 43px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    a {
    }
  }
`;
const InviteFriendsRow = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 40px;
  margin-bottom: 40px;
  img {
    width: 24px;
    height: 24px;
    cursor: pointer;
  }
  .code {
    margin: 0 4px;
  }
`;

const RewardBox = styled.div`
  .des {
    margin-top: 10px;
    margin-bottom: 30px;
  }
  .rewardTitle {
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 18px;
  }
  .tokens {
    margin-bottom: 20px;
    strong {
      font-size: 32px;
      font-weight: 700;
      color: #792e22;
      margin-right: 8px;
    }
  }
`;

const AssetsBox = styled.div`
  color: #000000;
  font-size: 16px;
  font-family: PingFang SC;
  .desc {
    margin-bottom: 12px;
    font-size: 14px;
  }
  .card {
    border: 1px solid #792e22;
    padding: 16px 18px;
    background-color: #fdfaf1;
  }
  .card + .card {
    margin-top: 16px;
  }
  .title {
    display: flex;
    align-items: center;
    font-weight: 700;
    margin-bottom: 12px;
  }
  .title .desc {
    margin: 0;
    color: #979797;
    margin-left: 4px;
  }

  .row + .row {
    margin-top: 20px;
  }
  .main,
  .sub {
    display: flex;
    align-items: center;
  }
  .num {
    font-size: 32px;
    line-height: 1;
    font-weight: 700;
    color: #792e22;
  }
  .unit {
    margin-left: 8px;
  }
  .sub .desc {
    color: #979797;
    margin: 0;
    line-height: 1;
    width: 100%;
    word-break: break-all;
  }
  .copy {
    margin-left: 4px;
    cursor: pointer;
  }
`;

function truncateString(str: any, maxLength: any) {
  if (str.length <= maxLength) {
    return str;
  }

  const truncatedLength = maxLength - 3;
  const start = str.substring(0, truncatedLength / 2);
  const end = str.substring(str.length - truncatedLength / 2);

  return start + '...' + end;
}
export default function ConnectButton() {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const { open } = useWeb3Modal();
  const { address, chainId, isConnected } = useWeb3ModalAccount();
  const { disconnect } = useDisconnect();
  const { walletProvider } = useWeb3ModalProvider();
  const [isModalOpenInvite, setIsModalOpenInvite] = useState(false);
  const [isModalOpenReward, setIsModalOpenReward] = useState(false);
  const [isModalOpenAssets, setIsModalOpenAssets] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [tokens, setTokens] = useState({ babyLoong: '0.0', greatLoong: '0.0' });
  const [myTokens, setMyTokens] = useState({ babyLoong: '0', greatLoong: '0' });
  const [myNTFs, setMyNTFs] = useState({ babyLoong: 0, greatLoong: 0 });
  const [claimAmount, setClaimAmount] = useState({
    babyLoong: '0.0',
    greatLoong: '0.0',
  });

  const origin =
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : '';

  const onClick = () => {
    open();
  };

  const handleOpenChange = (newOpen: any) => {
    if (!address) return;
    setPopoverOpen(newOpen);
  };

  const disconnectWallet = () => {
    disconnect();
    setPopoverOpen(false);
  };

  const toAccount = () => {
    setPopoverOpen(false);
    window.open(`${chain.explorerUrl}address/${address}`, '_blank');
  };

  const onCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    message.success('Copied');
  };

  const onClose = () => {
    setIsModalOpenInvite(false);
  };

  const inviteCodeInit = async () => {
    let code = await getInviteCode(walletProvider);
    if (!code) {
      try {
        message.info('Generating invite code first');
        store.dispatch(saveLoading(true));
        code = await generateInviteCode(walletProvider);
      } catch (e: any) {}
      store.dispatch(saveLoading(false));
    }
    setInviteCode(code);
  };

  const tokensInit = async () => {
    const greatAmount = await getInviteRewards(walletProvider, true);
    const babyAmount = await getInviteRewards(walletProvider, false);
    setTokens({ greatLoong: greatAmount, babyLoong: babyAmount });
    const greatClaimAmount = await getClaimAmount(walletProvider, true);
    const babyClaimAmount = await getClaimAmount(walletProvider, false);
    setClaimAmount({
      greatLoong: greatClaimAmount,
      babyLoong: babyClaimAmount,
    });
  };

  const assetsInit = async () => {
    const [
      greatLoongTokensRemain,
      babyLoongTokensRemain,
      greatLoongNFTRemain,
      babyLoongNFTRemain,
    ] = await Promise.all([
      getBalanceLoong(walletProvider, true),
      getBalanceLoong(walletProvider, false),
      getNftIds(walletProvider, true),
      getNftIds(walletProvider, false),
    ]);
    setMyTokens({
      greatLoong: greatLoongTokensRemain,
      babyLoong: babyLoongTokensRemain,
    });
    setMyNTFs({
      greatLoong: greatLoongNFTRemain.length,
      babyLoong: babyLoongNFTRemain.length,
    });
  };

  const onInvite = () => {
    setIsModalOpenInvite(true);
    setPopoverOpen(false);
  };

  const onReward = () => {
    setIsModalOpenReward(true);
    setPopoverOpen(false);
  };

  const onAssets = () => {
    setIsModalOpenAssets(true);
    setPopoverOpen(false);
  };

  const onClaim = async () => {
    store.dispatch(saveLoading(true));
    try {
      if (Number(claimAmount.greatLoong) > 0) {
        await claimRewards(walletProvider, true);
      }
      if (Number(claimAmount.babyLoong) > 0) {
        await claimRewards(walletProvider, false);
      }
      if (
        Number(claimAmount.greatLoong) > 0 ||
        Number(claimAmount.babyLoong) > 0
      ) {
        message.success('Claim successfully!');
        setIsModalOpenReward(false);
        tokensInit();
      } else {
        message.warning('No rewards to claim!');
      }
    } catch (e: any) {
      console.error(e);
      const msg = e.message
        ? `Claim failed: ${e.message.split('(')[0]}`
        : 'Claim failed';
      message.error(msg);
    }
    store.dispatch(saveLoading(false));
  };

  useEffect(() => {
    if (address && isModalOpenInvite) {
      inviteCodeInit();
    }
  }, [address, isModalOpenInvite]);

  useEffect(() => {
    if (address && isModalOpenReward) {
      tokensInit();
    }
  }, [address, isModalOpenReward]);

  useEffect(() => {
    if (address && isModalOpenAssets) {
      assetsInit();
    }
  }, [address, isModalOpenAssets]);

  const content = (
    <>
      <LineBox>
        <li onClick={() => toAccount()}>Account</li>
        <li onClick={() => onAssets()}>Assets</li>
        <li onClick={() => onInvite()}>Invite</li>
        <li onClick={() => onReward()}>Reward</li>
        <li onClick={() => disconnectWallet()}>Logout</li>
      </LineBox>
    </>
  );

  const inviteCodeUrl = inviteCode
    ? `${origin}/mint?${SearchName.InviteCode}=${inviteCode}`
    : '';

  return address ? (
    <>
      <Popover
        placement='bottom'
        onOpenChange={handleOpenChange}
        open={popoverOpen}
        content={content}
        trigger='click'
      >
        <ConnectBtn>{truncateString(address, 15)}</ConnectBtn>
      </Popover>
      <Modal
        isOpen={isModalOpenInvite}
        onClose={() => setIsModalOpenInvite(false)}
        title='Invite friends'
      >
        <div>
          Invite your friends to join our community with a custom referral code
        </div>
        <InviteFriendsRow onClick={() => onCopy(inviteCodeUrl)}>
          <div>Invite Code:</div>
          <div className='code'>{inviteCodeUrl}</div>
          <img src={CopySvg.src} alt='copy' title='copy' />
        </InviteFriendsRow>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            style={{ margin: '0 auto', width: '300px', height: '60px' }}
            onClick={onClose}
          >
            Done
          </Button>
        </div>
      </Modal>
      <Modal
        isOpen={isModalOpenReward}
        onClose={() => setIsModalOpenReward(false)}
        title='Claim your reward'
      >
        <RewardBox>
          <div className='des'>
            Earn rewards through various activities like inviting friends to
            mint NFTs
          </div>
          <div className='rewardTitle'>Rewards available(Unlocked/Reward):</div>
          <div className='tokens'>
            <strong>
              {claimAmount.greatLoong}/{tokens.greatLoong}
            </strong>
            Great Loong Tokens
          </div>
          <div className='tokens'>
            <strong>
              {claimAmount.babyLoong}/{tokens.babyLoong}
            </strong>
            Baby Loong Tokens
          </div>
        </RewardBox>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '40px',
          }}
        >
          <Button
            style={{ margin: '0 auto', width: '300px', height: '60px' }}
            onClick={onClaim}
          >
            Claim
          </Button>
        </div>
      </Modal>
      <Modal
        isOpen={isModalOpenAssets}
        onClose={() => setIsModalOpenAssets(false)}
        title='My Assets'
      >
        <AssetsBox>
          <div className='desc'>
            We believe these one-of-a-kind NTFs and tokens will bring me more
            returns
          </div>
          <div className='card'>
            <div className='title'>My Tokens</div>
            <div className='row'>
              <div className='main'>
                <div className='num'>{myTokens.greatLoong}</div>
                <div className='unit'>Great Loong tokens</div>
              </div>
              <div className='sub'>
                <div className='desc'>
                  token contract address: {chain.contract.GreatLoongAddress}
                </div>
                <div
                  className='copy'
                  onClick={() => onCopy(chain.contract.GreatLoongAddress)}
                >
                  <img src={CopySvg.src} alt='copy' title='copy' />
                </div>
              </div>
            </div>
            <div className='row'>
              <div className='main'>
                <div className='num'>{myTokens.babyLoong}</div>
                <div className='unit'>Baby Loong tokens</div>
              </div>
              <div className='sub'>
                <div className='desc'>
                  token contract address: {chain.contract.BabyLoongAddress}
                </div>
                <div
                  className='copy'
                  onClick={() => onCopy(chain.contract.BabyLoongAddress)}
                >
                  <img src={CopySvg.src} alt='copy' title='copy' />
                </div>
              </div>
            </div>
          </div>
          <div className='card'>
            <div className='title'>
              My NFTs<div className='desc'>(support by OpenSea)</div>
            </div>
            <div className='row'>
              <div className='main'>
                <div className='num'>{myNTFs.greatLoong}</div>
                <div className='unit'>Great Loong NFT</div>
              </div>
            </div>
            <div className='row'>
              <div className='main'>
                <div className='num'>{myNTFs.babyLoong}</div>
                <div className='unit'>Baby Loong NFT</div>
              </div>
            </div>
          </div>
        </AssetsBox>
      </Modal>
    </>
  ) : (
    <ConnectBtn onClick={onClick}>Connect Wallet</ConnectBtn>
  );
}
