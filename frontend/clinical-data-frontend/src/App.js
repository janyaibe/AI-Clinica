import React, { useState } from 'react';

function App() {
  const [date, setDate] = useState('');
  const [activity, setActivity] = useState(null);

  // 1. Hardcode your Fitbit Authorization URL here
  // (the same you used for the OAuth flow)
  const FITBIT_AUTH_URL = `https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=YOUR_CLIENT_ID&redirect_uri=http%3A%2F%2Flocalhost%3A8000%2Fcallback&scope=activity&expires_in=604800&state=xyz123`;

  async function fetchActivity() {
    if (!date) {
      alert('Please enter a date in YYYY-MM-DD format');
      return;
    }

    try {
      // 2. Call your FastAPI endpoint
      const response = await fetch(`http://localhost:8000/daily-activity?date=${date}`);
      if (!response.ok) {
        // If token isn't set or is invalid, you'll see a 401 or 500
        const errorData = await response.json();
        alert(`Error: ${errorData.detail || response.statusText}`);
        return;
      }

      const data = await response.json();
      setActivity(data.activity_data);
    } catch (error) {
      alert(`Failed to fetch activity: ${error}`);
    }
  }

  return (
    <div style={{ margin: '1rem' }}>
      <h1>Fitbit MVP Frontend</h1>
      <ol>
        <li>
          <a href={FITBIT_AUTH_URL}>
            Authorize with Fitbit
          </a> (only needed once if you haven't already)
        </li>
        <li>
          Enter a date (YYYY-MM-DD) and click Fetch Activity.
        </li>
      </ol>

      <input
        type="text"
        placeholder="YYYY-MM-DD"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <button onClick={fetchActivity} style={{ marginLeft: '1rem' }}>
        Fetch Activity
      </button>

      {activity && (
        <div style={{ marginTop: '1rem' }}>
          <h2>Activity Data</h2>
          <pre>{JSON.stringify(activity, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
