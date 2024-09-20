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

    def fetch_data_and_publish(self, api_url, params=None):
        # Fetch data logic
        # ...
        # After fetching
        message = {
            'source': api_url,
            'status': 'data_fetched',
            'timestamp': '2024-04-27T12:00:00Z'
        }
        self.producer.send('data_fetched', message)
        self.producer.flush()
        print("Published data_fetched message to Kafka")
