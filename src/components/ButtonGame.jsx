import React from 'react';

const ButtonGame = ({ texto, onClick }) => {
  return (
    <button onClick={onClick} style={{ marginTop: '1rem' }}>
      {texto}
    </button>
  );
};

export default ButtonGame;
