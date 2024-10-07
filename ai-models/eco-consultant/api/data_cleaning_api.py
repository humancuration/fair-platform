# api/data_cleaning_api.py

from fastapi import FastAPI, HTTPException
import pandas as pd
import os
import logging

app = FastAPI()

PROCESSED_DATA_PATH = './data/processed'

logging.basicConfig(level=logging.INFO)

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
