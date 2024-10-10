# api/data_cleaning_api.py

from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from agents.data_ingestion_agent import DataIngestionAgent

import pandas as pd
import os
import logging
from fastapi.responses import FileResponse
from fpdf import FPDF
from backend.main import authenticate_user  # Importing from backend

app = FastAPI()

PROCESSED_DATA_PATH = './data/processed'

logging.basicConfig(level=logging.INFO)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        role: str = payload.get("role")
        if username is None or role is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return {"username": username, "role": role}
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

@app.get("/clean_data/{file_name}")
def get_clean_data(file_name: str):
    logging.info(f"Request to clean data for file: {file_name}")
    try:
        processed_file = os.path.join(PROCESSED_DATA_PATH, file_name)
        if os.path.exists(processed_file):
            df = pd.read_csv(processed_file)
            return df.to_dict(orient='records')
        else:
            raise HTTPException(status_code=404, detail="File not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/fetch_data/api")
def fetch_data_api(request: ApiFetchRequest, user: dict = Depends(get_current_user)):
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    # Existing implementation

@app.post("/generate_report/{file_name}")
def generate_report(file_name: str, user: dict = Depends(get_current_user)):
    processed_file = os.path.join(PROCESSED_DATA_PATH, file_name.replace('.csv', '_impact.csv'))
    if not os.path.exists(processed_file):
        raise HTTPException(status_code=404, detail="Processed data not found")

    df = pd.read_csv(processed_file)
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)
    pdf.cell(200, 10, txt="Environmental Impact Report", ln=True, align='C')
    for index, row in df.iterrows():
        pdf.cell(200, 10, txt=f"{row['GWP']}, {row['CED']}", ln=True)
    report_path = f"./reports/{file_name.replace('.csv', '_report.pdf')}"
    pdf.output(report_path)
    return FileResponse(report_path, media_type='application/pdf', filename=f"{file_name}_report.pdf")
