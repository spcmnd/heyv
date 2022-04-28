import { ReactComponent as ChevronSvg } from './chevron.svg';

interface Props {
  className?: string;
}

function ChevronIcon({ className }: Props): JSX.Element {
  return <ChevronSvg className={className} />;
}

export default ChevronIcon;
