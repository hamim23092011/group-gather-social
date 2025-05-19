
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { HobbyGroup, api, mockCategories } from "@/lib/api";
import { GroupCard } from "@/components/ui/custom/GroupCard";
import { Spinner } from "@/components/ui/custom/Spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CategoryIcon } from "@/components/ui/custom/CategoryIcons";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Fade } from "react-awesome-reveal";

export default function AllGroups() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialCategoryFilter = queryParams.get("category") || "";
  
  const [groups, setGroups] = useState<HobbyGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState(initialCategoryFilter);
  const [sortOrder, setSortOrder] = useState("newest");

  const fetchGroups = async () => {
    try {
      setLoading(true);
      
      // Attempt to get groups from API
      const fetchedGroups = await api.getGroups();
      setGroups(fetchedGroups);
      
    } catch (error) {
      console.error("Error fetching groups:", error);
      
      // Fallback to mock data for development
      setGroups([
        {
          _id: "1",
          groupName: "Downtown Photography Club",
          category: "Photography",
          description: "Weekly meetups to explore urban photography in the heart of the city. All skill levels welcome!",
          location: "Central Park",
          maxMembers: 15,
          startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          imageUrl: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e",
          createdBy: {
            name: "Emma Johnson",
            email: "emma.j@example.com"
          }
        },
        {
          _id: "2",
          groupName: "Book Lovers Society",
          category: "Reading",
          description: "Monthly book club meetings to discuss contemporary fiction and classics. Join us for thoughtful conversations!",
          location: "City Library",
          maxMembers: 20,
          startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          imageUrl: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0",
          createdBy: {
            name: "David Smith",
            email: "david.smith@example.com"
          }
        },
        {
          _id: "3",
          groupName: "Sunset Hikers",
          category: "Hiking",
          description: "Weekend hiking adventures to local trails and mountains. Experience the beauty of nature with fellow outdoor enthusiasts!",
          location: "Mountain Trails",
          maxMembers: 12,
          startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          imageUrl: "https://images.unsplash.com/photo-1551632811-561732d1e306",
          createdBy: {
            name: "Michael Brown",
            email: "michael.b@example.com"
          }
        },
        {
          _id: "4",
          groupName: "Culinary Explorers",
          category: "Cooking",
          description: "Hands-on cooking workshops focusing on international cuisines. Learn new recipes and techniques from around the world!",
          location: "Community Kitchen",
          maxMembers: 10,
          startDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
          imageUrl: "https://images.unsplash.com/photo-1507048331197-7d4ac70811cf",
          createdBy: {
            name: "Sophia Garcia",
            email: "sophia.g@example.com"
          }
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  // Filter groups based on search query and category
  const filteredGroups = groups
    .filter(group =>
      group.groupName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.location.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(group => 
      categoryFilter ? group.category === categoryFilter : true
    );

  // Sort groups based on sort order
  const sortedGroups = [...filteredGroups].sort((a, b) => {
    switch (sortOrder) {
      case "newest":
        return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
      case "oldest":
        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
      case "name-asc":
        return a.groupName.localeCompare(b.groupName);
      case "name-desc":
        return b.groupName.localeCompare(a.groupName);
      default:
        return 0;
    }
  });

  return (
    <div className="container py-10">
      <div className="mb-8">
        <Fade>
          <h1 className="text-4xl font-bold mb-4">All Hobby Groups</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Discover and join groups that match your interests
          </p>
        
          {/* Filter and search */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1">
              <Input
                placeholder="Search groups..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="w-full md:w-64">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {mockCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      <div className="flex items-center">
                        <CategoryIcon category={category} className="mr-2 h-4 w-4" />
                        {category}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-64">
              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                  <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {categoryFilter && (
              <Button 
                variant="outline" 
                onClick={() => setCategoryFilter("")}
                className="md:flex-none"
              >
                Clear Filter
              </Button>
            )}
          </div>
        </Fade>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : sortedGroups.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedGroups.map((group) => (
            <Fade key={group._id} triggerOnce>
              <GroupCard group={group} />
            </Fade>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">No groups found</h3>
          <p className="text-muted-foreground mb-6">
            {categoryFilter
              ? `No groups found in the "${categoryFilter}" category.`
              : "No groups match your search criteria."}
          </p>
          <Button onClick={() => {
            setSearchQuery("");
            setCategoryFilter("");
          }}>
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}
