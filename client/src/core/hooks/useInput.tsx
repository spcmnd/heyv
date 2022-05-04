import { useState } from 'react';

function useInput<T>(defaultValue: T) {
  const [value, setValue] = useState(defaultValue);
  const [touched, setTouched] = useState(false);

  const onChange = (value: T): void => setValue(value);
  const onTouched = (): void => setTouched(true);

  return {
    value,
    touched,
    onChange,
    onTouched,
  };
}

export default useInput;
