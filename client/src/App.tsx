import { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import './App.scss';
import SelectInput from './core/components/SelectInput/SelectInput';
import TextInput from './core/components/TextInput/TextInput';
import heyvHttp from './core/http/heyv-http';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    heyvHttp
      .get('/')
      .then((res: AxiosResponse): { message: string } => res.data)
      .then((data: { message: string }): void => setMessage(data.message));
  }, []);

  return (
    <div className="App">
      <h1>Heyv</h1>
      <p>{message}</p>
      <TextInput placeholder="Put yout text here..." />
      <SelectInput placeholder="Put yout text here..." />
    </div>
  );
}

export default App;
