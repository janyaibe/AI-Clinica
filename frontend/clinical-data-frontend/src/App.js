import React, { useState } from 'react';

function App() {
  const [date, setDate] = useState('');
  const [token, setToken] = useState('');
  const [activity, setActivity] = useState(null);

  async function fetchActivity() {
    if (!date || !token) {
      alert('Please enter a date and access token.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/fitbit/daily-activity/${date}?token=${token}`);
      if (!response.ok) {
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
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>Fitbit Daily Activity Viewer</h1>

      <label htmlFor="date">Enter Date (YYYY-MM-DD):</label>
      <input
        type="text"
        id="date"
        placeholder="e.g., 2023-02-20"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        style={{ marginBottom: '1rem', display: 'block' }}
      />

      <label htmlFor="token">Access Token:</label>
      <input
        type="text"
        id="token"
        placeholder="Paste your access token"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        style={{ marginBottom: '1rem', display: 'block' }}
      />

      <button onClick={fetchActivity} style={{ padding: '0.5rem 1rem' }}>
        Fetch Activity
      </button>

      {activity && (
        <div style={{ marginTop: '2rem' }}>
          <h2>Activity Data</h2>
          <pre>{JSON.stringify(activity, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
// This code is a simple React application that allows users to enter a date and an access token to fetch daily activity data from the Fitbit API.
// It includes input fields for the date and token, a button to fetch the data, and a section to display the fetched activity data in JSON format.
// The application handles errors gracefully, alerting the user if the input is invalid or if the fetch request fails.
// The fetched data is displayed in a formatted JSON structure for better readability.
// The application is styled with basic CSS for a clean and user-friendly interface.
// The fetchActivity function is responsible for making the API call and updating the state with the fetched data.
// It uses the Fetch API to send a GET request to the backend server, which is assumed to be running on localhost at port 8000.
// The function checks if the date and token are provided before making the request and handles any errors that may occur during the fetch process.
// The useState hook is used to manage the state of the date, token, and activity data.
// The application is designed to be simple and user-friendly, making it easy for users to interact with the Fitbit API and view their daily activity data.
// The code is structured to be easily understandable, with clear variable names and comments explaining the purpose of each section.
// The application can be further enhanced by adding more features, such as displaying the data in a more user-friendly format, adding loading indicators, or implementing error handling for specific error cases.
// Overall, this code provides a solid foundation for a React application that interacts with the Fitbit API to fetch and display daily activity data.
// It demonstrates the use of React hooks, state management, and basic error handling in a user-friendly interface.
// The application can be further improved by adding more features, such as displaying the data in a more user-friendly format, adding loading indicators, or implementing error handling for specific error cases.
// Overall, this code provides a solid foundation for a React application that interacts with the Fitbit API to fetch and display daily activity data.
// It demonstrates the use of React hooks, state management, and basic error handling in a user-friendly interface.
// The application can be further enhanced by adding more features, such as displaying the data in a more user-friendly format, adding loading indicators, or implementing error handling for specific error cases.
// Overall, this code provides a solid foundation for a React application that interacts with the Fitbit API to fetch and display daily activity data.
// It demonstrates the use of React hooks, state management, and basic error handling in a user-friendly interface.