export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  PROFILE: '/profile',
  CURATOR: {
    BASE: '/playlist/curator',
    DELEGATION: '/playlist/curator/delegation',
    IMPACT: (id: string) => `/playlist/curator/${id}/impact`,
    MONETIZATION: (id: string) => `/playlist/curator/${id}/monetization`,
    VOTING: (id: string) => `/playlist/curator/${id}/voting`,
  },
  API: {
    STATE: '/api/state',
  },
} as const;
