import styled from 'styled-components';
import Link from 'next/link';
import Image from 'next/image';
import ConnectButton from '@/components/ConnectButton';
import HomeLogo from '@/assets/logoHome.png';
import LogoMint from '@/assets/logoMint.png';

const LogoBox = styled.div`
  position: absolute;
  left: 40px;
  top: 20px;
  z-index: 99;
  cursor: pointer;
  width: 200px;
  //background: #83271c;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  height: 58px;
  font-size: 23px;
  border-radius: 10px;
  a,
  img {
    width: 100%;
    height: 100%;
  }
  @media (max-width: 1100px) {
    left: 5vw;
    top: 2vw;
    width: 145px;
    height: 42px;
  }
`;

const ConnectBox = styled.div`
  position: absolute;
  right: 40px;
  top: 20px;
  z-index: 999;
  @media (max-width: 1100px) {
    right: 5vw;
    top: 2vw;
  }
`;

export function Header(props: { dark?: boolean }) {
  return (
    <>
      <LogoBox>
        <Link href='/'>
          <Image
            width={734}
            height={214}
            src={props.dark ? LogoMint.src : HomeLogo.src}
            alt='logo'
          />
        </Link>
      </LogoBox>
      <ConnectBox>
        <ConnectButton />
      </ConnectBox>
    </>
  );
}
