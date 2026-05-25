

type DueDate = {
    date: string;
    status: "past" | "today" | "near" | "upcoming";
}
export const dateCalculator = (date:string): DueDate => {
  if(!date) return {date: "-", status: "upcoming"};
  const targetDate = new Date(date.replace(/-/g, '\/'));
  targetDate.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

   // Calculate the difference in days
  const msPerDay = 24 * 60 * 60 * 1000;
  const diffInDays = Math.round((targetDate.getTime() - today.getTime()) / msPerDay);



 // Case 1: More than 10 days out -> "Tue Jan 6 2027"
  if (diffInDays > 10) {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    };
    // Replaces commas to match your exact format: "Tue Jan 6 2027"
    return {date: targetDate.toLocaleDateString('en-US', options).replace(/,/g, ''), status: "upcoming"};
  }

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
    if (!date) return "-";
    return new Date(date.replace(/-/g, '\/')).toDateString();
}