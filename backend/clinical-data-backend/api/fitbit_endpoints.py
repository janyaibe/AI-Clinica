from fastapi import APIRouter, Header, HTTPException
from services.fitbit_service import get_daily_activity_data  # <== This import

router = APIRouter()

@router.get("/fitbit/daily-activity/{date}")
def get_fitbit_daily_activity(date: str, authorization: str = Header(...)):
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or malformed Authorization header")
    token = authorization.removeprefix("Bearer ")
    try:
        activity_data = get_daily_activity_data(date, token)
        return {"date": date, "activity_data": activity_data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

