import classNames from 'classnames';
import './TextInput.scss';

interface Props {
  placeholder?: string;
  [x: string]: any;
}

function TextInput({ placeholder, ...rest }: Props): JSX.Element {
  return (
    <input
      className={classNames('TextInput')}
      placeholder={placeholder}
      type="text"
      {...rest}
    />
  );
}

export default TextInput;
