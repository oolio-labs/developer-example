import { useState, useEffect } from "react";
import { getAuthStatus } from "./services/api";
import ConnectButton from "./components/ConnectButton";
import UserData from "./components/UserData";
import UserLocations from "./components/UserLocations";
import { AuthStatus } from "./types";
import "./App.css";

function App() {
  const [authStatus, setAuthStatus] = useState<AuthStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      const status = await getAuthStatus();
      setAuthStatus(status);
    } catch (error) {
      console.error("Error checking auth status:", error);
      setAuthStatus({ authenticated: false });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();

    // Check if we've been redirected back from authorization
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get("status");

    // Clean up URL parameters
    if (status) {
      window.history.replaceState({}, document.title, window.location.pathname);

      if (status === "error") {
        alert("Authentication failed. Please try again.");
      }
    }
  }, []);

  const handleDisconnect = () => {
    setAuthStatus({ authenticated: false });
  };

  if (loading) {
    return <div className="app loading">Loading...</div>;
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>App</h1>
      </header>

      <main className="app-main">
        {authStatus?.authenticated ? (
          <div className="user-data-container">
            <UserData onDisconnect={handleDisconnect} />
            <UserLocations />
          </div>
        ) : (
          <div className="connect-container">
            <h2>Connect to Oolio API</h2>
            <p>
              Click the button below to authorize this app to access your Oolio
              data.
            </p>
            <ConnectButton />
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>Oolio &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}

export default App;
