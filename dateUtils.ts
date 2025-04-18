import dayjs from "dayjs";

const getQuarter = (date?: string) => {
  return Math.ceil(dayjs(date).month() / 3);
};

export const checkIsDateInCurrentQuarter = (date: string | undefined, quarter: number, year: number) => {
  const currentQuarter = quarter ?? getQuarter();
  const quarterDate = getQuarter(date);
  const isSameYear = (year ? year : dayjs().year()) === dayjs(date).year();
  return currentQuarter === quarterDate && isSameYear;
};

export const getAllWeekendsInaQuarter = (quarter = 4, year = 2024) => {
  let startDate, endDate;
  switch (quarter) {
    case 0:
      startDate = dayjs(`${year}-01-01`);
      endDate = dayjs(`${year}-03-31`);
      break;
    case 1:
      startDate = dayjs(`${year}-04-01`);
      endDate = dayjs(`${year}-06-30`);
      break;
    case 2:
      startDate = dayjs(`${year}-07-01`);
      endDate = dayjs(`${year}-09-30`);
      break;
    case 3:
      startDate = dayjs(`${year}-10-01`);
      endDate = dayjs(`${year}-12-31`);
      break;

    default:
      throw new Error("Invalid quarter number. Please use 1, 2, 3, or 4.");
  }

  const weekends = [];
  let currentDate = startDate;

  while (currentDate.isBefore(endDate) || currentDate.isSame(endDate)) {
    if ([0, 6].includes(currentDate.day())) {
      weekends.push(currentDate.format("YYYY-MM-DD"));
    }
    currentDate = currentDate.add(1, "day");
  }

  return weekends;
};
