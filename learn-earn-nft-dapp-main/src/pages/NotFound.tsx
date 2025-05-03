
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { BookX } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-md">
        <div className="inline-flex items-center justify-center bg-red-100 p-3 rounded-full mb-4">
          <BookX className="h-10 w-10 text-red-500" />
        </div>
        <h1 className="text-4xl font-heading font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-6">
          Oops! We couldn't find that page.
        </p>
        <Button 
          asChild
          className="bg-study-blue hover:bg-study-blue-dark"
        >
          <a href="/">Return to Dashboard</a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
