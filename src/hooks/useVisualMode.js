import { useState } from 'react';

export default function useVisualMode (initial) {

  const [mode, setMode ] = useState(initial);
  const [history, setHistory] = useState([initial]);

  const transition = (val, replace = false) => {
    if (!replace) setHistory([...history, mode]);
    setMode(val);
  }

  const back = () => history.length > 1? setMode(history.pop()): setMode(initial) ;

  return { mode, transition, back};



}