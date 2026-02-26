import { cn } from "@/lib/utils";

export const EventCardSkeleton = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "flex flex-col h-full p-4 animate-pulse space-y-3",
        className,
      )}
    >
      <div className="h-12 flex items-center justify-center">
        <div className="h-5 w-3/4 bg-muted rounded-md" />
      </div>

      <div className="h-16 space-y-2">
        <div className="h-4 w-full bg-muted rounded-md" />
        <div className="h-4 w-5/6 bg-muted rounded-md" />
      </div>

      <div className="h-6 flex items-center">
        <div className="h-4 w-1/2 bg-muted rounded-md" />
      </div>

      <div className="h-6 flex items-center">
        <div className="h-4 w-2/3 bg-muted rounded-md" />
      </div>

      <div className="h-2 flex items-center">
        <div className="h-4 w-24 bg-muted rounded-md" />
      </div>

      <div className="h-2 flex items-center">
        <div className="h-4 w-1/3 bg-muted rounded-md" />
      </div>

      <div className="h-8 flex flex-wrap gap-2 content-start">
        <div className="h-6 w-16 bg-muted rounded-md" />
        <div className="h-6 w-20 bg-muted rounded-md" />
        <div className="h-6 w-14 bg-muted rounded-md" />
      </div>
    </div>
  );
};
