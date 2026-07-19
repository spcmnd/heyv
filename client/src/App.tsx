import "./App.scss";

import Sidebar from "./components/layout/Sidebar";
import { ConfigProvider } from "antd";
import { AuthProvider } from "./providers/AuthProvider";

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
          <main className="flex-1 p-8"></main>
        </div>
      </AuthProvider>
    </ConfigProvider>
  );
}

export default App;
