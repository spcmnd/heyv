import classNames from 'classnames';
import './Button.scss';

type ButtonVariant = 'filled' | 'outlined' | 'text';
type ButtonColor = 'primary' | 'accent';

interface Props {
  children: string;
  color?: ButtonColor;
  icon?: JSX.Element;
  variant?: ButtonVariant;
}

function Button({
  children,
  color = 'primary',
  icon,
  variant = 'filled',
}: Props): JSX.Element {
  return (
    <button className={classNames('Button', color, variant)}>
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
