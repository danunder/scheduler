import { useState } from 'react';

export default function useVisualMode (initial) {

  const [mode, setMode ] = useState(initial);
  const [history, setHistory] = useState([initial]);

  const transition = (val, replace = false) => {
    setHistory(replace? prev => prev : prev => [...prev, val]);
    setMode(val);
  }

  const back = () => {
    if (history.length > 1) {
      setMode(history[history.length -2]);
      setHistory(prev => [...prev].slice(0, -1));
    } else {
      setMode(initial);
      setHistory(initial);
    }
  }

  return { mode, transition, back};

}