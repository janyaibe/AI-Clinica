import os
import requests

FITBIT_BASE_URL = "https://api.fitbit.com/1/user/-/activities"

def get_daily_activity_data(date: str):
    """
    Call Fitbit's API to retrieve daily activity data for a given date.
    You need a valid access token with the necessary scopes (e.g., activity).
    """
    # Normally, you'd fetch the user token from a database. 
    # We'll use an environment variable or placeholder for now:
    access_token = os.getenv("FITBIT_ACCESS_TOKEN", "mock_access_token")

    headers = {
        "Authorization": f"Bearer {access_token}"
    }
    url = f"{FITBIT_BASE_URL}/date/{date}.json"
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    return response.json()
