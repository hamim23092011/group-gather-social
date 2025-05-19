import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { api, mockCategories, HobbyGroup } from "@/lib/api";
import { Spinner } from "@/components/ui/custom/Spinner";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Fade } from "react-awesome-reveal";

interface UpdateGroupFormData {
  groupName: string;
  category: string;
  description: string;
  location: string;
  maxMembers: number;
  startDate: string;
  imageUrl: string;
}

export default function UpdateGroup() {
  const { id } = useParams<{ id: string }>();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [group, setGroup] = useState<HobbyGroup | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<UpdateGroupFormData>();
  
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
        
        // Fill the form
        setValue("groupName", groupData.groupName);
        setValue("category", groupData.category);
        setValue("description", groupData.description);
        setValue("location", groupData.location);
        setValue("maxMembers", groupData.maxMembers);
        setValue("startDate", new Date(groupData.startDate).toISOString().split("T")[0]);
        setValue("imageUrl", groupData.imageUrl);
        
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
          
          // Fill the form
          setValue("groupName", mockGroup.groupName);
          setValue("category", mockGroup.category);
          setValue("description", mockGroup.description);
          setValue("location", mockGroup.location);
          setValue("maxMembers", mockGroup.maxMembers);
          setValue("startDate", new Date(mockGroup.startDate).toISOString().split("T")[0]);
          setValue("imageUrl", mockGroup.imageUrl);
          
          setError(null);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchGroup();
  }, [id, currentUser, setValue]);
  
  const onSubmit = async (data: UpdateGroupFormData) => {
    try {
      if (!currentUser || !id || !group) return;
      
      setUpdating(true);
      
      // Get user token
      const token = await currentUser.getIdToken();
      
      // Update the group
      await api.updateGroup(
        id,
        {
          ...data,
          maxMembers: Number(data.maxMembers),
        },
        token
      );
      
      // Show success message
      toast({
        title: "Success!",
        description: `Group "${data.groupName}" has been updated.`,
      });
      
      // Navigate back to my groups
      navigate("/my-groups");
      
    } catch (error) {
      console.error("Error updating group:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update the group. Please try again.",
      });
      setUpdating(false);
    }
  };
  
  // Format date to YYYY-MM-DD for min date
  const today = new Date();
  const formattedToday = today.toISOString().split('T')[0];
  
  if (loading) {
    return (
      <div className="container py-10">
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container py-10">
        <Alert variant="destructive">
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button
          className="mt-4"
          onClick={() => navigate("/my-groups")}
        >
          Back to My Groups
        </Button>
      </div>
    );
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
              Update the information for "{group?.groupName}"
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} id="update-group-form" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="groupName">Group Name</Label>
                  <Input
                    id="groupName"
                    {...register("groupName", {
                      required: "Group name is required",
                      minLength: {
                        value: 5,
                        message: "Group name must be at least 5 characters",
                      },
                    })}
                  />
                  {errors.groupName && (
                    <p className="text-sm text-destructive">{errors.groupName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    defaultValue={group?.category}
                    onValueChange={(value) => {
                      setValue("category", value);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-sm text-destructive">{errors.category.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Meeting Location</Label>
                  <Input
                    id="location"
                    {...register("location", {
                      required: "Location is required",
                    })}
                  />
                  {errors.location && (
                    <p className="text-sm text-destructive">{errors.location.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxMembers">Maximum Members</Label>
                  <Input
                    id="maxMembers"
                    type="number"
                    min="2"
                    max="100"
                    {...register("maxMembers", {
                      required: "Maximum members is required",
                      min: {
                        value: 2,
                        message: "Group must have at least 2 members",
                      },
                      max: {
                        value: 100,
                        message: "Group cannot have more than 100 members",
                      },
                    })}
                  />
                  {errors.maxMembers && (
                    <p className="text-sm text-destructive">{errors.maxMembers.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    {...register("startDate", {
                      required: "Start date is required",
                    })}
                  />
                  {errors.startDate && (
                    <p className="text-sm text-destructive">{errors.startDate.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="imageUrl">Image URL</Label>
                  <Input
                    id="imageUrl"
                    placeholder="https://example.com/image.jpg"
                    {...register("imageUrl", {
                      required: "Image URL is required",
                      pattern: {
                        value: /^(https?:\/\/)/i,
                        message: "Must be a valid URL starting with http:// or https://",
                      },
                    })}
                  />
                  {errors.imageUrl && (
                    <p className="text-sm text-destructive">{errors.imageUrl.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  rows={5}
                  {...register("description", {
                    required: "Description is required",
                    minLength: {
                      value: 20,
                      message: "Description must be at least 20 characters",
                    },
                  })}
                />
                {errors.description && (
                  <p className="text-sm text-destructive">{errors.description.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex flex-col md:flex-row md:space-x-4">
                  <div className="flex-1 mb-4 md:mb-0">
                    <Label htmlFor="createdByName">Your Name</Label>
                    <Input
                      id="createdByName"
                      value={currentUser?.displayName || ""}
                      disabled
                      className="bg-muted/50"
                    />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="createdByEmail">Your Email</Label>
                    <Input
                      id="createdByEmail"
                      value={currentUser?.email || ""}
                      disabled
                      className="bg-muted/50"
                    />
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => navigate("/my-groups")}>
              Cancel
            </Button>
            <Button type="submit" form="update-group-form" disabled={updating}>
              {updating ? <Spinner size="sm" className="mr-2" /> : null}
              Update Group
            </Button>
          </CardFooter>
        </Card>
      </Fade>
    </div>
  );
}
