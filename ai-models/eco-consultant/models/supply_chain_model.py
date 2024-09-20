# models/supply_chain_model.py

import networkx as nx

class SupplyChainModel:
    def __init__(self):
        self.G = nx.DiGraph()

    def build_network(self, nodes, edges):
        self.G.add_nodes_from(nodes)
        for edge in edges:
            self.G.add_edge(edge['from'], edge['to'], weight=edge['weight'], emission=edge['emission'])

    def calculate_betweenness_centrality(self):
        return nx.betweenness_centrality(self.G, weight='weight')

    def find_shortest_path(self, source, target):
        return nx.dijkstra_path(self.G, source=source, target=target, weight='emission')
