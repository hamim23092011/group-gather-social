
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription
} from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { api, HobbyGroup } from "@/lib/api";
import { Fade } from "react-awesome-reveal";

// Import our new components
import UpdateGroupForm from "@/components/groups/UpdateGroupForm";
import GroupAccessError from "@/components/groups/GroupAccessError";
import GroupLoading from "@/components/groups/GroupLoading";

export default function UpdateGroup() {
  const { id } = useParams<{ id: string }>();
  const { currentUser } = useAuth();
  
  const [group, setGroup] = useState<HobbyGroup | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch group details
  useEffect(() => {
    const fetchGroup = async () => {
      try {
        if (!id || !currentUser) return;
        
        setLoading(true);
        
        // Get user token
        const token = await currentUser.getIdToken();
        
        // Fetch the group
        const groupData = await api.getGroupById(id);
        
        // Check if the current user is the creator
        if (groupData.createdBy.email !== currentUser.email) {
          setError("You don't have permission to update this group.");
          return;
        }
        
        setGroup(groupData);
        
      } catch (error) {
        console.error("Error fetching group:", error);
        setError("Failed to load group details. Please try again.");
        
        // Fallback to mock data for development
        if (id === "101" && currentUser) {
          const mockGroup = {
            _id: "101",
            groupName: "Urban Sketchers",
            category: "Drawing & Painting",
            description: "Weekly sketching sessions around the city.",
            location: "Various City Locations",
            maxMembers: 12,
            startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            imageUrl: "https://images.unsplash.com/photo-1513364776144-60967b0f800f",
            createdBy: {
              name: currentUser.displayName || "User",
              email: currentUser.email || "",
            },
          };
          
          setGroup(mockGroup);
          setError(null);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchGroup();
  }, [id, currentUser]);
  
  if (loading) {
    return <GroupLoading />;
  }
  
  if (error) {
    return <GroupAccessError message={error} />;
  }
  
  if (!group) {
    return <GroupAccessError message="Group not found." />;
  }
  
  return (
    <div className="container py-10">
      <Fade triggerOnce>
        <h1 className="text-4xl font-bold mb-4">Update Group</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Edit the details of your hobby group
        </p>
      </Fade>

      <Fade triggerOnce delay={100}>
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Edit Group Details</CardTitle>
            <CardDescription>
              Update the information for "{group.groupName}"
            </CardDescription>
          </CardHeader>
          <UpdateGroupForm group={group} groupId={id || ""} />
        </Card>
      </Fade>
    </div>
  );
}
