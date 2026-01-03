// API Client utility for all HTTP requests
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"

interface RequestOptions {
  method?: string
  body?: any
  headers?: Record<string, string>
}

export class APIError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
  ) {
    super(message)
    this.name = "APIError"
  }
}

export async function apiCall<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, headers = {} } = options

  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null

  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...headers,
  }

  if (token) {
    defaultHeaders["Authorization"] = `Bearer ${token}`
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method,
      headers: defaultHeaders,
      body: body ? JSON.stringify(body) : undefined,
    })

    const data = await response.json()

    if (!response.ok) {
      throw new APIError(response.status, data.code || "API_ERROR", data.error || "An error occurred")
    }

    return data
  } catch (error) {
    if (error instanceof APIError) {
      throw error
    }
    throw new APIError(500, "NETWORK_ERROR", "Network error occurred")
  }
}

// Auth API calls
export const authAPI = {
  generateOTP: (email: string) =>
    apiCall("/auth/generate-otp", {
      method: "POST",
      body: { email },
    }),

  verifyOTP: (email: string, otp: string) =>
    apiCall("/auth/verify-otp", {
      method: "POST",
      body: { email, otp },
    }),

  login: (email: string, password: string) =>
    apiCall("/auth/login", {
      method: "POST",
      body: { email, password },
    }),

  signup: (data: any) =>
    apiCall("/auth/signup", {
      method: "POST",
      body: data,
    }),
}

// Employee API calls
export const employeeAPI = {
  getAll: (search?: string, department?: string) =>
    apiCall(
      `/employees?${new URLSearchParams({ ...(search && { search }), ...(department && { department }) }).toString()}`,
    ),

  getById: (id: string) => apiCall(`/employees/${id}`),

  update: (id: string, data: any) =>
    apiCall(`/employees/${id}`, {
      method: "PUT",
      body: data,
    }),
}

// Payment API calls
export const paymentAPI = {
  process: (data: any) =>
    apiCall("/payments/process", {
      method: "POST",
      body: data,
    }),

  getHistory: () => apiCall("/payments/history"),
}
