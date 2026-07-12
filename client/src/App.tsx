import "./App.scss";

import Sidebar from "./shared/Sidebar";

function App() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 p-8">
      </main>
    </div>
  );
}

export default App;
