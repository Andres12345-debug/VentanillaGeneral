// Fetch para endpoints públicos (sin JWT): login, registro, recuperar/nueva
// contraseña y consulta de workflows públicos. A diferencia de ApiServicio,
// nunca adjunta Authorization, así una sesión vieja en sessionStorage no se
// filtra en una petición que debe ser anónima.
type HttpMethod = 'GET' | 'POST' | 'PATCH';

async function requestPublico<T>(method: HttpMethod, url: string, body?: unknown): Promise<T> {
  const headers: HeadersInit = {};
  let fetchBody: BodyInit | undefined;

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
    fetchBody = JSON.stringify(body);
  }

  const response = await fetch(url, { method, headers, body: fetchBody });

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

  if (response.status === 204) {
    return undefined as unknown as T;
  }

  return response.json() as Promise<T>;
}

export const ApiPublicoServicio = {
  get<T>(url: string): Promise<T> {
    return requestPublico<T>('GET', url);
  },
  post<T>(url: string, body?: unknown): Promise<T> {
    return requestPublico<T>('POST', url, body);
  },
  patch<T>(url: string, body?: unknown): Promise<T> {
    return requestPublico<T>('PATCH', url, body);
  },
};
