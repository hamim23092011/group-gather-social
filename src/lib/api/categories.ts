
import { mockCategories, API_BASE_URL } from "./mock-data";
import { handleResponse } from "./utils";

// Categories API functions
export const getCategories = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`);
    return handleResponse(response);
  } catch (error) {
    console.error("API Error in getCategories:", error);
    return mockCategories;
  }
};
