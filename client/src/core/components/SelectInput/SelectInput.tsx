import classNames from 'classnames';
import { MouseEvent, useState } from 'react';
import ChevronIcon from '../icons/ChevronIcon/ChevronIcon';
import './SelectInput.scss';

interface Props {
  placeholder?: string;
  [x: string]: any;
}

function SelectInput({ placeholder, ...rest }: Props): JSX.Element {
  const [opened, setOpened] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const handleDropdownClick = (event: MouseEvent): void => {
    setOpened(!opened);
  };

  return (
    <div className={classNames('SelectInput')} {...rest}>
      <div className="field" onClick={handleDropdownClick}>
        <input placeholder="This is a test..." readOnly value={inputValue} />
        <ChevronIcon className={classNames('icon', { opened })} />
      </div>
      <div className={classNames('dropdown', { opened })}>
        <div className="option">
          <p>Item</p>
        </div>
      </div>
    </div>
  );
}

export default SelectInput;
