# ai/recommendation_engine.py

from sklearn.cluster import KMeans
import numpy as np

class LinkArrangementOptimizer:
    def __init__(self, click_data):
        self.click_data = click_data

    def optimize_order(self, links):
        # Use clustering to determine optimal link order
        link_clicks = np.array([self.click_data.get(link.id, 0) for link in links])
        clusters = KMeans(n_clusters=2).fit_predict(link_clicks.reshape(-1, 1))
        sorted_links = [link for _, link in sorted(zip(clusters, links), key=lambda x: x[0])]
        return sorted_links
