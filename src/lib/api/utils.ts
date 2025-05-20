
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
