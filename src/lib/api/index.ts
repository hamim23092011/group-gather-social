
// Export types
export type { HobbyGroup } from "./types";

// Export mock data
export { mockCategories } from "./mock-data";

// Export all group-related functions
export {
  getGroups,
  getFeaturedGroups,
  getGroupById,
  createGroup,
  updateGroup,
  deleteGroup,
  joinGroup,
  getUserGroups,
} from "./groups";

// Export category-related functions
export { getCategories } from "./categories";

// Create a consolidated API object for backward compatibility
import * as groupAPI from "./groups";
import * as categoryAPI from "./categories";

export const api = {
  // Groups
  getGroups: groupAPI.getGroups,
  getFeaturedGroups: groupAPI.getFeaturedGroups,
  getGroupById: groupAPI.getGroupById,
  createGroup: groupAPI.createGroup,
  updateGroup: groupAPI.updateGroup,
  deleteGroup: groupAPI.deleteGroup,
  joinGroup: groupAPI.joinGroup,
  getUserGroups: groupAPI.getUserGroups,
  
  // Categories
  getCategories: categoryAPI.getCategories,
};
