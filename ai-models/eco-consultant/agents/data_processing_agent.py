# agents/data_processing_agent.py

from kafka import KafkaConsumer
import json

class DataProcessingAgent:
    def __init__(self, kafka_server='localhost:9092'):
        self.consumer = KafkaConsumer(
            'data_fetched',
            bootstrap_servers=kafka_server,
            auto_offset_reset='earliest',
            enable_auto_commit=True,
            group_id='data_processing_group',
            value_deserializer=lambda x: json.loads(x.decode('utf-8'))
        )

    def listen_and_process(self, process_callback):
        for message in self.consumer:
            data = message.value
            api_url = data['source']
            process_callback(api_url)
