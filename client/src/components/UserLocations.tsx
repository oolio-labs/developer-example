import { useState, useEffect } from "react";
import { getLocations } from "../services/api";

const UserLocations: React.FC = () => {
  const [orgs, setOrgs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);
        const data = await getLocations();
        setOrgs(data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch locations");
        setOrgs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchLocations();
  }, []);

  if (loading) {
    return <div className="user-data loading">Loading locations...</div>;
  }

  if (error) {
    return <div className="user-data error">{error}</div>;
  }

  return (
    <div className="user-data">
      <h3>Organization Locations</h3>
      {orgs.length === 0 ? (
        <p>No organizations or locations found.</p>
      ) : (
        orgs.map((org) => (
          <div key={org.id} style={{ marginBottom: "1.5rem" }}>
            <strong>{org.name || org.id}</strong>
            {org.locations && org.locations.length > 0 ? (
              <ul>
                {org.locations.map((loc: any) => (
                  <li key={loc.id || loc.name}>{loc.name || loc.id}</li>
                ))}
              </ul>
            ) : (
              <p>No locations found for this organization.</p>
            )}
            {org.locationsError && (
              <p style={{ color: "red" }}>{org.locationsError}</p>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default UserLocations; 