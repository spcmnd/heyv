import { ReactComponent as MoreSvg } from './more.svg';

interface Props {
  className?: string;
}

function MoreIcon({ className }: Props): JSX.Element {
  return <MoreSvg className={className} />;
}

export default MoreIcon;
