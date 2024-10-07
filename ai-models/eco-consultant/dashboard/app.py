from flask import Flask, render_template
import pandas as pd
from agents.data_cleaning_agent import DataCleaningAgent
from agents.impact_analysis_agent import ImpactAnalysisAgent

app = Flask(__name__)

@app.route('/')
def index():
    # Load processed data
    processed_data_path = './data/processed/data.csv'
    df = pd.read_csv(processed_data_path)

    # Example: Calculate summary statistics
    summary = df.describe().to_html()

    return render_template('index.html', summary=summary)

@app.route('/analyze')
def analyze():
    # Example: Analyze impacts
    file_name = 'data.csv'
    impact_analysis.analyze_impacts(file_name)

    # Load impact data
    impact_file = f'./data/processed/{file_name.replace(".csv", "_impact.csv")}'
    df = pd.read_csv(impact_file)

    # Calculate summary statistics
    summary = df.describe().to_html()

    return render_template('index.html', summary=summary)

if __name__ == '__main__':
    app.run(debug=True)@