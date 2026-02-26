import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

export interface EventFilters {
  tags?: string;
  location?: string;
  page?: number;
  limit?: number;
  eventType?: string;
  title?: string;
  description?: string;
  sortOrder?: string;
  sortBy?: string;
  eventTimeLine?: string;
}

export function useEventFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const filters: EventFilters = {
    tags: searchParams.get("tags") ?? undefined,
    page: Number(searchParams.get("page")) || 1,
    limit: Number(searchParams.get("limit")) || 6,
    eventType: searchParams.get("eventType") ?? undefined,
    title: searchParams.get("title") ?? undefined,
    description: searchParams.get("description") ?? undefined,
    location: searchParams.get("location") ?? undefined,
    sortOrder: searchParams.get("sortOrder") ?? undefined,
    sortBy: searchParams.get("sortBy") ?? undefined,
    eventTimeLine: searchParams.get("eventTimeLine") ?? undefined,
  };

  const resetFilters = () => {
    startTransition(() => {
      router.push(pathname);
    });
  };

  const updateFilters = (
    updates: Partial<Record<keyof EventFilters, string | null>>,
  ) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (!value) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    // when u are in page 2 and u change filter , then it will show page 2 result , but there might be fewer data which is all in page 1
    if (!("page" in updates)) {
      params.delete("page");
    }

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  return { filters, updateFilters, isPending, resetFilters };
}
