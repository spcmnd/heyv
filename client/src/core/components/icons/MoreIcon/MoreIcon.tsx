import classNames from 'classnames';
import { ReactComponent as MoreSvg } from './more.svg';

interface Props {
  className?: string;
  onClick?: () => void;
}

function MoreIcon({ className, onClick }: Props): JSX.Element {
  return (
    <MoreSvg className={classNames('MoreIcon', className)} onClick={onClick} />
  );
}

export default MoreIcon;
