
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
const API_BASE_URL = "https://hobby-hub-backend-hamim.vercel.app/api";

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: `Server responded with status: ${response.status}`,
    }));
    throw new Error(error.message || "Something went wrong");
  }
  return response.json();
};

// Fallback data for when API fails
const getFallbackGroup = (id: string, currentUserEmail?: string, currentUserName?: string): HobbyGroup => {
  return {
    _id: id,
    groupName: "Sample Hobby Group",
    category: "Drawing & Painting",
    description: "This is a sample group created as fallback when API connection fails.",
    location: "Online",
    maxMembers: 10,
    startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    imageUrl: "https://images.unsplash.com/photo-1513364776144-60967b0f800f",
    createdBy: {
      name: currentUserName || "User",
      email: currentUserEmail || "",
    },
    members: currentUserEmail ? [{ name: currentUserName || "User", email: currentUserEmail }] : [],
  };
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
      
      // Return mock data when API fails
      return Array(6).fill(0).map((_, i) => getFallbackGroup(`${100 + i}`));
    }
  },

  getFeaturedGroups: async (): Promise<HobbyGroup[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/groups/featured`);
      return handleResponse(response);
    } catch (error) {
      console.error("API Error in getFeaturedGroups:", error);
      
      // Return mock data when API fails
      return Array(6).fill(0).map((_, i) => getFallbackGroup(`${100 + i}`));
    }
  },

  getGroupById: async (id: string): Promise<HobbyGroup> => {
    try {
      const response = await fetch(`${API_BASE_URL}/groups/${id}`);
      return handleResponse(response);
    } catch (error) {
      console.error(`API Error in getGroupById for ID ${id}:`, error);
      
      // Return mock data for the specific ID when API fails
      return getFallbackGroup(id);
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
      // Return the group object back as if it was created successfully
      return { ...group, _id: Math.random().toString(36).substring(2, 9) };
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
      // Return the updated group object as if it was updated successfully
      return { ...getFallbackGroup(id), ...group };
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
      // Just return to simulate successful deletion
      return;
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
      // Return a mock group with the user added to members
      const mockGroup = getFallbackGroup(groupId);
      if (!mockGroup.members) {
        mockGroup.members = [];
      }
      mockGroup.members.push(userData);
      return mockGroup;
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
      // Return mock data for user groups
      return Array(3).fill(0).map((_, i) => {
        const group = getFallbackGroup(`${100 + i}`, email);
        group.createdBy.email = email;
        return group;
      });
    }
  },

  // Categories
  getCategories: async (): Promise<string[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`);
      return handleResponse(response);
    } catch (error) {
      console.error("API Error in getCategories:", error);
      return mockCategories;
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
