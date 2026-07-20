import "./App.scss";

import Sidebar from "./components/layout/Sidebar";
import { ConfigProvider } from "antd";
import { AuthProvider } from "./providers/AuthProvider";
import { BrowserRouter, Routes, Route } from "react-router";
import Dashboard from "./pages/Dashboard";

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
        <div className="flex h-screen">
          <Sidebar />
          <main className="flex-1 px-12 py-10">
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Dashboard />} />
              </Routes>
            </BrowserRouter>
          </main>
        </div>
      </AuthProvider>
    </ConfigProvider>
  );
}

export default App;
