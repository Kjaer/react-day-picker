import {
  addDays,
  addWeeks,
  differenceInDays,
  endOfMonth,
  getMonth,
  getWeek,
  getWeeksInMonth,
  startOfMonth,
} from 'date-fns';

import { DateWithModifiers } from '../../classes';
import { getOutsideStartDays } from '../utils/getOutsideStartDays';
import { getOutsideEndDays } from '../utils/getOutsideEndDays';
import { DayPickerProps } from '../../types/DayPickerProps';

type PreparedMonthWeek = Array<DateWithModifiers>;
type PreparedMonthWeeks = { [key: string]: PreparedMonthWeek };
type PreparedMonth = {
  weeks: PreparedMonthWeeks;
};
/**
 * Return the data for the Month component.
 */
export function prepareMonth(
  month: Date,
  props: DayPickerProps
): PreparedMonth {
  const { locale, fixedWeeks } = props;
  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);

  const diff = differenceInDays(monthEnd, monthStart);

  const weeks: PreparedMonthWeeks = {};
  let lastWeekStr = '';
  for (let i = 0; i <= diff; i++) {
    const date = addDays(monthStart, i);
    const dateWithModifiers = new DateWithModifiers(date, {}, props);
    let week = getWeek(dateWithModifiers.date, { locale });
    if (week === 1 && getMonth(date) === 11) {
      week = 53;
    }
    const weekStr: string = week.toString();

    if (!weeks[weekStr]) {
      const startDays = getOutsideStartDays(dateWithModifiers, props);
      // Create a new week by adding outside start days
      weeks[weekStr] = startDays;
    }
    weeks[weekStr].push(dateWithModifiers);
    lastWeekStr = weekStr;
  }

  let lastWeek = weeks[lastWeekStr];
  const lastDay = lastWeek[lastWeek.length - 1];
  const endDays = getOutsideEndDays(lastDay, props);
  weeks[lastWeekStr] = lastWeek.concat(endDays);

  // add extra weeks to the month, up to 6 weeks
  if (fixedWeeks) {
    lastWeek = weeks[lastWeekStr];
    const lastWeekDate = lastWeek[lastWeek.length - 1].date;
    const weeksInMonth = getWeeksInMonth(month, { locale });
    if (weeksInMonth < 6) {
      const diff = differenceInDays(
        addWeeks(lastWeekDate, 6 - weeksInMonth),
        lastWeekDate
      );
      for (let i = 0; i < diff; i++) {
        const date = addDays(lastWeekDate, i + 1);
        const dateWithModifiers = new DateWithModifiers(
          date,
          { outside: 'end' },
          props
        );
        let week = getWeek(date, { locale });
        if (week === 1 && getMonth(month) === 11) {
          week = 53;
        }
        if (!weeks[week]) {
          weeks[week] = [];
        }
        weeks[week.toString()].push(dateWithModifiers);
      }
    }
  }

  return { weeks };
}
