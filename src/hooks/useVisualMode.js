import { useState } from 'react';

export default function useVisualMode (initial) {

  const [mode, setMode ] = useState(initial);
  const [history, setHistory] = useState([initial]);

  const transition = (val, replace = false) => {
    setHistory(replace? prev => prev : prev => [...prev, val]);
    setMode(val);
  }

  const back = () => {
    setMode(history.length > 1? history[history.length -2] : initial);
    setHistory(history.length > 1? prev => [...prev].slice(0, -1) : initial);
  }

  return { mode, transition, back};



}