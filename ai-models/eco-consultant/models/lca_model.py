# models/lca_model.py

import pandas as pd

class LCAModel:
    def __init__(self):
        # Example GWP factors (in kg CO2 eq per unit emission)
        self.gwp_factors = {
            'CO2': 1.0,
            'CH4': 25.0,
            'N2O': 298.0
        }

    def calculate_gwp(self, df):
        df['GWP'] = 0
        for gas, factor in self.gwp_factors.items():
            if gas in df.columns:
                df['GWP'] += df[gas] * factor
        return df['GWP']

    def calculate_ced(self, df):
        # Cumulative Energy Demand
        df['CED'] = df[['energy_stage1', 'energy_stage2', 'energy_stage3']].sum(axis=1)
        return df['CED']
