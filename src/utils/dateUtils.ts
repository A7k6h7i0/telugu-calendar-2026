export function getDateMeta(date = new Date()) {
  const start = new Date(date.getFullYear(), 0, 1);
  const diff =
    (date.getTime() - start.getTime()) / 86400000;

  return {
    dayOfYear: Math.floor(diff),
    weekOfYear: Math.floor(diff / 7),
    month: date.getMonth(),
    year: date.getFullYear(),
  };
}
