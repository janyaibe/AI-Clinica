from fastapi import APIRouter, HTTPException
from services.fitbit_service import get_daily_activity_data  # <== This import

router = APIRouter()

@router.get("/fitbit/daily-activity/{date}")
def get_fitbit_daily_activity(date: str, token: str):
    try:
        activity_data = get_daily_activity_data(date, token)
        return {"date": date, "activity_data": activity_data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

