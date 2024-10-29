import React from 'react';

type Props = {
  children: React.ReactElement | string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
};

const CustomButton = ({
  children,
  type = 'button',
  disabled,
  className = '',
  onClick,
}: Props) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={
        `${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} justify-center items-center h-14 w-full text-sm font-bold leading-4 text-center uppercase whitespace-nowrap bg-primary rounded-2xl` +
        ' ' +
        className
      }
    >
      {children}
    </button>
  );
};

export default CustomButton;
