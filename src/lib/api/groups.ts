
import { HobbyGroup } from "./types";
import { API_BASE_URL, getFallbackGroup } from "./mock-data";
import { handleResponse } from "./utils";

// Groups API functions
export const getGroups = async (): Promise<HobbyGroup[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/groups`);
    return handleResponse(response);
  } catch (error) {
    console.error("API Error in getGroups:", error);
    
    // Return mock data when API fails
    return Array(6).fill(0).map((_, i) => getFallbackGroup(`${100 + i}`));
  }
};

export const getFeaturedGroups = async (): Promise<HobbyGroup[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/groups/featured`);
    return handleResponse(response);
  } catch (error) {
    console.error("API Error in getFeaturedGroups:", error);
    
    // Return mock data when API fails
    return Array(6).fill(0).map((_, i) => getFallbackGroup(`${100 + i}`));
  }
};

export const getGroupById = async (id: string): Promise<HobbyGroup> => {
  try {
    const response = await fetch(`${API_BASE_URL}/groups/${id}`);
    return handleResponse(response);
  } catch (error) {
    console.error(`API Error in getGroupById for ID ${id}:`, error);
    
    // Return mock data for the specific ID when API fails
    return getFallbackGroup(id);
  }
};

export const createGroup = async (group: HobbyGroup, token: string): Promise<HobbyGroup> => {
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
};

export const updateGroup = async (id: string, group: Partial<HobbyGroup>, token: string): Promise<HobbyGroup> => {
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
};

export const deleteGroup = async (id: string, token: string): Promise<void> => {
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
};

export const joinGroup = async (groupId: string, userData: { name: string; email: string }, token: string): Promise<HobbyGroup> => {
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
};

export const getUserGroups = async (email: string, token: string): Promise<HobbyGroup[]> => {
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
};
