# ai/recommendation_service.py

from flask import Flask, request, jsonify
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import joblib

app = Flask(__name__)

# Load pre-trained recommendation model
model = joblib.load('models/recommendation_model.pkl')

@app.route('/recommend-affiliate-programs', methods=['POST'])
def recommend_affiliate_programs():
    data = request.json
    creator_profile = data.get('profile')  # e.g., content description, audience demographics

    # Example: Calculate similarity scores
    recommendations = model.predict(creator_profile)
    return jsonify(recommendations)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002)
