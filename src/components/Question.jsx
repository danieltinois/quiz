import React from 'react';

const Question = ({
  pergunta,
  alternativas,
  respostaSelecionada,
  verificarResposta,
  respondeu,
}) => {
  return (
    <div>
      <h2
        style={{
          display: 'flex',
          justifyContent: 'center',
          margin: '1rem',
        }}
        dangerouslySetInnerHTML={{ __html: pergunta }}
      />
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {alternativas.map((resposta) => (
          <button
            key={resposta}
            onClick={() => verificarResposta(resposta)}
            style={{
              backgroundColor:
                respostaSelecionada === resposta ? 'lightgray' : 'white',
            }}
            disabled={respondeu}
            dangerouslySetInnerHTML={{ __html: resposta }}
          />
        ))}
      </div>
    </div>
  );
};

export default Question;
