
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
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { api, mockCategories, HobbyGroup } from "@/lib/api";
import { Spinner } from "@/components/ui/custom/Spinner";
import { useToast } from "@/hooks/use-toast";

// Create a type for the form data
export interface CreateGroupFormData {
  groupName: string;
  category: string;
  description: string;
  location: string;
  maxMembers: number;
  startDate: string;
  imageUrl: string;
}

const CreateGroupForm = () => {
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
    <>
      <CardHeader>
        <CardTitle>Group Details</CardTitle>
        <CardDescription>
          Fill out the form below to create your new hobby group
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} id="create-group-form" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              id="groupName"
              label="Group Name"
              error={errors.groupName}
              registration={register("groupName", {
                required: "Group name is required",
                minLength: {
                  value: 5,
                  message: "Group name must be at least 5 characters",
                },
              })}
            />

            <CategorySelector 
              selected={selectedCategory} 
              onSelect={(value) => setValue("category", value)} 
              error={errors.category}
              register={register}
            />

            <FormField
              id="location"
              label="Meeting Location"
              error={errors.location}
              registration={register("location", {
                required: "Location is required",
              })}
            />

            <FormField
              id="maxMembers"
              label="Maximum Members"
              type="number"
              defaultValue="10"
              min="2"
              max="100"
              error={errors.maxMembers}
              registration={register("maxMembers", {
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

            <FormField
              id="startDate"
              label="Start Date"
              type="date"
              defaultValue={formattedDate}
              min={formattedDate}
              error={errors.startDate}
              registration={register("startDate", {
                required: "Start date is required",
              })}
            />

            <FormField
              id="imageUrl"
              label="Image URL"
              placeholder="https://example.com/image.jpg"
              error={errors.imageUrl}
              registration={register("imageUrl", {
                required: "Image URL is required",
                pattern: {
                  value: /^(https?:\/\/)/i,
                  message: "Must be a valid URL starting with http:// or https://",
                },
              })}
            />
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
            <UserInfoFields />
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
    </>
  );
};

export default CreateGroupForm;

// Reusable FormField component
interface FormFieldProps {
  id: string;
  label: string;
  error?: any;
  type?: string;
  placeholder?: string;
  min?: string;
  max?: string;
  defaultValue?: string;
  registration: any;
}

const FormField = ({ id, label, error, type = "text", placeholder, min, max, defaultValue, registration }: FormFieldProps) => (
  <div className="space-y-2">
    <Label htmlFor={id}>{label}</Label>
    <Input
      id={id}
      type={type}
      placeholder={placeholder}
      min={min}
      max={max}
      defaultValue={defaultValue}
      {...registration}
    />
    {error && <p className="text-sm text-destructive">{error.message}</p>}
  </div>
);

// Category selection component
interface CategorySelectorProps {
  selected?: string;
  onSelect: (value: string) => void;
  error?: any;
  register: any;
}

const CategorySelector = ({ selected, onSelect, error, register }: CategorySelectorProps) => (
  <div className="space-y-2">
    <Label htmlFor="category">Category</Label>
    <Select onValueChange={onSelect}>
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
    {error && <p className="text-sm text-destructive">{error.message}</p>}
  </div>
);

// User info display component
const UserInfoFields = () => {
  const { currentUser } = useAuth();
  
  return (
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
  );
};
