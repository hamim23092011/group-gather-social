
import { HobbyGroup } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";
import { CategoryIcon } from "./CategoryIcons";

interface GroupCardProps {
  group: HobbyGroup;
}

export function GroupCard({ group }: GroupCardProps) {
  // Check if group is active
  const isActive = new Date(group.startDate) > new Date();
  
  // Format date
  const formattedDate = new Date(group.startDate).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  
  return (
    <Card className="h-full flex flex-col overflow-hidden hover:shadow-md transition-shadow">
      <div className="aspect-video w-full relative overflow-hidden">
        <img 
          src={group.imageUrl} 
          alt={group.groupName} 
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <Badge 
          className="absolute top-2 right-2"
          variant={isActive ? "default" : "secondary"}
        >
          {isActive ? "Active" : "Past"}
        </Badge>
      </div>
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline" className="flex gap-1 items-center">
            <CategoryIcon category={group.category} className="h-3 w-3" />
            <span>{group.category}</span>
          </Badge>
        </div>
        <CardTitle>{group.groupName}</CardTitle>
        <CardDescription className="flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          {group.location}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="line-clamp-3 text-sm">{group.description}</p>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <div className="flex justify-between items-center w-full text-sm">
          <div className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            <span>
              {group.members?.length || 1}/{group.maxMembers}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <span>{formattedDate}</span>
          </div>
        </div>
        <Button className="w-full" asChild>
          <Link to={`/group/${group._id}`}>
            View Group
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
