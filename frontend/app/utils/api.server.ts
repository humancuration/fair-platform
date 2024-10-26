import { json } from '@remix-run/node';
import { requireUser } from '~/services/auth.server';

const API_URL = process.env.API_URL || 'http://localhost:5000/api';

interface FetchOptions extends RequestInit {
  token?: string;
}

async function fetchApi(
  endpoint: string, 
  options: FetchOptions = {}
) {
  const { token, ...fetchOptions } = options;
  const headers = new Headers(options.headers);

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  headers.set('Content-Type', 'application/json');

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...fetchOptions,
    headers
  });

  if (!response.ok) {
    throw json(
      { message: 'API Error' }, 
      { status: response.status }
    );
  }

  return response.json();
}

export async function authenticatedFetch(
  request: Request,
  endpoint: string,
  options: FetchOptions = {}
) {
  const user = await requireUser(request);
  return fetchApi(endpoint, {
    ...options,
    token: user.token
  });
}

// API Endpoints
export async function getProducts(params: {
  page: number;
  limit: number;
  filters: any;
  sort: string;
  query: string;
}) {
  return fetchApi('/marketplace/products', { 
    method: 'GET',
    body: JSON.stringify(params)
  });
}

export async function searchProducts(params: any) {
  return fetchApi('/marketplace/search', {
    method: 'GET',
    body: JSON.stringify(params)
  });
}

// Add more API endpoints as needed...
