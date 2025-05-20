
import { Card } from "@/components/ui/card";
import { Fade } from "react-awesome-reveal";
import CreateGroupForm from "@/components/groups/CreateGroupForm";

export default function CreateGroup() {
  return (
    <div className="container py-10">
      <Fade triggerOnce>
        <h1 className="text-4xl font-bold mb-4">Create a Hobby Group</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Share your passion with others by starting a new hobby group
        </p>
      </Fade>

      <Fade triggerOnce delay={100}>
        <Card className="max-w-3xl mx-auto">
          <CreateGroupForm />
        </Card>
      </Fade>
    </div>
  );
}
