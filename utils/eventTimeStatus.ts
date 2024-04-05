export function isToday(date: Date): boolean {
  const today = new Date();

  if (today.toDateString() === date.toDateString()) {
    return true;
  }

  return false;
}
export function isYesterday(date: Date): boolean {
  const today = new Date();
  const yesterday = new Date(today.setDate(today.getDate() - 1));

  if (yesterday.toDateString() === date.toDateString()) {
    return true;
  }

  return false;
}
