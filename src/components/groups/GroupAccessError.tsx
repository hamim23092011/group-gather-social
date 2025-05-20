
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";

interface GroupAccessErrorProps {
  message: string;
}

export default function GroupAccessError({ message }: GroupAccessErrorProps) {
  const navigate = useNavigate();
  
  return (
    <div className="container py-10">
      <Alert variant="destructive">
        <AlertTitle>Access Denied</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
      <Button
        className="mt-4"
        onClick={() => navigate("/my-groups")}
      >
        Back to My Groups
      </Button>
    </div>
  );
}
