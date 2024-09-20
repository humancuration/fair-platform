# agents/supply_chain_agent.py

from models.supply_chain_model import SupplyChainModel

class SupplyChainAgent:
    def __init__(self, network_data_file):
        self.network_data_file = network_data_file
        self.model = SupplyChainModel()
        self.load_network()

    def load_network(self):
        import json
        with open(self.network_data_file, 'r') as f:
            data = json.load(f)
        nodes = data['nodes']
        edges = data['edges']
        self.model.build_network(nodes, edges)

    def analyze_network(self):
        centrality = self.model.calculate_betweenness_centrality()
        return centrality

    def get_shortest_path(self, source, target):
        return self.model.find_shortest_path(source, target)
