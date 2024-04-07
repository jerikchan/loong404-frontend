import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
  background-color: #792e22;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 20px;
  font-weight: 400;
  &:hover {
    background-color: #792e22;
  }
`;

const Button = ({
  children,
  onClick,
  style,
  className,
}: {
  children: React.ReactNode;
  onClick?: React.PointerEventHandler<HTMLButtonElement>;
  style?: React.HTMLAttributes<HTMLButtonElement>['style'];
  className?: string;
}) => {
  return (
    <StyledButton onClick={onClick} style={style} className={className}>
      {children}
    </StyledButton>
  );
};

export default Button;
