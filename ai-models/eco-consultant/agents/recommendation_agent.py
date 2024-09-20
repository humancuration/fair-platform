# agents/recommendation_agent.py

from models.recommendation_model import RecommendationModel

class RecommendationAgent:
    def __init__(self, interactions_file):
        self.recommendation_model = RecommendationModel()
        self.interactions_df = pd.read_csv(interactions_file)
        self.recommendation_model.build_user_product_matrix(self.interactions_df)

    def get_recommendations(self, user_id):
        return self.recommendation_model.recommend_products(user_id)
