
import { HobbyGroup } from "@/lib/api";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface GroupCardProps {
  group: HobbyGroup;
}

export function GroupCard({ group }: GroupCardProps) {
  // Format date
  const formattedDate = new Date(group.startDate).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  
  // Check if group is active
  const isActive = new Date(group.startDate) > new Date();
  
  return (
    <Card className="hobby-card overflow-hidden h-full flex flex-col">
      <CardHeader className="p-0">
        <div className="relative h-48">
          <img
            src={group.imageUrl}
            alt={group.groupName}
            className="hobby-card-image h-full w-full object-cover"
          />
          <Badge 
            className="absolute top-2 right-2" 
            variant={isActive ? "default" : "secondary"}
          >
            {isActive ? "Active" : "Past"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <div className="mb-2">
          <Badge variant="outline">{group.category}</Badge>
        </div>
        <h3 className="font-bold text-lg mb-2 line-clamp-1">{group.groupName}</h3>
        <p className="text-muted-foreground text-sm mb-2">
          <strong>Location:</strong> {group.location}
        </p>
        <p className="text-muted-foreground text-sm mb-2">
          <strong>Date:</strong> {formattedDate}
        </p>
        <p className="text-muted-foreground text-sm line-clamp-2">
          {group.description}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link 
          to={`/group/${group._id}`} 
          className="w-full inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
        >
          See More
        </Link>
      </CardFooter>
    </Card>
  );
}
