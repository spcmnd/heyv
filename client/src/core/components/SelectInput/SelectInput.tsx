import classNames from 'classnames';
import { MouseEvent, useEffect, useState } from 'react';
import ChevronIcon from '../icons/ChevronIcon/ChevronIcon';
import './SelectInput.scss';

interface SelectInputOption<T extends string> {
  label: string;
  value: T;
}

interface Props {
  hasError?: boolean;
  options?: SelectInputOption<string>[];
  placeholder?: string;
  onValueChange?: (value: string) => void;
  value?: string;
  [x: string]: any;
}

function SelectInput({
  hasError,
  options = [],
  placeholder,
  onValueChange,
  value,
  ...rest
}: Props): JSX.Element {
  const [opened, setOpened] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const handleInputClick = (event: MouseEvent): void => {
    if (!options.length) {
      return;
    }

    setOpened(!opened);
  };

  const handleOptionClick = (value: string) => {
    setInputValue(value);
    setOpened(false);
    onValueChange && onValueChange(value);
  };

  useEffect(() => {
    if (value) {
      setInputValue(value);
    }
  }, [value]);

  return (
    <div
      className={classNames('SelectInput', { 'has-error': hasError })}
      {...rest}
    >
      <div className="field" onClick={handleInputClick}>
        <input placeholder="This is a test..." readOnly value={inputValue} />
        <ChevronIcon className={classNames('icon', { opened })} />
      </div>
      <div className={classNames('dropdown', { opened })}>
        {!!options.length &&
          options.map((o, i) => (
            <div
              key={i}
              className="option"
              onClick={() => handleOptionClick(o.value)}
            >
              <p>{o.label}</p>
            </div>
          ))}
      </div>
    </div>
  );
}

export default SelectInput;
