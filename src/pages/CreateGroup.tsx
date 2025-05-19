
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { Fade } from "react-awesome-reveal";
import { useToast } from "@/components/ui/use-toast";

interface CreateGroupFormData {
  groupName: string;
  category: string;
  description: string;
  location: string;
  maxMembers: number;
  startDate: string;
  imageUrl: string;
}

export default function CreateGroup() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<CreateGroupFormData>();
  
  const selectedCategory = watch("category");
  
  // Format date to YYYY-MM-DD for default value
  const today = new Date();
  today.setDate(today.getDate() + 1); // Set tomorrow as min date
  const formattedDate = today.toISOString().split('T')[0];
  
  const onSubmit = async (data: CreateGroupFormData) => {
    if (!currentUser) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "You must be logged in to create a group.",
      });
      return;
    }
    
    const newGroup: HobbyGroup = {
      ...data,
      maxMembers: Number(data.maxMembers),
      createdBy: {
        name: currentUser.displayName || "Anonymous",
        email: currentUser.email || "",
      },
      members: [
        {
          name: currentUser.displayName || "Anonymous",
          email: currentUser.email || "",
        }
      ]
    };
    
    try {
      setLoading(true);
      
      // Get the user token for authentication
      const token = await currentUser.getIdToken();
      
      // Create the group
      await api.createGroup(newGroup, token);
      
      // Show success message
      toast({
        title: "Group created!",
        description: `Your group "${data.groupName}" has been created successfully.`,
      });
      
      // Navigate to my groups page
      navigate("/my-groups");
    } catch (error) {
      console.error("Error creating group:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create group. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container py-10">
      <Fade triggerOnce>
        <h1 className="text-4xl font-bold mb-4">Create a Hobby Group</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Share your passion with others by starting a new hobby group
        </p>
      </Fade>

      <Fade triggerOnce delay={100}>
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Group Details</CardTitle>
            <CardDescription>
              Fill out the form below to create your new hobby group
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} id="create-group-form" className="space-y-6">
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
                    onValueChange={(value) => setValue("category", value)}
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
                  <input 
                    type="hidden" 
                    {...register("category", { required: "Category is required" })}
                  />
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
                    defaultValue="10"
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
                    defaultValue={formattedDate}
                    min={formattedDate}
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
            <Button type="submit" form="create-group-form" disabled={loading}>
              {loading ? <Spinner size="sm" className="mr-2" /> : null}
              Create Group
            </Button>
          </CardFooter>
        </Card>
      </Fade>
    </div>
  );
}
