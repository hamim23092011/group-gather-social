import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
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
  CardContent, 
  CardFooter,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Spinner } from "@/components/ui/custom/Spinner";
import { api, mockCategories, HobbyGroup } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

interface UpdateGroupFormProps {
  group: HobbyGroup;
  groupId: string;
  onSuccess?: () => void;
}

interface UpdateGroupFormData {
  groupName: string;
  category: string;
  description: string;
  location: string;
  maxMembers: number;
  startDate: string;
  imageUrl: string;
}

export default function UpdateGroupForm({ group, groupId, onSuccess }: UpdateGroupFormProps) {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [updating, setUpdating] = useState(false);

  const { register, handleSubmit, formState: { errors }, setValue, control } = useForm<UpdateGroupFormData>({
    defaultValues: {
      groupName: group.groupName,
      category: group.category,
      description: group.description,
      location: group.location,
      maxMembers: group.maxMembers,
      startDate: new Date(group.startDate).toISOString().split("T")[0],
      imageUrl: group.imageUrl,
    }
  });

  // Format date to YYYY-MM-DD for min date
  const today = new Date();
  const formattedToday = today.toISOString().split('T')[0];
  
  const onSubmit = async (data: UpdateGroupFormData) => {
    try {
      if (!currentUser || !groupId) return;
      
      setUpdating(true);
      
      // Get user token
      const token = await currentUser.getIdToken();
      
      // Update the group
      await api.updateGroup(
        groupId,
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
      
      // Navigate back to my groups or call the success callback
      if (onSuccess) {
        onSuccess();
      } else {
        navigate("/my-groups");
      }
      
    } catch (error) {
      console.error("Error updating group:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update the group. Please try again.",
      });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} id="update-group-form" className="space-y-6">
      <CardContent>
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
              defaultValue={group.category}
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
              min={formattedToday}
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

        <div className="space-y-2 mt-6">
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

        <div className="space-y-2 mt-6">
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
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => navigate("/my-groups")}>
          Cancel
        </Button>
        <Button type="submit" disabled={updating}>
          {updating ? <Spinner size="sm" className="mr-2" /> : null}
          Update Group
        </Button>
      </CardFooter>
    </form>
  );
}
