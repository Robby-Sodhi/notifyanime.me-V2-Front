export const client_id = "0ed447cbcf7f21fe2572ce266fc0ce26";

export const offsetH = new Date().getTimezoneOffset() / 60;
export const offsetM = new Date().getTimezoneOffset() % 60;

export const getCookieValue = (name) =>
  document.cookie.match("(^|;)\\s*" + name + "\\s*=\\s*([^;]+)")?.pop() || "";

export const deleteCookieValue = (name) =>
  (document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`);
export const setCookieValue = (name, value, maxAge) =>
  (document.cookie = `${name}=${value}; max-age=${maxAge};`);

export const Calendar = {
  monday: 0,
  tuesday: 1,
  wednesday: 2,
  thursday: 3,
  friday: 4,
  saturday: 5,
  sunday: 6,
};
export const CalendarFlipped = {
  0: "monday",
  1: "tuesday",
  2: "wednesday",
  3: "thursday",
  4: "friday",
  5: "saturday",
  6: "sunday",
};
const DateModuleCalendar = {
  0: "sunday",
  1: "monday",
  2: "tuesday",
  3: "wednesday",
  4: "thursday",
  5: "friday",
  6: "saturday",
};
export const getTodaysDate = () => DateModuleCalendar[new Date().getDay()];

export const getTodaysDateNum = () => Calendar[getTodaysDate()];

export const jstDayWeekToLocal = (theDay, time, offsetH, offsetM) => {
  const jst_offset = 9;
  let hours = parseInt(time.slice(0, 2));
  let minutes = parseInt(time.slice(3, 5));
  let dayOfWeek = Calendar[theDay];
  let newHours = (hours - (jst_offset + offsetH)) % 24;
  let newMinutes = (minutes - offsetM) % 60;
  if (hours - (jst_offset + offsetH) < 0) {
    dayOfWeek = dayOfWeek - 1;
    if (dayOfWeek < 0) {
      dayOfWeek = 7 + dayOfWeek;
    }
  }
  if (hours - (jst_offset + offsetH) > 24) {
    dayOfWeek = dayOfWeek + 1;
    if (dayOfWeek > 6) {
      dayOfWeek = dayOfWeek - 7;
    }
  }
  console.log(dayOfWeek);
  return {
    day_of_the_week: CalendarFlipped[dayOfWeek],
    start_time: `${newHours}:${newMinutes}`,
  };
};
