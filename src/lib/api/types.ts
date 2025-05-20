
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
