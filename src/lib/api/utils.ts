
// Helper function to handle API responses
export const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: `Server responded with status: ${response.status}`,
    }));
    throw new Error(error.message || "Something went wrong");
  }
  return response.json();
};

// Define API base URL with fallback for local development
export const API_BASE_URL = process.env.VITE_API_BASE_URL || "https://hobby-hub-backend-hamim.vercel.app/api";

// Helper function to create API request options with authentication
export const createAuthenticatedRequestOptions = (token: string, method: string = 'GET', body?: any) => {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  };
  
  if (body) {
    options.body = JSON.stringify(body);
  }
  
  return options;
};
