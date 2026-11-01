import { apiConfig } from './config';

export class ApiError extends Error {
  public status?: number;
  public details?: unknown;

  constructor(message: string, status?: number, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

export interface RequestOptions extends RequestInit {
  timeoutMs?: number;
}

/**
 * Executes a network request with timeout support, fallback port resolution, and normalized errors.
 */
export async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { timeoutMs = 12000, ...fetchOptions } = options;
  await apiConfig.init();
  const baseUrl = apiConfig.getBaseUrl();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${baseUrl}${cleanEndpoint}`;

  const defaultHeaders: Record<string, string> = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  const executeFetch = async (targetUrl: string, timeout: number): Promise<T> => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);

    try {
      const res = await fetch(targetUrl, {
        ...fetchOptions,
        headers: {
          ...defaultHeaders,
          ...(fetchOptions.headers as Record<string, string> | undefined),
        },
        signal: controller.signal,
      });

      clearTimeout(timer);

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        const message =
          errBody.error?.message ||
          errBody.message ||
          `Request failed with HTTP status ${res.status}`;
        throw new ApiError(message, res.status, errBody);
      }

      return (await res.json()) as T;
    } catch (err: unknown) {
      clearTimeout(timer);
      if (err instanceof ApiError) throw err;
      if (err instanceof Error && err.name === 'AbortError') {
        throw new ApiError(
          `Request timed out after ${Math.round(timeout / 1000)}s. Please check if the FitShift backend is running.`,
          408
        );
      }
      throw err;
    }
  };

  try {
    return await executeFetch(url, timeoutMs);
  } catch (initialErr: unknown) {
    if (initialErr instanceof ApiError && initialErr.status && initialErr.status >= 400) {
      throw initialErr;
    }

    // If port 5000 is unreachable on localhost or 10.0.2.2, attempt auto-fallback to port 5001
    // (Resolves macOS AirPlay Receiver port 5000 conflicts automatically)
    if (baseUrl.includes(':5000')) {
      const fallbackBaseUrl = baseUrl.replace(':5000', ':5001');
      const fallbackUrl = `${fallbackBaseUrl}${cleanEndpoint}`;
      try {
        const result = await executeFetch(fallbackUrl, Math.min(timeoutMs, 5000));
        // If fallback succeeded, update activeBaseUrl for subsequent calls
        await apiConfig.setBaseUrl(fallbackBaseUrl);
        return result;
      } catch {
        // Fallback also failed, re-throw with primary URL error context
      }
    }

    const msg = initialErr instanceof Error ? initialErr.message : 'Network request failed';
    throw new ApiError(
      `Cannot connect to FitShift backend at ${baseUrl}. (${msg})`,
      0
    );
  }
}

export const apiClient = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'GET' }),
  post: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    }),
};

export default apiClient;
