const getDayDelay = (date1: Date, date2: Date = new Date()): number => {
  return Math.round((date2.getTime() - date1.getTime()) / (1000 * 3600 * 24));
};

export default getDayDelay;
