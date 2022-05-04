import { ReactComponent as AddSvg } from './add.svg';

interface Props {
  className?: string;
}

function AddIcon({ className }: Props): JSX.Element {
  return <AddSvg className={className} />;
}

export default AddIcon;
