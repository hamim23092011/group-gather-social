import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Typewriter } from "react-simple-typewriter";
import { Fade, Zoom } from "react-awesome-reveal";
import { Tooltip } from "react-tooltip";
import { Button } from "@/components/ui/button";
import { GroupCard } from "@/components/ui/custom/GroupCard";
import { HobbyStats } from "@/components/ui/custom/HobbyStats";
import { HobbyGroup, api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

// Carousel images
const bannerSlides = [
  {
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2389&q=80",
    title: "Find Your Community",
    description: "Connect with people who share your interests"
  },
  {
    image: "https://images.unsplash.com/photo-1515169067868-5387ec356754?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2370&q=80",
    title: "Share Your Passion",
    description: "Create groups around activities you love"
  },
  {
    image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2370&q=80",
    title: "Make Local Connections",
    description: "Build meaningful relationships in your area"
  }
];

// Mock featured groups
const initialFeaturedGroups: HobbyGroup[] = [
  {
    _id: "1",
    groupName: "Downtown Photography Club",
    category: "Photography",
    description: "Weekly meetups to explore urban photography in the heart of the city. All skill levels welcome!",
    location: "Central Park",
    maxMembers: 15,
    startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week from now
    imageUrl: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cGhvdG9ncmFwaHl8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=60",
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
    startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks from now
    imageUrl: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Ym9va3xlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=60",
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
    startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    imageUrl: "https://images.unsplash.com/photo-1551632811-561732d1e306?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aGlraW5nfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=60",
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
    startDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
    imageUrl: "https://images.unsplash.com/photo-1507048331197-7d4ac70811cf?ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8Y29va2luZ3xlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=60",
    createdBy: {
      name: "Sophia Garcia",
      email: "sophia.g@example.com"
    }
  },
  {
    _id: "5",
    groupName: "Digital Artists Collective",
    category: "Drawing & Painting",
    description: "Weekly digital art sessions where artists can share techniques, get feedback, and collaborate on projects.",
    location: "Creative Hub",
    maxMembers: 15,
    startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
    imageUrl: "https://images.unsplash.com/photo-1536566482680-fca31930a0bd?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8ZGlnaXRhbCUyMGFydHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=60",
    createdBy: {
      name: "Alex Kim",
      email: "alex.kim@example.com"
    }
  },
  {
    _id: "6",
    groupName: "Board Game Night",
    category: "Board Games",
    description: "Weekly meetups for board game enthusiasts. From classics to modern games, there's something for everyone!",
    location: "Game Café",
    maxMembers: 16,
    startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
    imageUrl: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Ym9hcmQlMjBnYW1lfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=60",
    createdBy: {
      name: "James Wilson",
      email: "james.w@example.com"
    }
  },
];

export default function Home() {
  const { currentUser } = useAuth();
  const [currentBannerSlide, setCurrentBannerSlide] = useState(0);
  const [featuredGroups, setFeaturedGroups] = useState<HobbyGroup[]>(initialFeaturedGroups);
  const [isLoading, setIsLoading] = useState(true);

  // Auto-rotate banner slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBannerSlide((prev) => (prev + 1) % bannerSlides.length);
    }, 5000);
    
    return () => clearInterval(timer);
  }, []);

  // Fetch featured groups 
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setIsLoading(true);
        const groups = await api.getFeaturedGroups();
        
        // If we get data, use it, otherwise fall back to mock data
        if (groups && groups.length > 0) {
          setFeaturedGroups(groups);
        }
      } catch (error) {
        console.error("Error fetching featured groups:", error);
        // Keep using our mock data
      } finally {
        setIsLoading(false);
      }
    };

    fetchGroups();
  }, []);
  
  return (
    <>
      {/* Hero Banner */}
      <section className="relative h-[80vh] bg-black overflow-hidden">
        {bannerSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              currentBannerSlide === index ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="absolute inset-0 bg-black/50 z-10"></div>
            <img
              src={slide.image}
              alt={slide.title}
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="text-center text-white max-w-xl mx-auto px-4">
                <Fade direction="up" triggerOnce>
                  <h1 className="text-4xl md:text-6xl font-bold mb-4">{slide.title}</h1>
                </Fade>
                <p className="text-xl md:text-2xl mb-8">{slide.description}</p>
                <Fade delay={300} triggerOnce>
                  <div className="text-xl md:text-3xl font-semibold h-12">
                    <span>Find groups for&nbsp;</span>
                    <span className="text-primary">
                      <Typewriter
                        words={[
                          'Photography',
                          'Book Clubs',
                          'Hiking',
                          'Cooking',
                          'Board Games',
                          'Music',
                          'Art',
                          'any hobby!'
                        ]}
                        loop={0}
                        typeSpeed={80}
                        deleteSpeed={60}
                        delaySpeed={1500}
                      />
                    </span>
                  </div>
                </Fade>
                <div className="mt-8">
                  <Button asChild size="lg" className="mr-4">
                    <Link to="/groups">Explore Groups</Link>
                  </Button>
                  {currentUser ? (
                    <Button asChild size="lg" variant="outline" className="bg-background/20 hover:bg-background/30">
                      <Link to="/create-group">Create Group</Link>
                    </Button>
                  ) : (
                    <Button asChild size="lg" variant="outline" className="bg-background/20 hover:bg-background/30">
                      <Link to="/login">Join Now</Link>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Slide indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-30">
          {bannerSlides.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full ${
                currentBannerSlide === index ? "bg-white" : "bg-white/50"
              }`}
              onClick={() => setCurrentBannerSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/50">
        <div className="container">
          <Fade>
            <HobbyStats groups={featuredGroups} loading={isLoading} />
          </Fade>
        </div>
      </section>

      {/* Featured Groups Section */}
      <section className="py-16">
        <div className="container">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold mb-2">Featured Groups</h2>
            <p className="text-xl text-muted-foreground">
              Join these active hobby groups in your area
            </p>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse rounded-lg overflow-hidden">
                  <div className="h-48 bg-muted"></div>
                  <div className="p-4">
                    <div className="h-4 bg-muted rounded w-1/4 mb-2"></div>
                    <div className="h-6 bg-muted rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-muted rounded mb-2"></div>
                    <div className="h-4 bg-muted rounded mb-4"></div>
                    <div className="h-10 bg-muted rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredGroups.map((group, index) => (
                <Zoom key={group._id} delay={index * 100}>
                  <GroupCard group={group} />
                </Zoom>
              ))}
            </div>
          )}
          
          <div className="mt-10 text-center">
            <Button asChild size="lg">
              <Link to="/groups">See All Groups</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-muted">
        <div className="container">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold mb-2">How HobbyHub Works</h2>
            <p className="text-xl text-muted-foreground">
              Connect, create, and cultivate your interests in three simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Fade direction="left" delay={200} triggerOnce cascade>
              <div className="text-center p-6">
                <div className="mb-4 rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Discover Groups</h3>
                <p className="text-muted-foreground">
                  Browse local hobby groups in your area that match your interests and passions.
                </p>
              </div>
            </Fade>
            
            <Fade direction="up" delay={400} triggerOnce>
              <div className="text-center p-6">
                <div className="mb-4 rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Create or Join</h3>
                <p className="text-muted-foreground">
                  Join existing groups or create your own to share your hobby with like-minded individuals.
                </p>
              </div>
            </Fade>
            
            <Fade direction="right" delay={600} triggerOnce>
              <div className="text-center p-6">
                <div className="mb-4 rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Connect & Enjoy</h3>
                <p className="text-muted-foreground">
                  Meet up with your group, make new friends, and enjoy your hobbies together.
                </p>
              </div>
            </Fade>
          </div>
          
          <div className="mt-12 text-center" data-tooltip-id="create-tooltip">
            <Button asChild size="lg">
              <Link to={currentUser ? "/create-group" : "/login"}>
                {currentUser ? "Create Your Group" : "Sign Up to Create Groups"}
              </Link>
            </Button>
          </div>

          <Tooltip id="create-tooltip" place="top">
            {currentUser ? "Start your own hobby group today!" : "Sign up to create and manage your own hobby groups"}
          </Tooltip>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold mb-2">Explore By Category</h2>
            <p className="text-xl text-muted-foreground">
              Find the perfect hobby group that matches your interests
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {[
              "Photography", "Reading", "Hiking", "Cooking", 
              "Drawing & Painting", "Video Gaming", "Writing", "Board Games"
            ].map((category, index) => (
              <Link 
                key={category} 
                to={`/groups?category=${encodeURIComponent(category)}`}
                className="bg-card hover:bg-accent/10 border rounded-lg p-4 text-center transition-colors"
                data-tooltip-id={`category-tooltip-${index}`}
                data-tooltip-content={`Browse all ${category} groups`}
              >
                <div className="mb-3 flex justify-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <CategoryIcon category={category} className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <h3 className="font-medium">{category}</h3>
                <Tooltip id={`category-tooltip-${index}`} />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
