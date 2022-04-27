import classNames from 'classnames';
import ChevronIcon from '../icons/ChevronIcon/ChevronIcon';
import './SelectInput.scss';

interface Props {
  placeholder?: string;
  [x: string]: any;
}

function SelectInput({ placeholder, ...rest }: Props): JSX.Element {
  return (
    <div className={classNames('SelectInput')} {...rest}>
      <input placeholder="This is a test..." readOnly />
      <ChevronIcon />
    </div>
  );
}

export default SelectInput;
