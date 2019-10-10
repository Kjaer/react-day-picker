import React from 'react';

import { DayPickerProps } from 'types/props';
import { prepareMonth } from './helpers';

interface Month {
  month: Date;
  dayPickerProps: DayPickerProps;
}

export const Month: React.FC<Month> = props => {
  const { month, dayPickerProps } = props;
  const {
    locale,
    showCaption,
    showHead,
    classNames,
    styles,
    components: { Caption, Head, Week },
  } = dayPickerProps;
  const { weeks } = prepareMonth(month, dayPickerProps);
  return (
    <div className={classNames.month}>
      <table className={classNames.monthTable} style={styles.monthTable}>
        {showCaption && (
          <Caption month={month} dayPickerProps={dayPickerProps} />
        )}
        {showHead && (
          <Head
            locale={locale}
            showWeekNumber={dayPickerProps.showWeekNumber}
            dayPickerProps={dayPickerProps}
          />
        )}
        <tbody className={classNames.monthTbody} style={styles.monthTbody}>
          {Object.keys(weeks).map(weekNumber => (
            <Week
              key={weekNumber}
              week={weeks[weekNumber]}
              weekNumber={weekNumber}
              dayPickerProps={dayPickerProps}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};