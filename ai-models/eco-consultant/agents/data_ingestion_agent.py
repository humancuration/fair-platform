# agents/data_ingestion_agent.py

from kafka import KafkaProducer
import json

class DataIngestionAgent:
    def __init__(self, raw_data_path, kafka_server='localhost:9092'):
        self.raw_data_path = raw_data_path
        self.producer = KafkaProducer(
            bootstrap_servers=kafka_server,
            value_serializer=lambda v: json.dumps(v).encode('utf-8')
        )
        os.makedirs(self.raw_data_path, exist_ok=True)

    def fetch_data_from_api(self, api_url, params=None):
        # Existing method renamed for consistency
        # ... implementation ...
