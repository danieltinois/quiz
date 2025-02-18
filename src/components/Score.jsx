import React from 'react';

const Score = ({ pontos }) => {
  return (
    <h3
      style={{ display: 'flex', justifyContent: 'center', paddingTop: '1rem' }}
    >
      Score: {pontos}
    </h3>
  );
};

export default Score;
