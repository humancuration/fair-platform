from flask import Flask, request, jsonify
from flask_cors import CORS
from models.recommendation.model import RecommendationModel
import pandas as pd

app = Flask(__name__)
CORS(app)

# Initialize model
recommendation_model = RecommendationModel()
# Load interaction data
interactions_df = pd.read_csv('data/interactions.csv')
recommendation_model.build_user_product_matrix(interactions_df)

@app.route('/recommend', methods=['GET'])
def recommend():
    user_id = int(request.args.get('user_id'))
    recommendations = recommendation_model.recommend_products(user_id)
    return jsonify({'user_id': user_id, 'recommendations': recommendations})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
