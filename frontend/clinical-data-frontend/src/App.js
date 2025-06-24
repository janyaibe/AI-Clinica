import React, { useState, useEffect } from 'react';

function App() {
  const [date, setDate] = useState('');
  const [token, setToken] = useState('');
  const [activity, setActivity] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem('fitbitToken');
    if (savedToken) setToken(savedToken);
  }, []);

  const fetchActivity = async () => {
    setLoading(true);
    setError('');
    setActivity(null);
    try {
      const res = await fetch(`http://localhost:8000/api/fitbit/daily-activity/${date}?token=${token}`);
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
    // Open Fitbit OAuth link in a new tab
    window.open(
      "https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=23PWH7&redirect_uri=http://localhost:8000/callback&scope=activity%20heartrate%20sleep&expires_in=604800",
      "_blank"
    );
  };

  return (
    <div style={{
      fontFamily: 'Segoe UI, sans-serif',
      backgroundColor: '#f7f9fc',
      minHeight: '100vh',
      padding: '40px'
    }}>
      <div style={{
        maxWidth: '700px',
        margin: 'auto',
        backgroundColor: '#fff',
        borderRadius: '12px',
        padding: '30px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.05)'
      }}>
        <h1>🏃 Fitbit Activity Dashboard</h1>
        <p style={{ color: '#555' }}>
          Enter a date to view your Fitbit activity. No coding needed!
        </p>

        <div style={{ marginBottom: '10px' }}>
          {token ? (
            <span style={{ color: 'green', fontWeight: 'bold' }}>✅ You’re authenticated</span>
          ) : (
            <span style={{ color: 'red', fontWeight: 'bold' }}>❌ Not authenticated</span>
          )}
        </div>

        <button
          onClick={handleReauth}
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
            disabled={loading || !token}
            style={{
              padding: '10px 20px',
              backgroundColor: token ? '#0077cc' : '#ccc',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: token ? 'pointer' : 'not-allowed'
            }}
          >
            {loading ? 'Fetching...' : 'Fetch Activity'}
          </button>
        </div>

        {loading && <p style={{ marginTop: '10px', color: '#666' }}>⏳ Loading activity data...</p>}
        {error && <p style={{ marginTop: '10px', color: 'red' }}>❌ Error: {error}</p>}

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
    </div>
  );
}

export default App;
