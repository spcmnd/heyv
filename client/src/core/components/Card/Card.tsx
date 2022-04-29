import classNames from 'classnames';
import './Card.scss';

type CardColor = 'primary' | 'secondary';

interface Props {
  children?: JSX.Element | JSX.Element[];
  color?: CardColor;
}

function Card({ children, color = 'primary' }: Props): JSX.Element {
  return <div className={classNames('Card', color)}>{children}</div>;
}

export default Card;
