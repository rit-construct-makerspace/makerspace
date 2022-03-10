import { useCallback, useState } from "react";

type Setter<T> = (newState: T) => void;

export default function useTimedState<T>(
  initialState: T,
  callback: (state: T) => void
): [T, Setter<T>, Setter<T>] {
  const [state, setState] = useState<T>(initialState);
  const [timer, setTimer] = useState<NodeJS.Timeout>();

  const timedSetter = useCallback(
    (newState: T) => {
      setState(newState);

      if (timer) clearTimeout(timer);

      const newTimer = setTimeout(() => callback(newState), 500);
      setTimer(newTimer);
    },
    [setState, timer, callback, setTimer]
  );

  return [state, timedSetter, setState];
}
