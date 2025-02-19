import React, { useEffect, useRef, useState } from 'react';
import ButtonGame from './components/ButtonGame';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Confetti from 'react-confetti';
import Score from './components/Score';
import Question from './components/Question';
import Typewriter from './components/Typewriter';

const API_URL = 'https://opentdb.com/api.php?amount=1&type=multiple';

const App = () => {
  const [pergunta, setPergunta] = useState(null);
  const [respostaSelecionada, setRespostaSelecionada] = useState(null);
  const [pontos, setPontos] = useState(0);
  const [jogoEncerrado, setJogoEncerrado] = useState(false);
  const [respondeu, setRespondeu] = useState(false);
  const [bloqueado, setBloqueado] = useState(false); // Para evitar spam de requisições
  const [showConfetti, setShowConfetti] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);

  const pontosRef = useRef(0);
  const audioCorrectRef = useRef(new Audio('./correct.mp3'));
  const audioIncorrectRef = useRef(new Audio('./incorrect.mp3'));

  async function fetchPergunta() {
    if (bloqueado) return; // Evita múltiplas requisições simultâneas
    setBloqueado(true);

    try {
      toast.info('🔄 Loading new question...');
      const response = await fetch(API_URL);

      if (response.status === 429) {
        toast.error('🚨 Many requests! Wait a few seconds...');
        setTimeout(() => {
          setBloqueado(false);
        }, 5000);
        return;
      }

      const data = await response.json();

      if (!data.results || data.results.length === 0) {
        throw new Error('No questions found.');
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

      toast.success('✅ New question loaded!');
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
      toast.success('🎉 Correct answer!');
      pontosRef.current += 1;
      setShowConfetti(true);
      audioCorrectRef.current.play();
    } else {
      toast.error(`😢 Wrong! The correct answer was: ${pergunta.resposta}`);
      audioIncorrectRef.current.play();
      setJogoEncerrado(true);
    }

    setPontos(pontosRef.current);
  }

  function handleNextQuestion() {
    if (!respondeu) {
      toast.warning('⚠️ You need to answer before you can move forward!');
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
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        justifyItems: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <ToastContainer position="top-right" autoClose={3000} />
      {showConfetti && <Confetti />}
      <Typewriter
        text={'🧠 Interactive Quiz 🧠    '}
        onComplete={() => setShowContent(true)}
      />

      {showContent && (
        <>
          {!showQuiz && (
            <button className="fade-in" onClick={() => setShowQuiz(true)}>
              Play
            </button>
          )}

          {showQuiz && (
            <div className=" content fade-in">
              <Score pontos={pontos} />
              {pergunta && (
                <Question
                  pergunta={pergunta.pergunta}
                  alternativas={pergunta.alternativas}
                  respostaSelecionada={respostaSelecionada}
                  verificarResposta={verificarResposta}
                  respondeu={respondeu}
                />
              )}
              {jogoEncerrado ? (
                <ButtonGame onClick={reiniciarJogo} texto={'🔄 Restart'} />
              ) : (
                <ButtonGame
                  onClick={handleNextQuestion}
                  texto={'➡ Next Question'}
                />
              )}
            </div>
          )}
        </>
      )}
      <a
        href="https://github.com/danieltinois/quiz"
        target="_blank"
        rel="noopener noreferrer"
        className="github-logo"
      >
        <img
          src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
          alt="GitHub"
        />
      </a>
    </div>
  );
};

export default App;
