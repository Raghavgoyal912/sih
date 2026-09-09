const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

export interface SearchResultItem {
  id: string;
  title: string;
  snippet: string;
  score: number;
  metadata?: Record<string, unknown>;
}

export interface SearchParams {
  query: string;
  matchCount?: number;
  includeInsight?: boolean;
  orgId?: string;
}

export interface SearchResponse {
  query: string;
  results: SearchResultItem[];
  insight: string | null;
}

export interface GeodataLayers {
  parcel: any[];
  hotspot: any[];
  zone: any[];
}

export interface GeodataResponse {
  districtId: string;
  layers: GeodataLayers;
}

export interface SimulateParams {
  landCeilingChangePct: number;
  registrationFeeReductionPct: number;
}

export interface SimulateOutputs {
  disputeReductionPct: number;
  registrationUptakePct: number;
  revenueImpactPct: number;
  confidenceScore: number;
}

export interface SimulateResponse {
  id: string;
  inputs: SimulateParams;
  outputs: SimulateOutputs;
  confidenceScore: number;
}

export interface DocumentItem {
  id: string;
  title: string;
  snippet: string;
  metadata?: Record<string, unknown>;
  createdAt?: string;
}

export interface DocumentsParams {
  page?: number;
  pageSize?: number;
  tag?: string;
  districtId?: string;
}

export interface DocumentsResponse {
  page: number;
  pageSize: number;
  total: number;
  documents: DocumentItem[];
}

/**
 * Generic helper for making API requests with consistent error handling
 */
async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  let response: Response;

  try {
    response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
    });
  } catch (err: unknown) {
    const errorMsg =
      err instanceof Error
        ? err.message
        : 'Network connection failed. Please ensure the backend server is running.';
    throw new Error(`Unable to reach backend at ${API_BASE_URL}: ${errorMsg}`);
  }

  if (!response.ok) {
    let errorDetail = response.statusText;
    try {
      const errorJson = await response.json();
      if (errorJson.error) {
        errorDetail = errorJson.error;
      }
    } catch {
      // Use statusText if body is not JSON
    }
    throw new Error(`API Error (${response.status}): ${errorDetail}`);
  }

  return response.json() as Promise<T>;
}

/**
 * Search indexed cadastral and legal documents via vector similarity
 */
export async function searchDocuments(params: SearchParams): Promise<SearchResponse> {
  return apiFetch<SearchResponse>('/api/search', {
    method: 'POST',
    body: JSON.stringify({
      query: params.query,
      matchCount: params.matchCount ?? 5,
      includeInsight: params.includeInsight ?? true,
      ...(params.orgId ? { orgId: params.orgId } : {}),
    }),
  });
}

/**
 * Fetch PostGIS GeoJSON cadastral layers for a district
 */
export async function getGeodata(districtId: string): Promise<GeodataResponse> {
  const query = new URLSearchParams({ districtId });
  return apiFetch<GeodataResponse>(`/api/geodata?${query.toString()}`, {
    method: 'GET',
  });
}

/**
 * Run policy simulator model and save scenario run
 */
export async function runSimulation(params: SimulateParams): Promise<SimulateResponse> {
  return apiFetch<SimulateResponse>('/api/simulate', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

/**
 * List indexed research and policy documents
 */
export async function getDocuments(params?: DocumentsParams): Promise<DocumentsResponse> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set('page', params.page.toString());
  if (params?.pageSize) searchParams.set('pageSize', params.pageSize.toString());
  if (params?.tag) searchParams.set('tag', params.tag);
  if (params?.districtId) searchParams.set('districtId', params.districtId);

  const qs = searchParams.toString();
  return apiFetch<DocumentsResponse>(`/api/documents${qs ? `?${qs}` : ''}`, {
    method: 'GET',
  });
}
