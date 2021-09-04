import {
  Calendar,
  getTodaysDate,
  getTodaysDateNum,
  CalendarFlipped,
  jstDayWeekToOffset,
  offsetH,
  offsetM,
} from "./Utility";

const unkownObject = {
  broadcast: { start_time: null, day_of_the_week: null },
  main_picture: { medium: null, large: null },
};
export const processWatchList = (watchList) => {
  let watching = [];
  let completed = [];
  let planToWatch = [];
  let currentlyAiring = [];
  watchList = watchList["data"];
  watchList.forEach((element) => {
    if (
      "my_list_status" in element["node"] &&
      "status" in element["node"]["my_list_status"] &&
      "status" in element["node"]
    ) {
      if (element["node"]["my_list_status"]["status"] === "watching") {
        watching.push(element);
        if (element["node"]["status"] === "currently_airing") {
          currentlyAiring.push(element);
          if (
            "broadcast" in element["node"] &&
            "start_time" in element["node"]["broadcast"]
          ) {
            element["node"]["broadcast"] = jstDayWeekToOffset(
              element["node"]["broadcast"]["day_of_the_week"],
              element["node"]["broadcast"]["start_time"],
              offsetH,
              offsetM
            );
          } else {
            element["node"]["broadcast"] = unkownObject["broadcast"];
          }
          if (
            !"main_picture" in element["node"] ||
            !"medium" in element["node"]["main_picture"]
          ) {
            element["node"]["main_picture"] = unkownObject["main_picture"];
          }
        }
      } else if (element["node"]["my_list_status"]["status"] === "completed") {
        completed.push(element);
      } else if (
        element["node"]["my_list_status"]["status"] === "plan_to_watch"
      ) {
        planToWatch.push(element);
      }
    }
  });
  let todayCalendar = { ...Calendar };
  todayCalendar[getTodaysDate()] = -1;
  let index = getTodaysDateNum() + 1;
  let count = 1;
  for (;;) {
    if (index > 6) {
      index = 0;
    }
    if (todayCalendar[CalendarFlipped[index]] === -1) {
      todayCalendar[CalendarFlipped[index]] = 0;
      break;
    }
    todayCalendar[CalendarFlipped[index]] = count;
    index++;
    count++;
  }
  currentlyAiring.sort((first, second) => {
    if (
      first["node"]["broadcast"]["day_of_the_week"] === null ||
      first["node"]["broadcast"]["start_time"] === null
    ) {
      return 1;
    } else if (
      second["node"]["broadcast"]["day_of_the_week"] === null ||
      second["node"]["broadcast"]["start_time"] === null
    ) {
      return -1;
    } else if (
      todayCalendar[first["node"]["broadcast"]["day_of_the_week"]] <
      todayCalendar[second["node"]["broadcast"]["day_of_the_week"]]
    ) {
      return -1;
    } else {
      return 1;
    }
  });
  return { currentlyAiring, watching, completed, planToWatch };
};
