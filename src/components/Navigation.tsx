import * as React from 'react';

import { prepareNavigation } from './helpers';
import { DayPickerProps } from '../types/DayPickerProps';

interface Navigation {
  dayPickerProps: DayPickerProps;
}

export const Navigation: React.FC<Navigation> = props => {
  const { dayPickerProps } = props;
  const {
    onMonthChange,
    onPrevClick,
    onNextClick,
    onStartClick,
    startDay,
  } = dayPickerProps;

  const {
    containerProps,
    nextProps,
    nextMonth,
    prevProps,
    prevMonth,
    startProps,
  } = prepareNavigation(dayPickerProps);

  const handlePrevClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    onMonthChange && onMonthChange(prevMonth, e);
    onPrevClick && onPrevClick(prevMonth, e);
  };
  const handleNextClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    onMonthChange && onMonthChange(nextMonth, e);
    onNextClick && onNextClick(nextMonth, e);
  };
  const handleStartClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    onMonthChange && onMonthChange(startDay, e);
    onStartClick && onStartClick(startDay, e);
  };

  if (!dayPickerProps.onMonthChange) {
    return null;
  }

  const { startLabel, prevLabel, nextLabel } = dayPickerProps;

  const prevButton = prevLabel && (
    <button
      {...prevProps}
      key="prev"
      disabled={!prevMonth}
      type="button"
      onClick={handlePrevClick}
    >
      {prevLabel}
    </button>
  );

  const startButton = startLabel && (
    <button
      {...startProps}
      key="start"
      type="button"
      onClick={handleStartClick}
    >
      {startLabel}
    </button>
  );

  const nextButton = nextLabel && (
    <button
      {...nextProps}
      key={'next'}
      disabled={!nextMonth}
      type="button"
      onClick={handleNextClick}
    >
      {nextLabel}
    </button>
  );
  let buttons = [prevButton, startButton, nextButton];
  if (dayPickerProps.dir === 'rtl') {
    buttons = buttons.reverse();
  }
  return <div {...containerProps}>{buttons}</div>;
};
