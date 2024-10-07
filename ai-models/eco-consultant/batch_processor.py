import schedule
import time
import logging
from concurrent.futures import ThreadPoolExecutor, as_completed
import os
import signal
from agents.data_cleaning_agent import DataCleaningAgent
from agents.impact_analysis_agent import ImpactAnalysisAgent

# Initialize agents
data_cleaning = DataCleaningAgent(
    raw_data_path='./data/raw',
    processed_data_path='./data/processed'
)
impact_analysis = ImpactAnalysisAgent(
    processed_data_path='./data/processed'
)

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def process_file(file_name):
    try:
        data_cleaning.clean_csv(file_name)
        impact_analysis.analyze_impacts(file_name)
        logging.info(f"Successfully processed {file_name}")
    except Exception as e:
        logging.error(f"Error processing {file_name}: {str(e)}")

def batch_process():
    raw_files = [f for f in os.listdir('./data/raw') if f.endswith('.csv')]
    with ThreadPoolExecutor(max_workers=4) as executor:
        futures = [executor.submit(process_file, file_name) for file_name in raw_files]
        for future in as_completed(futures):
            future.result()  # This will raise any exceptions that occurred during execution

# Schedule the batch process to run daily at midnight and additional run on Mondays at noon
schedule.every().day.at("00:00").do(batch_process)
schedule.every().monday.at("12:00").do(batch_process)

def signal_handler(signum, frame):
    logging.info("Received shutdown signal. Exiting...")
    exit(0)

signal.signal(signal.SIGINT, signal_handler)
signal.signal(signal.SIGTERM, signal_handler)

if __name__ == "__main__":
    while True:
        schedule.run_pending()
        time.sleep(60)  # Wait for one minute
