
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const { currentUser, logOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  return (
    <header className="bg-background border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary text-primary-foreground font-bold">H</div>
            <span className="text-xl font-bold">HobbyHub</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/groups" className="text-foreground hover:text-primary transition-colors">
              All Groups
            </Link>
            {currentUser && (
              <>
                <Link to="/create-group" className="text-foreground hover:text-primary transition-colors">
                  Create Group
                </Link>
                <Link to="/my-groups" className="text-foreground hover:text-primary transition-colors">
                  My Groups
                </Link>
              </>
            )}
          </nav>

          {/* User Menu & Theme Toggle */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-9 w-9 rounded-full"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            {currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={currentUser.photoURL || ""} />
                      <AvatarFallback>{getInitials(currentUser.displayName || "User")}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="flex items-center justify-start p-2 mb-1">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{currentUser.displayName}</p>
                      <p className="text-sm text-muted-foreground">{currentUser.email}</p>
                    </div>
                  </div>
                  <DropdownMenuItem onClick={() => logOut()}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild>
                <Link to="/login">Login</Link>
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t animate-fade-in">
          <div className="container mx-auto px-2 pt-2 pb-3 space-y-1 flex flex-col">
            <Link 
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-muted"
            >
              Home
            </Link>
            <Link
              to="/groups"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-muted"
            >
              All Groups
            </Link>
            {currentUser && (
              <>
                <Link
                  to="/create-group"
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-muted"
                >
                  Create Group
                </Link>
                <Link
                  to="/my-groups"
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-muted"
                >
                  My Groups
                </Link>
              </>
            )}

            <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center px-3 justify-between">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                  className="h-9 w-9 rounded-full"
                >
                  {theme === "dark" ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </Button>
                
                {currentUser ? (
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <Avatar>
                        <AvatarImage src={currentUser.photoURL || ""} />
                        <AvatarFallback>{getInitials(currentUser.displayName || "User")}</AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex flex-col">
                      <div className="text-base font-medium leading-none">
                        {currentUser.displayName}
                      </div>
                      <div className="text-sm font-medium leading-none text-muted-foreground">
                        {currentUser.email}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Button asChild>
                    <Link to="/login">Login</Link>
                  </Button>
                )}
              </div>
              {currentUser && (
                <div className="mt-3 px-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-center" 
                    onClick={() => logOut()}
                  >
                    Log out
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
