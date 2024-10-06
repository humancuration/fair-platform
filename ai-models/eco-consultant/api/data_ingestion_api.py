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
    {{ fetch_data_from_api }}

# Define a model for file URL input
class FileFetchRequest(BaseModel):
    file_url: str

# Endpoint for downloading a file from a URL
@app.post("/fetch_data/file")
def fetch_data_file(request: FileFetchRequest):
    {{ error_handling }}
