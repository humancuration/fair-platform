export const API_ENDPOINTS = {
  CURATOR: {
    GET_METRICS: (id: string) => `/api/curators/${id}/metrics`,
    GET_HISTORY: (id: string) => `/api/curators/${id}/history`,
    GET_AI_VOTERS: (id: string) => `/api/curators/${id}/ai-voters`,
  },
  DELEGATION: {
    GET_DELEGATES: '/api/delegation/delegates',
    GET_METRICS: '/api/delegation/metrics',
    DELEGATE: '/api/delegation/delegate',
    REVOKE: (id: string) => `/api/delegation/revoke/${id}`,
  },
  VOTING: {
    REGISTER_AI: '/api/voting/register-ai',
    REVOKE_AI: (id: string) => `/api/voting/revoke-ai/${id}`,
  },
} as const;
