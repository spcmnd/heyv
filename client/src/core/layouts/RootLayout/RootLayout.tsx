import { ToastContainer } from 'react-toastify';
import './RootLayout.scss';

interface Props {
  children: JSX.Element | JSX.Element[];
}

function RootLayout({ children }: Props): JSX.Element {
  return (
    <div className="RootLayout">
      <h1>Heyv</h1>
      {children}
      <ToastContainer position="top-right" />
    </div>
  );
}

export default RootLayout;
