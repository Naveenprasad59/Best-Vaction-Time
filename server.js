import fetch from "node-fetch";
import dayjs from "dayjs";

import {
  checkIsDateInCurrentQuarter,
  getAllWeekendsInaQuarter,
} from "./dateUtils.js";

const fetchHolidays = async () => {
  try {
    let holidays = await fetch(
      "https://klenty.keka.com/k/dashboard/api/dashboard/holidays",
      {
        headers: {
          accept: "application/json, text/plain, */*",
          "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
          authorization:
            "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjFBRjQzNjk5RUE0NDlDNkNCRUU3NDZFMjhDODM5NUIyMEE0MUNFMTgiLCJ4NXQiOiJHdlEybWVwRW5HeS01MGJpaklPVnNncEJ6aGciLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FwcC5rZWthLmNvbSIsIm5iZiI6MTczNTEyODg1NCwiaWF0IjoxNzM1MTI4ODU0LCJleHAiOjE3MzUyMTUyNTQsImF1ZCI6WyJrZWthaHIuYXBpIiwiaGlyby5hcGkiLCJodHRwczovL2FwcC5rZWthLmNvbS9yZXNvdXJjZXMiXSwic2NvcGUiOlsib3BlbmlkIiwia2VrYWhyLmFwaSIsImhpcm8uYXBpIiwib2ZmbGluZV9hY2Nlc3MiXSwiYW1yIjpbImV4dGVybmFsIl0sImNsaWVudF9pZCI6Ijk4N2NjOTcxLWZjMjItNDQ1NC05OWY5LTE2YzA3OGZhN2ZmNiIsInN1YiI6IjU0NTJlZjZjLTJkYjgtNGZlZi05OTFkLTJkZWI3NjdjYTQ5NSIsImF1dGhfdGltZSI6MTcyMTg4NzQxNCwiaWRwIjoiR29vZ2xlIiwidGVuYW50X2lkIjoiYjQ1NWY3MDgtYjdkMC00MmNlLWIzZjctNWMzYTQyYjFlYmIxIiwidGVuYW50aWQiOiJiNDU1ZjcwOC1iN2QwLTQyY2UtYjNmNy01YzNhNDJiMWViYjEiLCJzdWJkb21haW4iOiJrbGVudHkua2VrYS5jb20iLCJ1c2VyX2lkIjoiNzM2MTFmNmYtODMwOC00MDE5LThhMmUtMTVmZDczZDhlOGU2IiwidXNlcl9pZGVudGlmaWVyIjoiNzM2MTFmNmYtODMwOC00MDE5LThhMmUtMTVmZDczZDhlOGU2IiwidXNlcm5hbWUiOiJuYXZlZW5wcmFzYWRAa2xlbnR5LmNvbSIsImVtYWlsIjoibmF2ZWVucHJhc2FkQGtsZW50eS5jb20iLCJhdXRoZW50aWNhdGlvbl90eXBlIjoiMyIsInNpZCI6IjIxODI4NEIyOTM3NTE2QkYzOUY0NDI0MzlEMTlBODM3IiwianRpIjoiMDRBMEEwQ0VDRUZDM0MxMTY1N0FFQjA0RjU4QjY0NjAifQ.ZiZR2eAtiB1sK2BQEg5IDKT60Yy_BxBhTFnxCAgL5qUnGkcaFsyL1TqFlvyNSY-enicD4ENa7jDja9pwMyniPUPVAfNyho5YIdt2irhIkk3ZtEiLTcNHf6TQiQWpF4GyQVLCy6yhG4uDBsKEsmYp3A4TuMsTKRu8_gGbsuViCV8GKMv-W2kI7rCIVNGKG0W-6qf4aWdd1uqCJFPctVtizQS9OldwjCKly2cWmQffkXvUFGSppQMNcUEdvmEHVVQAnpN3Rp4-SelrtZDHAczWtCrZpYddJktrQFmNg7utlAMWvASDXOH7gM8q6kYa-jXD9ZWjTAOavaKdpLluwK5XUQ",
          "cache-control": "no-cache",
          "content-type": "application/json; charset=utf-8",
          pragma: "no-cache",
          priority: "u=1, i",
          "sec-ch-ua": '"Chromium";v="131", "Not_A Brand";v="24"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"macOS"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "x-requested-with": "XMLHttpRequest",
          cookie:
            "Subdomain=klenty.keka.com; _gcl_au=1.1.954596604.1734000852; hubspotutk=76f6c281bfb6019a29216431b92379e9; __hssrc=1; ai_user=2QIBxnrjZ4Xp2ALCjpsdLR|2024-12-12T10:54:13.702Z; _clck=dhgud0%7C2%7Cfrz%7C0%7C1807; __hstc=118268374.76f6c281bfb6019a29216431b92379e9.1734000851935.1734967736381.1735017745318.5; __hssc=118268374.1.1735017745318; _clsk=u3w9gy%7C1735017746087%7C1%7C0%7Ca.clarity.ms%2Fcollect; ai_session=1zAwYIb99t123xnhoz+yzt|1735017744708|1735017784309",
          Referer: "https://klenty.keka.com/",
          "Referrer-Policy": "strict-origin-when-cross-origin",
        },
        body: null,
        method: "GET",
      }
    );

    holidays = await holidays.json();
    return holidays.data;
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};

const groupHolidaysSequentially = (holidays) => {
  const updatedHolidays = [];
  const holidaysSet = new Set([...holidays]);

  let holidayIndex = 0;

  while (holidayIndex < holidays.length) {
    const holiday = holidays[holidayIndex];
    let numberOfDaysContiuos = 1;

    let nextDay = dayjs(holiday).add(1, "day").format("YYYY-MM-DD");
    while (holidaysSet.has(nextDay)) {
      numberOfDaysContiuos++;
      nextDay = dayjs(nextDay).add(1, "day").format("YYYY-MM-DD");
    }

    const obj = {
      date: holiday,
      numberOfDaysContiuos,
    };
    updatedHolidays.push(obj);
    holidayIndex += numberOfDaysContiuos;
  }

  return updatedHolidays;
};

const bridgeHolidaysWithLeaves = (holidays, numOfDaysToCheck) => {
  const bridgedHolidays = [];
  let holidayIndex = 0;

  let maxLeaveData =  {
    date: holidays[0].date,
    vacationCountWithLeave: holidays[0].numberOfDaysContiuos,
  };

  while (holidayIndex < holidays.length) {
    const holiday = holidays[holidayIndex];
    const updatedholidayObj = {
      date: holiday.date,
      numberOfDaysContiuos: holiday.numberOfDaysContiuos,
    };

    let leaveTaken = 1;

    while (leaveTaken <= numOfDaysToCheck) {
      const dateWithLeavesAppliedHere = dayjs(holiday.date).add(
        holiday.numberOfDaysContiuos + leaveTaken
      );

      const foundIndex = holidays.findIndex((h) =>
        dayjs(h.date).isSame(dateWithLeavesAppliedHere)
      );

      if (foundIndex > -1) {
        const tobeBridgedDate = holidays[foundIndex];
        updatedholidayObj.numberOfDaysContiuos +=
          tobeBridgedDate.numberOfDaysContiuos;
      } else {
        leaveTaken += 1;
      }
    }

    const finalTotalLeave =
      updatedholidayObj.numberOfDaysContiuos + numOfDaysToCheck;

    if (maxLeaveData.vacationCountWithLeave < finalTotalLeave) {
      maxLeaveData = {
        date: updatedholidayObj.date,
        vacationCountWithLeave: finalTotalLeave,
      };
    }

    bridgedHolidays.push({
      date: updatedholidayObj.date,
      vacationCountWithLeave: finalTotalLeave,
    });
    holidayIndex += 1;
  }

  return { bridgedHolidays, maxLeaveData };
};

const main = async () => {
  try {
    console.time('Execution Time');
    const numOfDaysToCheck = 3;
    const yearToCheck = 2025;
    const quarterToCheck = 1;
    let holidays = await fetchHolidays();
    holidays = holidays
      .filter((holiday) => checkIsDateInCurrentQuarter(holiday.date, quarterToCheck, yearToCheck))
      .map((data) => data.date);
    const weekends = getAllWeekendsInaQuarter(quarterToCheck, yearToCheck);
    const holidayDates = [...holidays];
    holidays = groupHolidaysSequentially(
      holidays.concat(weekends).sort((a, b) => (dayjs(a).isBefore(b) ? -1 : 1))
    );
    const { bridgedHolidays, maxLeaveData } = bridgeHolidaysWithLeaves(
      holidays,
      numOfDaysToCheck,
      holidayDates
    );
    console.timeEnd('Execution Time');
    console.log(bridgedHolidays);
    console.log(maxLeaveData);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

main();
