const DAY_IN_MS = 24 * 60 * 60 * 1000;

export const startOfDay = (date: Date): Date =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

export const formatDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");

  return `${day}.${month}.${date.getFullYear()}`;
};

export const getDaysDiff = (date: Date): number => {
  return Math.round((startOfDay(date).getTime() - startOfDay(new Date()).getTime()) / DAY_IN_MS);
};

export const formatDateLabel = (date: string): string => {
  const parsed = new Date(date);
  const daysDiff = getDaysDiff(parsed);

  if (daysDiff === 0) {
    return "Aujourd'hui";
  }

  if (daysDiff === -1) {
    return "Hier";
  }

  if (daysDiff === 1) {
    return "Demain";
  }

  return formatDate(parsed);
};

export const isLate = (scheduledFor: string): boolean => {
  return getDaysDiff(new Date(scheduledFor)) < 0;
};
