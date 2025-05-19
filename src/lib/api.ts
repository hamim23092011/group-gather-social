
// Types for our API
export interface HobbyGroup {
  _id?: string;
  groupName: string;
  category: string;
  description: string;
  location: string;
  maxMembers: number;
  startDate: string;
  imageUrl: string;
  createdBy: {
    name: string;
    email: string;
  };
  members?: { name: string; email: string }[];
}

// Base URL for our API - use MongoDB connection
const API_BASE_URL = "https://hobby-hub-backend-hamim.vercel.app/api" || "http://localhost:5000/api";

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Something went wrong");
  }
  return response.json();
};

// API functions
export const api = {
  // Groups
  getGroups: async (): Promise<HobbyGroup[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/groups`);
      return handleResponse(response);
    } catch (error) {
      console.error("API Error in getGroups:", error);
      throw error;
    }
  },

  getFeaturedGroups: async (): Promise<HobbyGroup[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/groups/featured`);
      return handleResponse(response);
    } catch (error) {
      console.error("API Error in getFeaturedGroups:", error);
      throw error;
    }
  },

  getGroupById: async (id: string): Promise<HobbyGroup> => {
    try {
      const response = await fetch(`${API_BASE_URL}/groups/${id}`);
      return handleResponse(response);
    } catch (error) {
      console.error(`API Error in getGroupById for ID ${id}:`, error);
      throw error;
    }
  },

  createGroup: async (group: HobbyGroup, token: string): Promise<HobbyGroup> => {
    try {
      const response = await fetch(`${API_BASE_URL}/groups`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(group),
      });
      return handleResponse(response);
    } catch (error) {
      console.error("API Error in createGroup:", error);
      throw error;
    }
  },

  updateGroup: async (id: string, group: Partial<HobbyGroup>, token: string): Promise<HobbyGroup> => {
    try {
      const response = await fetch(`${API_BASE_URL}/groups/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(group),
      });
      return handleResponse(response);
    } catch (error) {
      console.error(`API Error in updateGroup for ID ${id}:`, error);
      throw error;
    }
  },

  deleteGroup: async (id: string, token: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/groups/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return handleResponse(response);
    } catch (error) {
      console.error(`API Error in deleteGroup for ID ${id}:`, error);
      throw error;
    }
  },

  joinGroup: async (groupId: string, userData: { name: string; email: string }, token: string): Promise<HobbyGroup> => {
    try {
      const response = await fetch(`${API_BASE_URL}/groups/${groupId}/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });
      return handleResponse(response);
    } catch (error) {
      console.error(`API Error in joinGroup for ID ${groupId}:`, error);
      throw error;
    }
  },

  // User
  getUserGroups: async (email: string, token: string): Promise<HobbyGroup[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/groups/user/${email}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return handleResponse(response);
    } catch (error) {
      console.error(`API Error in getUserGroups for email ${email}:`, error);
      throw error;
    }
  },

  // Categories
  getCategories: async (): Promise<string[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`);
      return handleResponse(response);
    } catch (error) {
      console.error("API Error in getCategories:", error);
      throw error;
    }
  },
};

// Mock data for development - remove this in production
export const mockCategories = [
  "Drawing & Painting",
  "Photography",
  "Video Gaming",
  "Fishing",
  "Running",
  "Cooking",
  "Reading",
  "Writing",
  "Hiking",
  "Board Games",
  "Gardening",
  "Music",
];

export async function getCategories(): Promise<string[]> {
  try {
    return await api.getCategories();
  } catch (error) {
    console.error("Error fetching categories:", error);
    return mockCategories;
  }
}
