'use client';
import { useEffect, useState } from 'react';
import {
  useWeb3Modal,
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from '@web3modal/ethers/react';
import { InputNumber, Select, message } from 'antd';
import styled from 'styled-components';
import ArrowSvg from '../assets/arrow.svg';
import { swap, getSwapCommission, getBalanceLoong } from '../utils/web3';
import store from '../store/index.js';
import { saveLoading } from '../store/reducer.js';

const Box = styled.div`
  background: #fdfaf1;
  color: #000000;
  padding-bottom: 120px;
  @media (max-width: 1100px) {
    margin: 0 20px;
    padding-bottom: 60px;
  }
  .title {
    font-size: 80px;
    font-weight: 700;
    color: #000000;
    text-align: center;
    padding-top: 100px;
    @media (max-width: 1100px) {
      font-size: 40px;
      padding-top: 50px;
    }
  }
  .des {
    font-size: 20px;
    font-weight: 400;
    color: #000000;
    text-align: center;
    padding-top: 40px;
    width: 100%;
    max-width: 1287px;
    margin: 0 auto;
    line-height: 28px;
  }
  .form {
    margin-top: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .tip {
      margin-bottom: 20px;
      svg {
        width: 32px;
        height: 32px;
      }
    }
    .item {
      background: #fdfaf2;
      border: 1px solid #792e22;
      width: auto;
      height: 130px;
      margin: 0 auto 20px;
      padding: 30px 40px;
      box-sizing: border-box;
      @media (max-width: 1100px) {
        width: 100%;
      }
      @media (max-width: 680px) {
        padding: 30px 20px;
      }
      .label {
        font-size: 16px;
        font-weight: 400;
        color: #000000;
        margin-bottom: 8px;
        display: flex;
        align-items: center;
      }
      .remain {
        font-size: 14px;
        color: #000000;
        margin-left: 4px;
      }
      .max {
        margin-left: 8px;
        border: 1px solid #000;
        font-size: 12px;
        padding: 2px;
        cursor: pointer;
      }
      .value {
        display: flex;
        align-items: center;
        .ant-input-number {
          width: 300px !important;
          height: 48px;
          border: none;
          box-shadow: none;
          border-radius: 0;
          .ant-input-number-input-wrap {
            height: 100%;
          }
          input {
            height: 100%;
            font-size: 16px;
            line-height: 100%;
            color: #000;
          }
        }
        .ant-select {
          width: 216px;
          margin-left: 6px;
          .ant-select-selector {
            border: none;
            background: transparent;
            box-shadow: none;
            .ant-select-selection-item {
              color: #000 !important;
              font-size: 20px;
            }
          }
          .ant-select-arrow {
            color: #000;
          }
        }
      }
    }
  }
`;

const Btn = styled.button`
  border: 0;
  background: #792e22;
  height: 60px;
  width: 601px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 400;
  color: #fff;
  user-select: none;
  cursor: pointer;
  margin-top: 10px;
  @media (max-width: 1100px) {
    width: 100%;
  }
  .tips {
    font-size: 12px;
    margin-left: 12px;
    opacity: 0.6;
    margin-top: 6px;
  }
`;

const options = [
  { value: 1, label: 'Great Loong tokens' },
  { value: 2, label: 'Baby Loong tokens' },
];

const SwapToken = () => {
  const { open } = useWeb3Modal();
  const { address, chainId } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();
  const [balance, setBalance] = useState<any>({
    greatLoong: null,
    babyLoong: null,
  });
  const [firstValue, setFirstValue] = useState(1);
  const [secondValue, setSecondValue] = useState(2);
  const [firstInput, setFirstInput] = useState(0);
  const [secondInput, setSecondInput] = useState(0);
  const [commission, setCommission] = useState(5 / 1000);

  /** select change */
  const onFirstChange = (value: any) => {
    setFirstValue(value);
    setSecondValue(value === 1 ? 2 : 1);
  };

  /** select change */
  const onSecondChange = (value: any) => {
    setSecondValue(value);
    setFirstValue(value === 1 ? 2 : 1);
  };

  /** input change */
  const onInputChange = (value: any) => {
    setFirstInput(value);
    setSecondInput(value * (1 - commission));
  };

  const onMax = () => {
    onInputChange(firstValue === 1 ? balance.greatLoong : balance.babyLoong);
  };

  const onBtnClick = async () => {
    if (!address) {
      open();
    } else {
      store.dispatch(saveLoading(true));
      try {
        await swap(walletProvider, firstInput, firstValue === 1);
        message.success('Swap success');
        setFirstInput(0);
      } catch (e: any) {
        console.error(e);
        const msg = e.message
          ? `Swap failed: ${e.message.split('(')[0]}`
          : 'Swap failed';
        message.error(msg);
      }
      store.dispatch(saveLoading(false));
    }
  };

  const getBalance = async () => {
    const [greatLoong, babyLoong] = await Promise.all([
      getBalanceLoong(walletProvider, true),
      getBalanceLoong(walletProvider, false),
    ]);
    setBalance({
      greatLoong,
      babyLoong,
    });
  };

  useEffect(() => {
    if (!!commission) {
      return;
    }
    getSwapCommission(walletProvider)
      .then((commission) => {
        setCommission(commission / 1000);
      })
      .catch((e) => {
        // message.error('Get commission failed');
        console.error(e);
        setCommission(5 / 1000);
      });
  }, [walletProvider, commission, setCommission]);

  useEffect(() => {
    if (!address) {
      return;
    }
    getBalance();
    const timer = setInterval(() => {
      getBalance();
    }, 5000);
    return () => {
      clearInterval(timer);
    };
  }, [address, chainId]);

  return (
    <Box>
      <h2 className='title'>Tokens Swap</h2>
      <div className='des'>
        The official provides a 1:1 trading pool for Great Loong-Baby Loong
        tokens. The pool is locked, ensuring the upper limit of the number of
        Great Loong and Baby Loong NFTs and the upper limit of 404 token
        circulation.
      </div>
      <div className='form'>
        <div className='item'>
          <div className='label'>
            You Pay
            <div className='remain'>
              ({firstValue === 1 ? balance.greatLoong : balance.babyLoong})
            </div>
            <div className='max' onClick={() => onMax()}>
              Max
            </div>
          </div>
          <div className='value'>
            <InputNumber
              controls={false}
              value={firstInput}
              onChange={onInputChange}
            />
            <Select
              options={options}
              value={firstValue}
              onChange={onFirstChange}
            />
          </div>
        </div>
        <img className='tip' src={ArrowSvg.src} />
        <div className='item'>
          <div className='label'>You Get</div>
          <div className='value'>
            <InputNumber controls={false} readOnly value={secondInput} />
            <Select
              options={options}
              value={secondValue}
              onChange={onSecondChange}
            />
          </div>
        </div>
        <Btn onClick={onBtnClick}>
          {!address ? (
            'Connect Wallet'
          ) : commission ? (
            <>
              Swap<span className='tips'>(fee rate: {commission * 100}%)</span>
            </>
          ) : (
            'Swap'
          )}
        </Btn>
      </div>
    </Box>
  );
};

export default SwapToken;
