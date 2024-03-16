import styled from 'styled-components';
import Link from 'next/link';
import Image from 'next/image';
import ConnectButton from '@/components/ConnectButton';
import HomeLogo from '@/assets/logoHome.png';
import LogoMint from '@/assets/logoMint.png';

const LogoBox = styled.div`
  position: absolute;
  left: 40px;
  top: 40px;
  z-index: 99;
  cursor: pointer;
  width: 200px;
  //background: #83271c;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  height: 40px;
  font-size: 23px;
  border-radius: 10px;
  a,
  img {
    width: 100%;
    height: 100%;
  }
  @media (max-width: 1100px) {
    left: 5vw;
    top: 5vw;
    width: 145px;
  }
`;

const ConnectBox = styled.div`
  position: absolute;
  right: 40px;
  top: 40px;
  z-index: 999;
  @media (max-width: 1100px) {
    right: 5vw;
    top: 5vw;
  }
`;

export function Header(props: { dark?: boolean }) {
  return (
    <>
      <LogoBox>
        <Link href='/'>
          <Image
            width={200}
            height={40}
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
