export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body.error || `Request failed with status ${res.status}`);
  }
  return res.json();
}

export const api = {
  get: <T>(url: string) => fetch(url, { credentials: 'include' }).then(res => handleResponse<T>(res)),

  post: <T>(url: string, body?: unknown) =>
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: body ? JSON.stringify(body) : undefined,
    }).then(res => handleResponse<T>(res)),

  put: <T>(url: string, body?: unknown) =>
    fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: body ? JSON.stringify(body) : undefined,
    }).then(res => handleResponse<T>(res)),

  patch: <T>(url: string, body?: unknown) =>
    fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: body ? JSON.stringify(body) : undefined,
    }).then(res => handleResponse<T>(res)),

  delete: <T>(url: string) =>
    fetch(url, { method: 'DELETE', credentials: 'include' }).then(res => handleResponse<T>(res)),
};
