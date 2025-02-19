import { useState, useEffect } from 'react';

const Typewriter = ({ text, speed = 100, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[index]);
        setIndex(index + 1);
      }, speed);

      return () => clearTimeout(timeout);
    } else if (onComplete) {
      onComplete();
    }
  }, [index, text, speed, onComplete]);

  return (
    <h1
      style={{
        display: 'flex',
        justifyContent: 'center',
        fontFamily: 'Jolly Lodger, serif',
        fontSize: '4.0rem',
        fontWeight: '400',
      }}
      className="headline"
    >
      {displayedText}
    </h1>
  );
};

export default Typewriter;
