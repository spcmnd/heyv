import "./App.scss";

import Sidebar from "./components/layout/Sidebar";
import { ConfigProvider } from "antd";

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#46566b",
        },
      }}
    >
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 p-8"></main>
      </div>
    </ConfigProvider>
  );
}

export default App;
