from fastapi import APIRouter

router = APIRouter()

# Registry of data-source integrations, live and planned. Adding a new source
# to the roadmap (or promoting one to "live") is a single entry here.
CONNECTORS = [
    {
        "id": "fitbit",
        "name": "Fitbit",
        "category": "Consumer wearable",
        "status": "live",
        "description": "Daily activity, steps, and heart rate via the Fitbit Web API (OAuth2).",
    },
    {
        "id": "cgm",
        "name": "Continuous glucose monitors",
        "category": "Home monitoring device",
        "status": "roadmap",
        "description": "Glucose trend data from Dexcom API and FreeStyle LibreView exports.",
    },
    {
        "id": "cardiac_implantable",
        "name": "Cardiac implantables (pacemakers, ICDs)",
        "category": "Implantable device",
        "status": "roadmap",
        "description": "Remote-monitoring feeds from Medtronic CareLink, Abbott Merlin.net, and "
                       "Boston Scientific LATITUDE, ingested under a manufacturer data-sharing agreement.",
    },
    {
        "id": "bp_monitor",
        "name": "Connected blood pressure cuffs",
        "category": "Home monitoring device",
        "status": "roadmap",
        "description": "Bluetooth/cellular BP monitors via manufacturer SDKs (e.g. Omron, Withings).",
    },
    {
        "id": "ehr_fhir",
        "name": "EHR / HL7-FHIR feed",
        "category": "Clinical system",
        "status": "roadmap",
        "description": "Structured clinical data via HL7 FHIR R4 (Epic, Cerner) for site-reported outcomes.",
    },
]


@router.get("/connectors")
def list_connectors():
    return {"connectors": CONNECTORS}
