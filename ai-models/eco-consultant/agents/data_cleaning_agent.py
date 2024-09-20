# agents/data_cleaning_agent.py

import os
import pandas as pd

class DataCleaningAgent:
    def __init__(self, raw_data_path, processed_data_path):
        self.raw_data_path = raw_data_path
        self.processed_data_path = processed_data_path
        os.makedirs(self.processed_data_path, exist_ok=True)

    def clean_csv(self, file_name):
        raw_file = os.path.join(self.raw_data_path, file_name)
        processed_file = os.path.join(self.processed_data_path, file_name)

        df = pd.read_csv(raw_file)
        # Example cleaning steps:
        df.drop_duplicates(inplace=True)
        df.fillna(method='ffill', inplace=True)
        # More cleaning as per requirements

        df.to_csv(processed_file, index=False)
        print(f"Data cleaned and saved to {processed_file}")
