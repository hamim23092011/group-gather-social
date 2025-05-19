
import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary text-primary-foreground font-bold">
                H
              </div>
              <span className="text-xl font-bold">HobbyHub</span>
            </div>
            <p className="mt-4 text-muted-foreground">
              Connect with local enthusiasts and explore new hobbies together. 
              Join existing groups or create your own community around shared passions.
            </p>
          </div>
          
          <div className="col-span-1">
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/groups" className="text-muted-foreground hover:text-primary transition-colors">
                  All Groups
                </Link>
              </li>
              <li>
                <Link to="/create-group" className="text-muted-foreground hover:text-primary transition-colors">
                  Create Group
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="font-semibold text-lg mb-4">Popular Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/groups?category=Photography" className="text-muted-foreground hover:text-primary transition-colors">
                  Photography
                </Link>
              </li>
              <li>
                <Link to="/groups?category=Reading" className="text-muted-foreground hover:text-primary transition-colors">
                  Reading
                </Link>
              </li>
              <li>
                <Link to="/groups?category=Hiking" className="text-muted-foreground hover:text-primary transition-colors">
                  Hiking
                </Link>
              </li>
              <li>
                <Link to="/groups?category=Cooking" className="text-muted-foreground hover:text-primary transition-colors">
                  Cooking
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t pt-8 mt-8 text-center text-muted-foreground">
          <p>&copy; {currentYear} HobbyHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
