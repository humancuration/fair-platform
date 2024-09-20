# api/data_ingestion_api.py

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from agents.data_ingestion_agent import DataIngestionAgent

app = FastAPI()

# Initialize the DataIngestionAgent with a specified raw data path
data_ingestion = DataIngestionAgent(raw_data_path='./data/raw')

# Define a model for API parameters input
class ApiFetchRequest(BaseModel):
    api_url: str
    params: dict = None

# Endpoint for fetching data from an API
@app.post("/fetch_data/api")
def fetch_data_api(request: ApiFetchRequest):
    file_path = data_ingestion.fetch_data_from_api(request.api_url, request.params)
    
    if "Failed" in file_path:
        raise HTTPException(status_code=400, detail=file_path)
    
    return {"status": "success", "message": f"Data fetched from {request.api_url}", "file_path": file_path}

# Define a model for file URL input
class FileFetchRequest(BaseModel):
    file_url: str

# Endpoint for downloading a file from a URL
@app.post("/fetch_data/file")
def fetch_data_file(request: FileFetchRequest):
    file_path = data_ingestion.fetch_data_from_file(request.file_url)
    
    if "Failed" in file_path:
        raise HTTPException(status_code=400, detail=file_path)
    
    return {"status": "success", "message": f"File downloaded from {request.file_url}", "file_path": file_path}
