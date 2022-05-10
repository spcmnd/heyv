import classNames from 'classnames';
import './Card.scss';

type CardColor = 'primary' | 'secondary';

interface Props {
  children?: JSX.Element | JSX.Element[];
  color?: CardColor;
  className?: string;
}

function Card({ children, color = 'primary', className }: Props): JSX.Element {
  return <div className={classNames('Card', color, className)}>{children}</div>;
}

export default Card;
