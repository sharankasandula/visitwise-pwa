export interface Visit {
  id: string;
  date: string;
  completed: boolean;
  charge?: number;
  notes?: string;
}

/**
 * Filters completed visits from a list of visits
 */
export const getCompletedVisits = (visits: Visit[]): Visit[] => {
  return visits.filter((visit) => visit.completed);
};

/**
 * Sorts visits by date (oldest first)
 */
export const sortVisitsByDate = (
  visits: Visit[],
  ascending: boolean = true
): Visit[] => {
  return [...visits].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return ascending ? dateA - dateB : dateB - dateA;
  });
};

/**
 * Gets visits for a specific date
 */
export const getVisitsForDate = (visits: Visit[], date: Date): Visit[] => {
  const targetDate = date.toISOString().split("T")[0];
  return visits.filter((visit) => visit.date.startsWith(targetDate));
};

/**
 * Calculates total visits count
 */
export const getTotalVisitsCount = (visits: Visit[]): number => {
  return visits.length;
};

/**
 * Calculates completed visits count
 */
export const getCompletedVisitsCount = (visits: Visit[]): number => {
  return getCompletedVisits(visits).length;
};

/**
 * Calculates pending visits count
 */
export const getPendingVisitsCount = (visits: Visit[]): number => {
  return visits.length - getCompletedVisits(visits).length;
};
