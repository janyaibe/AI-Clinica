import React, { useState, useEffect } from 'react';
import './App.css';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:8000';

function ConnectorCard({ connector, isPrimary, onConnect }) {
  const live = connector.status === 'live';
  return (
    <div style={{
      border: live ? '1px solid #0077cc' : '1px solid #e0e0e0',
      borderRadius: '10px',
      padding: '16px',
      backgroundColor: live ? '#f0f8ff' : '#fafafa',
      textAlign: 'left'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <strong>{connector.name}</strong>
        <span style={{
          fontSize: '11px',
          fontWeight: 'bold',
          padding: '2px 8px',
          borderRadius: '999px',
          color: live ? '#fff' : '#666',
          backgroundColor: live ? '#0077cc' : '#e0e0e0'
        }}>
          {live ? 'LIVE' : 'ROADMAP'}
        </span>
      </div>
      <p style={{ fontSize: '13px', color: '#777', margin: '4px 0 10px' }}>{connector.category}</p>
      <p style={{ fontSize: '13px', color: '#555' }}>{connector.description}</p>
      {live ? (
        <button
          onClick={onConnect}
          style={{
            marginTop: '10px',
            padding: '8px 16px',
            backgroundColor: '#0077cc',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          {isPrimary ? '🔁 Connect Fitbit' : 'Connect'}
        </button>
      ) : (
        <a
          href={`mailto:support@aiclinica.com?subject=Request integration: ${encodeURIComponent(connector.name)}`}
          style={{ fontSize: '13px', color: '#0077cc' }}
        >
          Request this integration →
        </a>
      )}
    </div>
  );
}

function LandingView({ connectors, connectorsError, onConnect }) {
  return (
    <div>
      <h1>🩺 AIClinica</h1>
      <p style={{ color: '#555' }}>
        One integration layer for decentralized trial data — wearables, home monitoring devices,
        implantables, and EHR feeds — normalized into a single trial-ready record.
      </p>

      <button
        onClick={onConnect}
        style={{
          margin: '10px 0 24px',
          padding: '10px 20px',
          backgroundColor: '#0077cc',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        🔁 Try the live demo — Connect Fitbit
      </button>

      <h2 style={{ fontSize: '16px', color: '#333' }}>Data sources</h2>
      {connectorsError && <p style={{ color: 'red' }}>❌ {connectorsError}</p>}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '12px',
        marginTop: '10px'
      }}>
        {connectors.map(connector => (
          <ConnectorCard
            key={connector.id}
            connector={connector}
            isPrimary={connector.id === 'fitbit'}
            onConnect={onConnect}
          />
        ))}
      </div>
    </div>
  );
}

function Dashboard({ date, setDate, loading, error, activity, fetchActivity, onReauth }) {
  return (
    <div>
      <h1>🏃 AIClinica — Wearable Data Integration</h1>
      <p style={{ color: '#555' }}>
        Connect a Fitbit device and pull daily activity data into the trial record.
      </p>

      <div style={{ marginBottom: '10px' }}>
        <span style={{ color: 'green', fontWeight: 'bold' }}>✅ You’re authenticated</span>
      </div>

      <button
        onClick={onReauth}
        style={{
          marginBottom: '20px',
          padding: '8px 16px',
          backgroundColor: '#0077cc',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer'
        }}
      >
        🔁 Re-authenticate with Fitbit
      </button>

      <div>
        <input
          type="text"
          placeholder="Date (YYYY-MM-DD)"
          value={date}
          onChange={e => setDate(e.target.value)}
          style={{ padding: '10px', marginRight: '10px', width: '250px' }}
        />
        <button
          onClick={fetchActivity}
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: '#0077cc',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Fetching...' : 'Fetch Activity'}
        </button>
      </div>

      {loading && (
        <p style={{ marginTop: '10px', color: '#666' }}>
          <span className="spinner" /> Loading activity data...
        </p>
      )}
      {error && <p style={{ marginTop: '10px', color: 'red' }}>❌ Error: {error}</p>}

      {!loading && !error && !activity && (
        <p style={{ marginTop: '10px', color: '#999' }}>Pick a date and fetch activity to see it here.</p>
      )}

      {activity && (
        <div style={{
          marginTop: '30px',
          padding: '20px',
          backgroundColor: '#f0f8ff',
          borderRadius: '8px',
          border: '1px solid #cce5ff'
        }}>
          <h2>📅 Activity Summary: {date}</h2>
          <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
            <li><strong>Calories Out:</strong> {activity.summary?.caloriesOut}</li>
            <li><strong>Resting BMR:</strong> {activity.summary?.caloriesBMR}</li>
            <li><strong>Steps:</strong> {activity.summary?.steps}</li>
            <li><strong>Active Score:</strong> {activity.summary?.activeScore}</li>
            <li><strong>Sedentary Minutes:</strong> {activity.summary?.sedentaryMinutes}</li>
            <li><strong>Lightly Active Minutes:</strong> {activity.summary?.lightlyActiveMinutes}</li>
            <li><strong>Fairly Active Minutes:</strong> {activity.summary?.fairlyActiveMinutes}</li>
            <li><strong>Very Active Minutes:</strong> {activity.summary?.veryActiveMinutes}</li>
          </ul>
        </div>
      )}
    </div>
  );
}

function App() {
  const [date, setDate] = useState('');
  const [token, setToken] = useState('');
  const [activity, setActivity] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [connectors, setConnectors] = useState([]);
  const [connectorsError, setConnectorsError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get('fitbit_token');
    const urlError = params.get('fitbit_error');

    if (urlToken) {
      localStorage.setItem('fitbitToken', urlToken);
      setToken(urlToken);
      window.history.replaceState({}, '', window.location.pathname);
    } else if (urlError) {
      setError(`Fitbit authentication failed: ${urlError}`);
      window.history.replaceState({}, '', window.location.pathname);
    } else {
      const savedToken = localStorage.getItem('fitbitToken');
      if (savedToken) setToken(savedToken);
    }
  }, []);

  useEffect(() => {
    fetch(`${API_BASE}/api/connectors`)
      .then(res => {
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return res.json();
      })
      .then(data => setConnectors(data.connectors || []))
      .catch(() => setConnectorsError('Could not load data source list from the backend.'));
  }, []);

  const fetchActivity = async () => {
    setLoading(true);
    setError('');
    setActivity(null);
    try {
      const res = await fetch(`${API_BASE}/api/fitbit/daily-activity/${date}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Status ${res.status}: ${text}`);
      }
      const data = await res.json();
      setActivity(data.activity_data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReauth = () => {
    const clientId = process.env.REACT_APP_FITBIT_CLIENT_ID;
    const redirectUri = process.env.REACT_APP_FITBIT_REDIRECT_URI || 'http://localhost:8000/callback';
    // Navigate the current tab to Fitbit; it redirects back to our backend, which
    // redirects back here with the token so the whole flow completes in one tab.
    window.location.href = `https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=activity%20heartrate%20sleep&expires_in=604800`;
  };

  return (
    <div style={{
      fontFamily: 'Segoe UI, sans-serif',
      backgroundColor: '#f7f9fc',
      minHeight: '100vh',
      padding: '40px'
    }}>
      <div style={{
        maxWidth: '760px',
        margin: 'auto',
        backgroundColor: '#fff',
        borderRadius: '12px',
        padding: '30px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.05)'
      }}>
        {token ? (
          <Dashboard
            date={date}
            setDate={setDate}
            loading={loading}
            error={error}
            activity={activity}
            fetchActivity={fetchActivity}
            onReauth={handleReauth}
          />
        ) : (
          <LandingView connectors={connectors} connectorsError={connectorsError} onConnect={handleReauth} />
        )}
      </div>
    </div>
  );
}

export default App;

