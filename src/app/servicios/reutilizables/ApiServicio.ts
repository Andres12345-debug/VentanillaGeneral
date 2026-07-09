import { tokenHelper } from '../../utilidades/auth/tokenHelper';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

async function request<T>(
  method: HttpMethod,
  url: string,
  body?: unknown
): Promise<T> {
  const token = tokenHelper.get();

  const headers: HeadersInit = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let fetchBody: BodyInit | undefined;

  if (body instanceof FormData) {
    fetchBody = body;
    // No Content-Type header: el browser lo pone con boundary
  } else if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
    fetchBody = JSON.stringify(body);
  }

  const response = await fetch(url, {
    method,
    headers,
    body: fetchBody,
  });

  // 204 No Content
  if (response.status === 204) {
    return undefined as unknown as T;
  }

  if (!response.ok) {
    let errorMessage = `Error ${response.status}: ${response.statusText}`;
    try {
      const errorBody = await response.json();
      errorMessage = errorBody?.message ?? errorMessage;
    } catch {
      // no-op: usar mensaje de status
    }
    throw new Error(errorMessage);
  }

  return response.json() as Promise<T>;
}

export const ApiServicio = {
  get<T>(url: string): Promise<T> {
    return request<T>('GET', url);
  },
  post<T>(url: string, body?: unknown): Promise<T> {
    return request<T>('POST', url, body);
  },
  put<T>(url: string, body?: unknown): Promise<T> {
    return request<T>('PUT', url, body);
  },
  patch<T>(url: string, body?: unknown): Promise<T> {
    return request<T>('PATCH', url, body);
  },
  delete<T>(url: string): Promise<T> {
    return request<T>('DELETE', url);
  },
};
