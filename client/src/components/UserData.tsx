import { useState, useEffect } from "react";
import { getUserData, logout } from "../services/api";

interface UserDataProps {
  onDisconnect: () => void;
}

const UserData: React.FC<UserDataProps> = ({ onDisconnect: onLogout }) => {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getUserData();
        setUserData(data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch data from Oolio API");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      onLogout();
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  if (loading) {
    return <div className="user-data loading">Loading user data...</div>;
  }

  if (error) {
    return (
      <div className="user-data error">
        <p className="error-message">{error}</p>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="user-data">
      <div className="api-data">
        <h3>Oolio API Data</h3>
        <pre>{JSON.stringify(userData, null, 2)}</pre>
      </div>

      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>
    </div>
  );
};

export default UserData;
