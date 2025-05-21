import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { HobbyGroup, api } from "@/lib/api";
import { Spinner } from "@/components/ui/custom/Spinner";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Fade } from "react-awesome-reveal";
import { useToast } from "@/components/ui/use-toast";

export default function MyGroups() {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [myGroups, setMyGroups] = useState<HobbyGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  useEffect(() => {
    const fetchMyGroups = async () => {
      try {
        if (!currentUser) return;
        
        setLoading(true);
        
        // Get user email
        const userEmail = currentUser.email;
        
        if (!userEmail) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "User email not available.",
          });
          return;
        }
        
        // Get user token
        const token = await currentUser.getIdToken();
        
        // Fetch groups created by the user - FIXED: Added token as second argument
        const groups = await api.getUserGroups(userEmail, token);
        setMyGroups(groups);
      } catch (error) {
        console.error("Error fetching my groups:", error);
        
        // Show toast notification about using mock data
        toast({
          title: "Using mock data",
          description: "Could not connect to the server. Using sample data instead.",
          variant: "destructive"
        });
        
        // Fallback to mock data for development
        if (currentUser && currentUser.email) {
          setMyGroups([
            {
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
                email: currentUser.email,
              },
              members: [
                {
                  name: currentUser.displayName || "User",
                  email: currentUser.email,
                },
                {
                  name: "Jane Smith",
                  email: "jane.smith@example.com"
                },
              ]
            },
            {
              _id: "102",
              groupName: "Tech Book Club",
              category: "Reading",
              description: "Monthly meetups discussing technology books and papers.",
              location: "Coffee House",
              maxMembers: 15,
              startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // Past group
              imageUrl: "https://images.unsplash.com/photo-1513001900722-370f803f498d",
              createdBy: {
                name: currentUser.displayName || "User",
                email: currentUser.email,
              },
              members: [
                {
                  name: currentUser.displayName || "User",
                  email: currentUser.email,
                },
              ]
            },
          ]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMyGroups();
  }, [currentUser]);

  const handleDeleteGroup = async (groupId: string) => {
    try {
      if (!currentUser || !currentUser.email) return;
      
      setDeleteLoading(groupId);
      
      // Get user token for authentication
      const token = await currentUser.getIdToken();
      
      // Delete the group using token for authorization
      await api.deleteGroup(groupId, token);
      
      // Update UI
      setMyGroups(prev => prev.filter(group => group._id !== groupId));
      
      toast({
        title: "Group deleted",
        description: "The group has been successfully deleted.",
      });
    } catch (error) {
      console.error("Error deleting group:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete the group. Please try again.",
      });
    } finally {
      setDeleteLoading(null);
    }
  };

  return (
    <div className="container py-10">
      <Fade triggerOnce>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">My Groups</h1>
            <p className="text-xl text-muted-foreground">
              Manage the hobby groups you've created
            </p>
          </div>
          <Button asChild className="mt-4 md:mt-0">
            <Link to="/create-group">Create New Group</Link>
          </Button>
        </div>
      </Fade>

      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : myGroups.length > 0 ? (
        <Fade triggerOnce>
          <div className="rounded-md border overflow-hidden overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Group Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="hidden md:table-cell">Location</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                  <TableHead className="text-center hidden md:table-cell">Members</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myGroups.map((group) => {
                  const isActive = new Date(group.startDate) > new Date();
                  const formattedDate = new Date(group.startDate).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  });
                  
                  return (
                    <TableRow key={group._id}>
                      <TableCell className="font-medium">
                        <Link 
                          to={`/group/${group._id}`}
                          className="hover:text-primary hover:underline transition-colors"
                        >
                          {group.groupName}
                        </Link>
                      </TableCell>
                      <TableCell>{group.category}</TableCell>
                      <TableCell className="hidden md:table-cell">{group.location}</TableCell>
                      <TableCell className="hidden md:table-cell">{formattedDate}</TableCell>
                      <TableCell className="text-center hidden md:table-cell">
                        {group.members?.length || 1} / {group.maxMembers}
                      </TableCell>
                      <TableCell>
                        <Badge variant={isActive ? "default" : "secondary"}>
                          {isActive ? "Active" : "Past"}
                        </Badge>
                      </TableCell>
                      <TableCell className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          asChild
                        >
                          <Link to={`/update-group/${group._id}`}>
                            Update
                          </Link>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the group
                                "{group.groupName}" and remove all members from it.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteGroup(group._id || "")}
                                className="bg-destructive text-destructive-foreground"
                                disabled={deleteLoading === group._id}
                              >
                                {deleteLoading === group._id ? (
                                  <Spinner size="sm" className="mr-2" />
                                ) : null}
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </Fade>
      ) : (
        <div className="text-center py-16 bg-muted/30 rounded-lg border border-dashed">
          <svg
            className="mx-auto h-12 w-12 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          <h3 className="mt-4 text-xl font-semibold">No groups yet</h3>
          <p className="mt-2 text-muted-foreground">
            You haven't created any hobby groups yet.
          </p>
          <Button asChild className="mt-6">
            <Link to="/create-group">Create Your First Group</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
