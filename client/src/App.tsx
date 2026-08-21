import { App as AntdApp, ConfigProvider } from "antd";
import { AuthProvider } from "./providers/AuthProvider";
import { useAuth } from "./providers/authContext.ts";
import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router";
import Sidebar from "./components/layout/Sidebar";
import BottomNav from "./components/layout/BottomNav";
import RequireAuth from "./components/layout/RequireAuth";
import FullPageSpinner from "./components/FullPageSpinner.tsx";
import Dashboard from "./pages/Dashboard";
import Tasks from "./domains/task/pages/Tasks";
import Login from "./pages/Login";

function AppShell() {
  return (
    <div className="flex h-screen flex-col md:flex-row">
      <Sidebar />
      <main className="flex-1 overflow-y-auto px-4 py-6 pb-28 md:px-12 md:py-10 md:pb-10">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}

function LoginRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return <FullPageSpinner />;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <Login />;
}

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#46566b",
        },
      }}
    >
      <AntdApp>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginRoute />} />
              <Route element={<RequireAuth />}>
                <Route element={<AppShell />}>
                  <Route index element={<Dashboard />} />
                  <Route path="tasks" element={<Tasks />} />
                </Route>
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </AntdApp>
    </ConfigProvider>
  );
}

export default App;
