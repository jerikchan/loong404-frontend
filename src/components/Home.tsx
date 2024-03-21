import styled from 'styled-components';
import LoongBg from '@/assets/loong-bg2.png';
import SwapToken from '@/components/SwapToken';
import Loading from '@/components/loading';
import { useSelector } from 'react-redux';
import { Header } from './Header';
import Link from 'next/link';

const BgBox = styled.div`
  width: 100%;
  min-height: 100vh;
  background: #fdfaf1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
`;
const InnerBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  position: relative;
  .bg {
    width: 100%;
  }
`;

const InnerBoxContent = styled.div`
  width: 100%;
  display: flex;
`;

const Leftbox = styled.div`
  position: absolute;
  background: #fff;
  width: 330px;
  height: 140px;
  box-shadow: 0 0 4px #999;
  border-radius: 15px;
  left: 3vw;
  bottom: 25px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  span {
    color: rgba(0, 0, 0, 0.85);
    font-size: 25px;
    padding-right: 20px;
  }
  .lft {
    position: absolute;
    left: 0;
    bottom: 0;
  }
  @media (max-width: 1100px) {
    display: none;
  }
`;

const FloatBox = styled.div`
  position: absolute;
  right: 0;
  top: 20vw;
  @media (max-width: 1440px) {
    right: 0;
    top: 16vw;
  }
  @media (max-width: 1100px) {
    /* top: auto;
        bottom: 20vw;
        right: 10vw;
        left: 10vw; */
    padding: 35px 0;
    position: static;
    margin: 0 20px;
  }
  & > *:not(:first-child) {
    margin-top: 20px;
  }
`;

const RhtBox = styled.div`
  padding: 20px;
  background: #83271c;
  box-shadow: 0 0 4px #999;
  border-radius: 15px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  box-sizing: border-box;
  .rht {
    position: absolute;
    left: 0;
    bottom: 0;
  }
  @media (max-width: 1440px) {
    top: 28vw;
  }
  @media (max-width: 1100px) {
    border-radius: 15px;
    justify-content: center;
    .rht {
      width: 38vw;
    }
  }
`;

const RhtInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 30px;
  padding: 0 30px;
  .lft {
    font-size: 25px;
  }
  .top {
    color: #e5959a;
    display: flex;
    flex-direction: column;
  }
  a {
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
  }

  .center,
  .com {
    text-align: center;
  }
  @media (max-width: 1100px) {
    .lft {
      width: 150px;
      font-size: 13px;
      text-align: center;
    }
    .top {
      margin-bottom: 10px;
    }
  }
`;
const BtnRht = styled.div`
  width: 120px;
  height: 45px;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  background: #fff;
  justify-content: center;
  color: #6b6c6e;
  font-size: 12px;
  border-radius: 15px;
  cursor: pointer;

  @media (max-width: 1100px) {
    width: 26vw;
    height: 45px;
    margin: 0 15px;
  }
`;

export function Home() {
  const loading = useSelector((state: any) => state.loading);

  return (
    <BgBox>
      {loading && <Loading />}
      <Header dark={true} />
      <InnerBox>
        <InnerBoxContent>
          <img src={LoongBg.src} alt='' className='bg' />
        </InnerBoxContent>
        <FloatBox>
          <RhtBox>
            <RhtInner>
              <div className='lft'>
                <div className='top'>ERC404 AI Gnosis</div>
                <div className='price'>
                  <span className='center'> 300 Great Loong</span>
                </div>
              </div>
              <BtnRht>
                <Link href={'/mint/great'}>Mint Now</Link>
              </BtnRht>
            </RhtInner>
          </RhtBox>
          <RhtBox>
            <RhtInner>
              <div className='lft'>
                <div className='top'>ERC404 AI Gnosis</div>
                <div className='price'>
                  <span className='center'> 3000 Baby Loong</span>
                </div>
              </div>
              <BtnRht>
                <Link href={'/mint/baby'}>Mint Now</Link>
              </BtnRht>
            </RhtInner>
          </RhtBox>
          <RhtBox>
            <RhtInner>
              <div className='lft'>
                <div className='top'>Chat with Me</div>
              </div>
              <BtnRht>
                <Link href={'/chat'}>Start</Link>
              </BtnRht>
            </RhtInner>
          </RhtBox>
        </FloatBox>
      </InnerBox>
      {/* Swap */}
      <InnerBox>
        <SwapToken />
      </InnerBox>
    </BgBox>
  );
}
