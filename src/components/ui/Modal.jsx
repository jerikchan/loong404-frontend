import React from 'react';
import styled from 'styled-components';
import CloseSvg from '../../assets/close.svg';

const ModalWrapper = styled.div`
  display: ${(props) => (props.$isOpen ? 'block' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  color: #000;
  z-index: 99;
  margin: 0!important;
`;

const ModalContent = styled.div`
  background-color: white;
  width: 50%;
  max-width: 680px;
  margin: 100px auto;
  padding: 20px 40px;
  @media (max-width: 768px) {
    width: 90%;
  }
`;

const CloseButton = styled.span`
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;

  &:hover {
    color: black;
    text-decoration: none;
    cursor: pointer;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-weight: 700;
`;

function Modal(props) {
  const { isOpen, onClose, children, title, className } = props;
  return (
    <ModalWrapper $isOpen={isOpen}>
      <ModalContent className={className}>
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
          <CloseButton onClick={onClose}>
            <img src={CloseSvg.src} alt='close' />
          </CloseButton>
        </ModalHeader>
        {children}
      </ModalContent>
    </ModalWrapper>
  );
}

export default Modal;
