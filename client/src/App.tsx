import "./App.scss";

import Sidebar from "./components/layout/Sidebar";
import { ConfigProvider } from "antd";
import { AuthProvider } from "./providers/AuthProvider";
import { BrowserRouter, Routes, Route } from "react-router";
import Dashboard from "./pages/Dashboard";
import Tasks from "./domains/task/pages/Tasks";

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#46566b",
        },
      }}
    >
      <AuthProvider>
        <BrowserRouter>
          <div className="flex h-screen">
            <Sidebar />
            <main className="flex-1 px-12 py-10">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/tasks" element={<Tasks />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ConfigProvider>
  );
}

export default App;
