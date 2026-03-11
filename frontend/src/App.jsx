import { useState } from "react";
import { Toaster } from "react-hot-toast";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";

function App() {
  const [token, setToken] = useState(localStorage.getItem("linknest_token"));
  const [showLogin, setShowLogin] = useState(false);

  const handleLogin = (newToken) => {
    localStorage.setItem("linknest_token", newToken);
    setToken(newToken);
    setShowLogin(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("linknest_token");
    setToken(null);
  };

  return (
    <div className="min-h-screen bg-primary">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1e293b",
            color: "#e2e8f0",
            border: "1px solid #334155",
          },
        }}
      />
      {showLogin && !token ? (
        <LoginPage onLogin={handleLogin} onBack={() => setShowLogin(false)} />
      ) : (
        <DashboardPage
          isAdmin={!!token}
          onLogout={handleLogout}
          onLoginClick={() => setShowLogin(true)}
        />
      )}
    </div>
  );
}

export default App;
