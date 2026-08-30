# main.py

import os

from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
import requests
import base64
from urllib.parse import quote
from api import fitbit_endpoints, connectors_endpoints

load_dotenv()

app = FastAPI()

# 🔓 Enable CORS for frontend running on port 3000
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Adjust if deployed elsewhere
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def _require_env(name: str) -> str:
    value = os.getenv(name)
    if not value:
        raise RuntimeError(f"Missing required environment variable: {name}")
    return value


# Fitbit app credentials, loaded from .env (never commit real values)
CLIENT_ID = _require_env("FITBIT_CLIENT_ID")
CLIENT_SECRET = _require_env("FITBIT_CLIENT_SECRET")
REDIRECT_URI = os.getenv("FITBIT_REDIRECT_URI", "http://localhost:8000/callback")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

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
        return RedirectResponse(f"{FRONTEND_URL}/?fitbit_error={quote('No authorization code provided by Fitbit.')}")

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
        return RedirectResponse(f"{FRONTEND_URL}/?fitbit_error={quote('Token exchange failed: ' + response.text)}")

    # Parse token data (JSON) and hand the access token back to the frontend
    token_data = response.json()
    access_token = token_data.get("access_token", "")

    return RedirectResponse(f"{FRONTEND_URL}/?fitbit_token={quote(access_token)}")

# Include your Fitbit routes
app.include_router(fitbit_endpoints.router, prefix="/api", tags=["Fitbit"])
app.include_router(connectors_endpoints.router, prefix="/api", tags=["Connectors"])
