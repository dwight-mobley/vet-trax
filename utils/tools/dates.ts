

type DueDate = {
    date: string;
    status: "past" | "today" | "near" | "upcoming";
}

export const parseDbDate = (date?: string): Date | null => {
  if (!date) return null;

  const parsed = new Date(date.replace(/-/g, "/"));
  if (Number.isNaN(parsed.getTime())) return null;

  return parsed;
};

export const dateCalculator = (date:string): DueDate => {
  if(!date) return {date: "-", status: "upcoming"};
  const targetDate = parseDbDate(date);
  if (!targetDate) return {date: "-", status: "upcoming"};

  targetDate.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

   // Calculate the difference in days
  const msPerDay = 24 * 60 * 60 * 1000;
  const diffInDays = Math.round((targetDate.getTime() - today.getTime()) / msPerDay);

  // Case 2: Today
  if (diffInDays === 0) {
    return {date: "Due today", status: "today"};
  }

  // Case 3: Less than or equal to 10 days out (Future) -> "9 days"
  if (diffInDays > 0) {
    return {date: `Due in ${diffInDays} day${diffInDays > 1 ? 's' : ''}`, status: "near"};
  }

  // Case 4: Past due -> "Past Due 1 day"
  const pastDays = Math.abs(diffInDays);
  return {date: `Past Due ${pastDays} day${pastDays > 1 ? 's' : ''}`, status: "past"};
};

export const dateFormatter = (date?: string): string => {
  const parsed = parseDbDate(date);
  if (!parsed) return "-";
  return parsed.toDateString();
}

export function parseDateKeyAsLocalDate(dateKey: string) {
  const [yearStr, monthStr, dayStr] = dateKey.split("-");
  const year = Number(yearStr);
  const month = Number(monthStr);
  const day = Number(dayStr);

  return new Date(year, month - 1, day);
}