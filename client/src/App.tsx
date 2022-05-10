import { Route, Routes } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import './App.scss';
import RootLayout from './core/layouts/RootLayout/RootLayout';
import DashboardPage from './home/pages/DashboardPage/DashboardPage';
import { TaskProvider } from './task/context/TaskProvider';
import TaskCreatePage from './task/pages/TaskCreatePage/TaskCreatePage';
import TaskUpdatePage from './task/pages/TaskUpdatePage/TaskUpdatePage';

function App() {
  return (
    <div className="App">
      <TaskProvider>
        <RootLayout>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/create" element={<TaskCreatePage />} />
            <Route path="/:id/edit" element={<TaskUpdatePage />} />
          </Routes>
        </RootLayout>
      </TaskProvider>
    </div>
  );
}

export default App;
