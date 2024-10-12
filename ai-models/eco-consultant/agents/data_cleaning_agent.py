# agents/data_cleaning_agent.py

import os
import pandas as pd
import logging

class DataCleaningAgent:
    def __init__(self, raw_data_path, processed_data_path):
        self.raw_data_path = raw_data_path
        self.processed_data_path = processed_data_path
        os.makedirs(self.processed_data_path, exist_ok=True)
        logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

    def clean_csv(self, file_name):
        logging.info(f"Starting cleaning for {file_name}")
        raw_file = os.path.join(self.raw_data_path, file_name)
        processed_file = os.path.join(self.processed_data_path, file_name)

        try:
            df = pd.read_csv(raw_file)
            logging.info(f"Loaded data from {raw_file}")
            # Example cleaning steps:
            df.drop_duplicates(inplace=True)
            logging.info("Dropped duplicates")
            df.fillna(method='ffill', inplace=True)
            logging.info("Filled missing values")
            # More cleaning as per requirements

            df.to_csv(processed_file, index=False)
            logging.info(f"Data cleaned and saved to {processed_file}")
        except Exception as e:
            logging.error(f"Error cleaning {file_name}: {e}")
            raise
