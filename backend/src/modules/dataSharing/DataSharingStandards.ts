export const DataSharingStandards = {
  // Core principles for data sharing
  principles: {
    transparency: {
      required: ['source', 'processing_methods', 'environmental_impact'],
      metrics: ['energy_usage', 'storage_efficiency', 'bandwidth_optimization']
    },
    ethics: {
      required: ['consent_type', 'data_purpose', 'beneficiary_impact'],
      restrictions: ['no_harmful_use', 'privacy_preserving', 'environmentally_conscious']
    }
  },
  // Resource usage limits
  resourceLimits: {
    computational: {
      maxCPUUsage: 80,
      maxMemoryUsage: 70,
      coolingRequirements: true
    },
    storage: {
      deduplication: true,
      compression: true,
      archivalPolicies: 'adaptive'
    }
  }
};
