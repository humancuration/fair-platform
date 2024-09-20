# main.py

from agents.data_ingestion_agent import DataIngestionAgent
from agents.data_processing_agent import DataProcessingAgent
from agents.data_cleaning_agent import DataCleaningAgent
from agents.impact_analysis_agent import ImpactAnalysisAgent
from models.lca_model import LCAModel

def main():
    # Initialize agents
    data_ingestion = DataIngestionAgent(raw_data_path='./data/raw')
    data_cleaning = DataCleaningAgent(
        raw_data_path='./data/raw',
        processed_data_path='./data/processed'
    )
    data_processing_agent = DataProcessingAgent()
    lca_model = LCAModel()
    impact_analysis = ImpactAnalysisAgent(
        processed_data_path='./data/processed',
        impact_model=lca_model
    )

    # Define the callback function for processing data
    def process_data(api_url):
        file_name = api_url.split('/')[-1] + '.csv'
        data_cleaning.clean_csv(file_name)  # Trigger the data cleaning

    # Example workflow
    # 1. Fetch data via DataIngestionAgent
    data_ingestion.fetch_data_from_api(
        api_url='https://api.example.com/data',
        params={'key': 'value'}
    )

    # 2. Listen to Kafka and process incoming messages (data cleaning)
    data_processing_agent.listen_and_process(process_data)

    # 3. Analyze impacts once data is cleaned
    impact_analysis.analyze_impacts('data.csv')

if __name__ == "__main__":
    main()
