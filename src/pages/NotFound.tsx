
import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Fade } from "react-awesome-reveal";

export default function NotFound() {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="container flex flex-col items-center justify-center min-h-[70vh] py-16 text-center">
      <Fade direction="down" triggerOnce>
        <div className="rounded-full bg-muted/50 p-6 mb-8">
          <svg
            className="w-16 h-16 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
      </Fade>

      <Fade triggerOnce>
        <h1 className="text-5xl md:text-6xl font-bold mb-4">404</h1>
        <h2 className="text-3xl font-medium mb-6">Page Not Found</h2>
        <p className="text-xl text-muted-foreground max-w-lg mb-8">
          We couldn't find the page you're looking for. It might have been removed, renamed, or is temporarily unavailable.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link to="/">
              Go Home
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to="/groups">
              Browse Groups
            </Link>
          </Button>
        </div>
      </Fade>
    </div>
  );
}
