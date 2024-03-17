import styled from 'styled-components';

const Box = styled.div`
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  position: fixed;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1999;
  top: 0;
  left: 0;
`;
const LoaderBox = styled.div`
  .loader {
    width: 120px;
    height: 20px;
    border-radius: 20px;
    background:
      repeating-linear-gradient(135deg, #f03355 0 10px, #ffa516 0 20px) 0/0%
        no-repeat,
      repeating-linear-gradient(135deg, #ddd 0 10px, #eee 0 20px) 0/100%;
    animation: l3 2s infinite;
  }
  @keyframes l3 {
    100% {
      background-size: 100%;
    }
  }
`;
export default function Loading() {
  return (
    <Box>
      <LoaderBox>
        <div className='loader' />
      </LoaderBox>
    </Box>
  );
}
