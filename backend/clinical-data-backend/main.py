# main.py

from fastapi import FastAPI, Request
import requests
import base64
from api import fitbit_endpoints

app = FastAPI()

# Replace with your actual Fitbit app credentials
CLIENT_ID = "23PWH7"
CLIENT_SECRET = "499d9429d8872766c170b6cbdadd370f"  # Example only; keep this private!
REDIRECT_URI = "http://localhost:8000/callback"    # Must match what's in your Fitbit app settings

@app.get("/")
def read_root():
    return {"message": "Hello from FastAPI!"}

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.get("/callback")
def handle_callback(request: Request):
    """
    Fitbit will redirect the user here after they grant permission.
    We'll automatically exchange the authorization code for an access token.
    """
    code = request.query_params.get("code")
    if not code:
        return {"error": "No authorization code provided by Fitbit."}

    # Build the Authorization header (Basic Auth)
    auth_str = f"{CLIENT_ID}:{CLIENT_SECRET}"
    auth_bytes = auth_str.encode("ascii")
    auth_b64 = base64.b64encode(auth_bytes).decode("ascii")
    headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": f"Basic {auth_b64}"
    }

    # Payload for exchanging the code
    data = {
        "client_id": CLIENT_ID,
        "grant_type": "authorization_code",
        "redirect_uri": REDIRECT_URI,
        "code": code
    }

    # Send POST request to Fitbit's token endpoint
    token_url = "https://api.fitbit.com/oauth2/token"
    response = requests.post(token_url, headers=headers, data=data)

    if response.status_code != 200:
        return {
            "error": "Token exchange failed.",
            "status_code": response.status_code,
            "response_text": response.text
        }

    # Parse token data (JSON)
    token_data = response.json()

    # token_data typically includes:
    #   access_token, refresh_token, scope, token_type, expires_in, user_id
    return {
        "message": "Token exchange successful!",
        "token_data": token_data
    }
