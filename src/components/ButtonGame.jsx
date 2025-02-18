import React from 'react';

const ButtonGame = ({ texto, ...rest }) => {
  return <button {...rest}>{texto}</button>;
};

export default ButtonGame;
