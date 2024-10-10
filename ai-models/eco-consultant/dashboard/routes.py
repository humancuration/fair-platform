from flask import Blueprint, render_template, jsonify
import pandas as pd
from agents.data_cleaning_agent import DataCleaningAgent
from agents.impact_analysis_agent import ImpactAnalysisAgent

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/')
def index():
    processed_data_path = './data/processed/data.csv'
    df = pd.read_csv(processed_data_path)
    summary = df.describe().to_html()
    return render_template('index.html', summary=summary)

@dashboard_bp.route('/analyze')
def analyze():
    file_name = 'data.csv'
    impact_analysis.analyze_impacts(file_name)
    impact_file = f'./data/processed/{file_name.replace(".csv", "_impact.csv")}'
    df = pd.read_csv(impact_file)
    summary = df.describe().to_html()
    return render_template('index.html', summary=summary)

@dashboard_bp.route('/api/impact_data')
def impact_data():
    processed_data_path = './data/processed/data_impact.csv'
    df = pd.read_csv(processed_data_path)
    summary = df[['GWP', 'CED']].describe()
    return jsonify(summary.to_dict())