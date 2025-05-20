
import { HobbyGroup } from "./types";

// Base URL for our API
export const API_BASE_URL = "https://hobby-hub-backend-hamim.vercel.app/api";

// Mock categories for when API fails
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

// Fallback data for when API fails
export const getFallbackGroup = (id: string, currentUserEmail?: string, currentUserName?: string): HobbyGroup => {
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
