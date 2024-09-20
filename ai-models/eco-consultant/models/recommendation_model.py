# models/recommendation_model.py

from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd

class RecommendationModel:
    def __init__(self):
        self.user_product_matrix = None
        self.similarity_matrix = None

    def build_user_product_matrix(self, interactions_df):
        self.user_product_matrix = interactions_df.pivot(index='user_id', columns='product_id', values='interaction').fillna(0)
        self.similarity_matrix = cosine_similarity(self.user_product_matrix)
        self.similarity_df = pd.DataFrame(self.similarity_matrix, index=self.user_product_matrix.index, columns=self.user_product_matrix.index)

    def recommend_products(self, user_id, top_n=5):
        if user_id not in self.user_product_matrix.index:
            return []
        user_similarity = self.similarity_df[user_id]
        similar_users = user_similarity.sort_values(ascending=False).index[1:]
        recommendations = {}
        for similar_user in similar_users:
            similar_user_interactions = self.user_product_matrix.loc[similar_user]
            for product_id, interaction in similar_user_interactions.items():
                if interaction > 0 and self.user_product_matrix.loc[user_id, product_id] == 0:
                    if product_id not in recommendations:
                        recommendations[product_id] = interaction
                    else:
                        recommendations[product_id] += interaction
            if len(recommendations) >= top_n:
                break
        recommended_products = sorted(recommendations.items(), key=lambda x: x[1], reverse=True)[:top_n]
        return [product for product, score in recommended_products]
