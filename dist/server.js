import fetch from "node-fetch";
import dayjs from "dayjs";
import 'dotenv/config';
import { checkIsDateInCurrentQuarter, getAllWeekendsInaQuarter, } from "./dateUtils.js";
import { askQuestions } from "./utils.js";
const fetchHolidays = async () => {
    try {
        const response = await fetch("https://klenty.keka.com/k/dashboard/api/dashboard/holidays", {
            headers: {
                accept: "application/json, text/plain, */*",
                "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
                authorization: process.env.KEKA_TOKEN,
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
                cookie: "Subdomain=klenty.keka.com; _gcl_au=1.1.954596604.1734000852; hubspotutk=76f6c281bfb6019a29216431b92379e9; __hssrc=1; ai_user=2QIBxnrjZ4Xp2ALCjpsdLR|2024-12-12T10:54:13.702Z; _clck=dhgud0%7C2%7Cfrz%7C0%7C1807; __hstc=118268374.76f6c281bfb6019a29216431b92379e9.1734000851935.1734967736381.1735017745318.5; __hssc=118268374.1.1735017745318; _clsk=u3w9gy%7C1735017746087%7C1%7C0%7Ca.clarity.ms%2Fcollect; ai_session=1zAwYIb99t123xnhoz+yzt|1735017744708|1735017784309",
                Referer: "https://klenty.keka.com/",
                "Referrer-Policy": "strict-origin-when-cross-origin",
            },
            body: null,
            method: "GET",
        });
        const holidaysResponse = await response.json();
        return holidaysResponse.data;
    }
    catch (err) {
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
        // TODO: can optimize this further since holidays is a sorted array can check nextDay at nextIndex
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
    let maxLeaveData = {
        date: holidays[0].date,
        vacationCountWithLeave: holidays[0].numberOfDaysContiuos,
    };
    while (holidayIndex < holidays.length) {
        const holiday = holidays[holidayIndex];
        const updatedholidayObj = {
            date: holiday.date,
            endDate: dayjs(holiday.date).add(holiday.numberOfDaysContiuos - 1, 'day').format('YYYY-MM-DD'),
            numberOfDaysContiuos: holiday.numberOfDaysContiuos,
        };
        let leaveRemaining = numOfDaysToCheck;
        while (true) {
            const nextDay = dayjs(updatedholidayObj.endDate).add(1, 'day');
            const isNextDayHoliday = holidays.findIndex((h) => dayjs(h.date).isSame(nextDay));
            if (isNextDayHoliday > -1) {
                const tobeBridgedDate = holidays[isNextDayHoliday];
                updatedholidayObj.numberOfDaysContiuos +=
                    tobeBridgedDate.numberOfDaysContiuos;
                updatedholidayObj.endDate = nextDay.add(tobeBridgedDate.numberOfDaysContiuos - 1, 'day').format('YYYY-MM-DD');
            }
            else {
                if (leaveRemaining === 0)
                    break;
                leaveRemaining -= 1;
                updatedholidayObj.endDate = nextDay.format('YYYY-MM-DD');
                updatedholidayObj.numberOfDaysContiuos += 1;
            }
        }
        const finalTotalLeave = updatedholidayObj.numberOfDaysContiuos;
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
        const [yearToCheck, quarterToCheck, numOfDaysToCheck] = await askQuestions();
        let holidays = await fetchHolidays();
        const holidayDates = holidays
            .filter((holiday) => checkIsDateInCurrentQuarter(holiday.date, Number(quarterToCheck), yearToCheck))
            .map((data) => data.date);
        const weekends = getAllWeekendsInaQuarter(Number(quarterToCheck), yearToCheck);
        const groupedLeaves = groupHolidaysSequentially(holidayDates.concat(weekends).sort((a, b) => (dayjs(a).isBefore(b) ? -1 : 1)));
        const { bridgedHolidays, maxLeaveData } = bridgeHolidaysWithLeaves(groupedLeaves, numOfDaysToCheck);
        console.timeEnd('Execution Time');
        console.log(bridgedHolidays);
        console.log(maxLeaveData);
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }
};
main();
