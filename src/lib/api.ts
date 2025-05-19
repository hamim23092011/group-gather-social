
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

// Base URL for our API
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

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
    const response = await fetch(`${API_BASE_URL}/groups`);
    return handleResponse(response);
  },

  getFeaturedGroups: async (): Promise<HobbyGroup[]> => {
    const response = await fetch(`${API_BASE_URL}/groups/featured`);
    return handleResponse(response);
  },

  getGroupById: async (id: string): Promise<HobbyGroup> => {
    const response = await fetch(`${API_BASE_URL}/groups/${id}`);
    return handleResponse(response);
  },

  createGroup: async (group: HobbyGroup, token: string): Promise<HobbyGroup> => {
    const response = await fetch(`${API_BASE_URL}/groups`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(group),
    });
    return handleResponse(response);
  },

  updateGroup: async (id: string, group: Partial<HobbyGroup>, token: string): Promise<HobbyGroup> => {
    const response = await fetch(`${API_BASE_URL}/groups/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(group),
    });
    return handleResponse(response);
  },

  deleteGroup: async (id: string, token: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/groups/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  joinGroup: async (groupId: string, userData: { name: string; email: string }, token: string): Promise<HobbyGroup> => {
    const response = await fetch(`${API_BASE_URL}/groups/${groupId}/join`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  // User
  getUserGroups: async (email: string, token: string): Promise<HobbyGroup[]> => {
    const response = await fetch(`${API_BASE_URL}/groups/user/${email}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  // Categories
  getCategories: async (): Promise<string[]> => {
    const response = await fetch(`${API_BASE_URL}/categories`);
    return handleResponse(response);
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
