import classNames from 'classnames';
import { useEffect, useState } from 'react';
import './TextInput.scss';

interface Props {
  hasError?: boolean;
  placeholder?: string;
  value?: string;
  [x: string]: any;
}

function TextInput({
  hasError,
  placeholder,
  value,
  ...rest
}: Props): JSX.Element {
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (value) {
      setInputValue(value);
    }
  }, [value]);

  return (
    <input
      className={classNames('TextInput', { 'has-error': hasError })}
      placeholder={placeholder}
      type="text"
      value={inputValue}
      {...rest}
    />
  );
}

export default TextInput;
