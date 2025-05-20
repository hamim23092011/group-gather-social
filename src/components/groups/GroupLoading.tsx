
import { Spinner } from "@/components/ui/custom/Spinner";

export default function GroupLoading() {
  return (
    <div className="container py-10">
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    </div>
  );
}
