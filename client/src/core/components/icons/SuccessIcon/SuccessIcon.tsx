import { ReactComponent as SuccessSvg } from './success.svg';

interface Props {
  onClick?: () => void;
}

function SuccessIcon({ onClick }: Props): JSX.Element {
  return <SuccessSvg onClick={onClick} />;
}

export default SuccessIcon;
