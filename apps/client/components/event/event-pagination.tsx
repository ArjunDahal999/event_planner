import { EventFilters } from "./use-filter.hook";

function Pagination({
  page,
  total,
  limit,
  updateFilters,
}: {
  page: number;
  total: number;
  limit: number;
  updateFilters: (
    u: Partial<Record<keyof EventFilters, string | null>>,
  ) => void;
}) {
  const totalPages = Math.ceil(total / limit);
  if (totalPages <= 1) return null;

  return (
    <div className="flex absolute bottom-2 left-1/2 transform -translate-x-1/2 gap-2 mt-6 justify-center">
      <button
        disabled={page <= 1}
        onClick={() => updateFilters({ page: String(page - 1) })}
        className="px-4 py-2 border rounded disabled:opacity-50"
      >
        Previous
      </button>
      <span className="self-center text-sm">
        Page {page} of {totalPages}
      </span>
      <button
        disabled={page >= totalPages}
        onClick={() => updateFilters({ page: String(page + 1) })}
        className="px-4 py-2 border rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;
