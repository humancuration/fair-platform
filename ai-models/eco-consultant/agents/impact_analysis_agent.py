# agents/impact_analysis_agent.py

from models.lca_model import LCAModel

class ImpactAnalysisAgent:
    def __init__(self, processed_data_path):
        self.processed_data_path = processed_data_path
        self.lca_model = LCAModel()

    def analyze_impacts(self, file_name):
        processed_file = os.path.join(self.processed_data_path, file_name)
        df = pd.read_csv(processed_file)
        
        df['GWP'] = self.lca_model.calculate_gwp(df)
        df['CED'] = self.lca_model.calculate_ced(df)
        
        impact_file = processed_file.replace('.csv', '_impact.csv')
        df.to_csv(impact_file, index=False)
        print(f"Environmental impacts calculated and saved to {impact_file}")
