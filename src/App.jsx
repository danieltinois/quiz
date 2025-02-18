import React, { useEffect, useRef, useState } from 'react';
import ButtonGame from './components/ButtonGame';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Confetti from 'react-confetti';

const API_URL = 'https://opentdb.com/api.php?amount=1&type=multiple';

const App = () => {
  const [pergunta, setPergunta] = useState(null);
  const [respostaSelecionada, setRespostaSelecionada] = useState(null);
  const [pontos, setPontos] = useState(0);
  const [jogoEncerrado, setJogoEncerrado] = useState(false);
  const [respondeu, setRespondeu] = useState(false);
  const [bloqueado, setBloqueado] = useState(false); // Para evitar spam de requisições
  const [showConfetti, setShowConfetti] = useState(false);

  const pontosRef = useRef(0);
  const audioRef = useRef(new Audio('./correct.mp3'));

  async function fetchPergunta() {
    if (bloqueado) return; // Evita múltiplas requisições simultâneas
    setBloqueado(true);

    try {
      toast.info('🔄 Carregando nova pergunta...');
      const response = await fetch(API_URL);

      if (response.status === 429) {
        toast.error('🚨 Muitas requisições! Aguarde alguns segundos...');
        setTimeout(() => {
          setBloqueado(false);
        }, 5000);
        return;
      }

      const data = await response.json();

      if (!data.results || data.results.length === 0) {
        throw new Error('Nenhuma pergunta encontrada.');
      }

      const resultado = data.results[0];

      console.log(resultado);

      const perguntaFormatada = {
        pergunta: resultado.question,
        alternativas: [
          ...resultado.incorrect_answers,
          resultado.correct_answer,
        ].sort(() => Math.random() - 0.5),
        resposta: resultado.correct_answer,
      };

      setPergunta(perguntaFormatada);
      setRespostaSelecionada(null);
      setRespondeu(false);
      setJogoEncerrado(false);
      setShowConfetti(false);

      toast.success('✅ Nova pergunta carregada!');
    } catch (erro) {
      toast.error(`❌ Erro: ${erro.message}`);
    } finally {
      setTimeout(() => setBloqueado(false), 1000); // Libera a requisição após 1s
    }
  }

  function verificarResposta(resposta) {
    if (!pergunta) return;

    setRespondeu(true);
    setRespostaSelecionada(resposta);

    if (resposta === pergunta.resposta) {
      toast.success('🎉 Resposta correta!');
      pontosRef.current += 1;
      setShowConfetti(true);
      audioRef.current.play();
    } else {
      toast.error(`😢 Errado! A resposta correta era: ${pergunta.resposta}`);
      setJogoEncerrado(true);
    }

    setPontos(pontosRef.current);
  }

  function handleNextQuestion() {
    if (!respondeu) {
      toast.warning('⚠️ Você precisa responder antes de avançar!');
      return;
    }
    fetchPergunta();
  }

  function reiniciarJogo() {
    setPontos(0);
    pontosRef.current = 0;
    fetchPergunta();
  }

  useEffect(() => {
    fetchPergunta();
  }, []);

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />
      {showConfetti && <Confetti />}
      <h1 style={{ display: 'flex', justifyContent: 'center' }}>
        🧠 Interactive Quiz
      </h1>
      <h3
        style={{
          display: 'flex',
          justifyContent: 'center',
          paddingTop: '1rem',
        }}
      >
        Score: {pontos}
      </h3>
      {pergunta && (
        <>
          <h2
            style={{
              display: 'flex',
              justifyContent: 'center',
              margin: '1rem',
            }}
            dangerouslySetInnerHTML={{ __html: pergunta.pergunta }}
          />
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              {pergunta.alternativas.map((resposta) => (
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
        </>
      )}
      {jogoEncerrado ? (
        <ButtonGame onClick={reiniciarJogo} texto={'🔄 Restart'} />
      ) : (
        <ButtonGame onClick={handleNextQuestion} texto={'➡ Next Question'} />
      )}
    </div>
  );
};

export default App;
