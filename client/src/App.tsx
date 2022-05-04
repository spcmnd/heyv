import { Route, Routes } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import './App.scss';
import RootLayout from './core/layouts/RootLayout/RootLayout';
import DashboardPage from './home/pages/DashboardPage/DashboardPage';
import TaskCreatePage from './task/pages/TaskCreatePage/TaskCreatePage';

function App() {
  return (
    <div className="App">
      <RootLayout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/create" element={<TaskCreatePage />} />
        </Routes>
      </RootLayout>
    </div>
  );
}

export default App;
