// Your laptop's Wi-Fi IP address. The phone can't use "localhost" (that would mean the phone itself).
// To find it on Windows: run `ipconfig` and copy the "IPv4 Address" under your Wi-Fi adapter.
// The phone and laptop must be on the same Wi-Fi network.
export const API_URL = 'http://10.20.17.14:4000';

// A loan as returned by the backend.
export type Loan = {
  id: number;
  friendName: string;
  amount: number;
  dueDate: string; // 'YYYY-MM-DD'
  isRepaid: boolean;
  repaidAt: string | null;
  receiptUrl: string | null; // e.g. '/uploads/123.jpg' (add API_URL in front to show it)
  createdAt: string;
  isOverdue: boolean;
};

export type Summary = {
  totalLent: number;
  totalRepaid: number;
  outstanding: number;
  overdueAmount: number;
};

// The login token, kept here so every request can use it.
let token: string | null = null;

export function setToken(newToken: string | null) {
  token = newToken;
}

// One helper for every API call: adds the token, sends the request and returns the JSON.
// If the server answers with an error, it throws an Error with the server's message.
export async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // For FormData (file upload) fetch must set the Content-Type itself, including the boundary.
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, { ...options, headers });
  } catch {
    throw new Error('Cannot reach the server. Check API_URL in src/api.ts and that the backend is running.');
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong');
  }

  return data as T;
}
