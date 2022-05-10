import classNames from 'classnames';
import './Button.scss';

type ButtonVariant = 'filled' | 'outlined' | 'text';
type ButtonColor = 'primary' | 'accent' | 'on-light';

interface Props {
  children: string;
  color?: ButtonColor;
  icon?: JSX.Element;
  variant?: ButtonVariant;
  disabled?: boolean;
  [x: string]: any;
}

function Button({
  children,
  color = 'primary',
  icon,
  variant = 'filled',
  disabled = false,
  ...x
}: Props): JSX.Element {
  return (
    <button
      className={classNames('Button', color, variant, { disabled })}
      {...x}
    >
      {icon ? (
        <>
          {icon} <span>{children}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}

export default Button;
