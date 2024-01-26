export function slugify(string: string) {
  return string.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

export function emptyPage() {
  return {
    page: [],
    isDone: false,
    continueCursor: "",
    // This is a little hack around usePaginatedQuery,
    // which will lead to permanent loading state,
    // until a different result is returned
    pageStatus: "SplitRequired" as const,
  };
}

export function normalizeStringForSearch(string: string) {
  return string.normalize("NFKD").replace(/[\u0300-\u036F]/g, "");
}
