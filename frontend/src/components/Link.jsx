import React from 'react';
import { useRouter } from '../contexts/RouterContext';

const Link = ({ to, children, className, params, onClick }) => {
  const { navigate } = useRouter();

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (onClick) onClick(e);
    navigate(to, params);
  };

  return (
    <button
      onClick={handleClick}
      className={className || "text-blue-600 hover:text-blue-800 underline"}
      type="button"
    >
      {children}
    </button>
  );
};

export default Link;