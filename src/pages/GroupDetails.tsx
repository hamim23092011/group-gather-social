
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { HobbyGroup, api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/custom/Spinner";
import { Badge } from "@/components/ui/badge";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Fade } from "react-awesome-reveal";
import { useAuth } from "@/context/AuthContext";
import { Tooltip } from "react-tooltip";
import { useToast } from "@/components/ui/use-toast";

export default function GroupDetails() {
  const { id } = useParams<{ id: string }>();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [group, setGroup] = useState<HobbyGroup | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchGroup = async () => {
      try {
        if (!id) return;
        
        setLoading(true);
        const data = await api.getGroupById(id);
        setGroup(data);
        setError(null);
      } catch (error) {
        console.error("Error fetching group:", error);
        setError("Failed to load group details. Please try again.");
        
        // Fallback to mock data for development
        if (id === "1") {
          setGroup({
            _id: "1",
            groupName: "Downtown Photography Club",
            category: "Photography",
            description: "Weekly meetups to explore urban photography in the heart of the city. All skill levels welcome! Join us for photo walks, critique sessions, and workshops. We focus on street photography, architecture, and capturing the essence of urban life. Our group is open to all skill levels, from beginners to professionals. We believe in learning from each other and growing together as photographers.\n\nOur regular activities include:\n- Weekly photo walks in different neighborhoods\n- Monthly critique sessions\n- Quarterly exhibitions\n- Photography workshops led by members",
            location: "Central Park",
            maxMembers: 15,
            startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            imageUrl: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e",
            createdBy: {
              name: "Emma Johnson",
              email: "emma.j@example.com"
            },
            members: [
              {
                name: "Emma Johnson",
                email: "emma.j@example.com"
              },
              {
                name: "John Smith",
                email: "john.smith@example.com"
              }
            ]
          });
          setError(null);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchGroup();
  }, [id]);
  
  // Check if group is active
  const isActive = group && new Date(group.startDate) > new Date();
  
  // Check if user is already a member
  const isMember = group?.members?.some(
    member => member.email === currentUser?.email
  );
  
  // Check if group is full
  const isFull = group?.members && group.maxMembers <= group.members.length;
  
  // Format date
  const formattedDate = group?.startDate
    ? new Date(group.startDate).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";
  
  // Join group
  const handleJoinGroup = async () => {
    try {
      if (!currentUser || !group || !id) return;
      
      setJoining(true);
      
      // Get user token
      const token = await currentUser.getIdToken();
      
      // Join the group
      await api.joinGroup(
        id,
        {
          name: currentUser.displayName || "Anonymous",
          email: currentUser.email || "",
        },
        token
      );
      
      // Update the UI to show the user as a member
      setGroup(prev => {
        if (!prev) return prev;
        
        const updatedMembers = [
          ...(prev.members || []),
          {
            name: currentUser.displayName || "Anonymous",
            email: currentUser.email || "",
          },
        ];
        
        return { ...prev, members: updatedMembers };
      });
      
      // Show success message
      toast({
        title: "Success!",
        description: `You've joined the "${group.groupName}" group.`,
      });
    } catch (error) {
      console.error("Error joining group:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to join the group. Please try again.",
      });
    } finally {
      setJoining(false);
    }
  };
  
  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }
  
  if (error || !group) {
    return (
      <div className="container py-10">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error || "Group not found"}</AlertDescription>
        </Alert>
        <Button asChild className="mt-4">
          <Link to="/groups">Back to All Groups</Link>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="container py-10">
      <Fade triggerOnce>
        {/* Hero section */}
        <div className="relative h-80 mb-8 rounded-lg overflow-hidden">
          <img
            src={group.imageUrl}
            alt={group.groupName}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
            <div className="p-6 w-full">
              <Badge className="mb-2" variant={isActive ? "default" : "secondary"}>
                {isActive ? "Active" : "Past"}
              </Badge>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{group.groupName}</h1>
              <div className="text-white/90 flex flex-wrap gap-2 items-center">
                <Badge variant="outline" className="bg-background/20">{group.category}</Badge>
                <span className="text-sm">·</span>
                <span className="text-sm">{group.location}</span>
                <span className="text-sm">·</span>
                <span className="text-sm">
                  {group.members?.length || 1} / {group.maxMembers} members
                </span>
              </div>
            </div>
          </div>
        </div>
      </Fade>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <Fade triggerOnce className="lg:col-span-2">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-4">About this group</h2>
              <div className="space-y-4 text-lg">
                {group.description.split('\n\n').map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold mb-4">Meeting Details</h2>
              <div className="space-y-2">
                <p className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  <span>{group.location}</span>
                </p>
                <p className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  <span>{formattedDate}</span>
                </p>
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold mb-4">Organizer</h2>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg mr-4">
                  {group.createdBy.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium">{group.createdBy.name}</p>
                  <p className="text-sm text-muted-foreground">Group Creator</p>
                </div>
              </div>
            </div>
          </div>
        </Fade>
        
        {/* Sidebar */}
        <Fade triggerOnce delay={100} className="space-y-6">
          {/* Join status */}
          <div className="bg-card p-6 rounded-lg border">
            {!isActive ? (
              <div className="text-center">
                <svg className="w-12 h-12 text-muted-foreground mx-auto mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
                <h3 className="text-xl font-semibold mb-2">Group has ended</h3>
                <p className="text-muted-foreground mb-4">
                  This group is no longer active as the start date has passed.
                </p>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/groups">Find Active Groups</Link>
                </Button>
              </div>
            ) : isMember ? (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-8 h-8 text-green-600 dark:text-green-300" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">You're a member!</h3>
                <p className="text-muted-foreground">
                  You've already joined this group.
                </p>
              </div>
            ) : isFull ? (
              <div className="text-center">
                <svg className="w-12 h-12 text-muted-foreground mx-auto mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
                <h3 className="text-xl font-semibold mb-2">Group is full</h3>
                <p className="text-muted-foreground">
                  This group has reached its maximum capacity of {group.maxMembers} members.
                </p>
              </div>
            ) : (
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-4">Join this group</h3>
                <Button 
                  className="w-full" 
                  onClick={handleJoinGroup} 
                  disabled={joining}
                  data-tooltip-id="join-tooltip"
                >
                  {joining ? <Spinner size="sm" className="mr-2" /> : null}
                  Join Group
                </Button>
                <Tooltip id="join-tooltip">
                  Connect with others who share your interest in {group.category}
                </Tooltip>
              </div>
            )}
          </div>
          
          {/* Members */}
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-xl font-semibold mb-4">Members ({group.members?.length || 1} / {group.maxMembers})</h3>
            <ul className="space-y-3">
              {group.members?.slice(0, 5).map((member, i) => (
                <li key={i} className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm mr-3">
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 truncate">
                    <p className="font-medium truncate">{member.name}</p>
                  </div>
                </li>
              ))}
              {group.members && group.members.length > 5 && (
                <li className="text-center text-muted-foreground text-sm">
                  + {group.members.length - 5} more members
                </li>
              )}
            </ul>
          </div>
          
          {/* Actions */}
          <div className="space-y-3">
            <Button asChild variant="outline" className="w-full">
              <Link to="/groups">Back to All Groups</Link>
            </Button>
            {currentUser?.email === group.createdBy.email && (
              <Button asChild className="w-full">
                <Link to={`/update-group/${group._id}`}>Edit Group</Link>
              </Button>
            )}
          </div>
        </Fade>
      </div>
    </div>
  );
}
