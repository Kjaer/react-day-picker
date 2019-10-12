import { MatchingModifiers, ModifierValueType } from '../../types/Modifiers';
import { DayPickerProps } from '../../types/DayPicker';

interface PreparedDay {
  Container: 'button' | 'span';
  containerProps: {
    'aria-disabled'?: boolean;
    disabled?: boolean;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    className?: string;
    style?: React.CSSProperties;
  };
  wrapperProps: {
    className?: string;
    style?: React.CSSProperties;
  };
}

export function prepareDay(
  day: Date,
  modifiers: MatchingModifiers,
  props: DayPickerProps
): PreparedDay {
  const {
    onDayClick,
    styles,
    modifiersStyles,
    classNames,
    modifiersClassNames,
  } = props;
  const Container = modifiers.interactive ? 'button' : 'span';

  let onClick;
  if (modifiers.interactive && onDayClick) {
    onClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
      e.stopPropagation();
      e.preventDefault();
      onDayClick(day, modifiers, e);
    };
  }

  let style = { ...styles.day };
  if (modifiersStyles || styles) {
    Object.keys(modifiers).forEach(modifier => {
      style = {
        ...style,
        ...modifiersStyles[modifier],
        ...styles[modifier],
      };
    });
  }

  const className = [classNames.day] || [];
  if (modifiersClassNames || classNames) {
    Object.keys(modifiers)
      .filter(modifier => Boolean(modifiers[modifier]))
      .forEach(modifier => {
        if (classNames[modifier]) {
          className.push(classNames[modifier]);
        }
        if (modifiersClassNames[modifier]) {
          className.push(modifiersClassNames[modifier]);
        }
      });
  }

  const dataProps: { [key: string]: ModifierValueType } = {};
  Object.entries(modifiers)
    .filter(value => Boolean(value))
    .forEach(([modifier, value]) => {
      dataProps[`data-rdp-${modifier}`] = value;
    });

  const containerProps = {
    'aria-disabled': !modifiers.interactive || undefined,
    disabled: modifiers.disabled || undefined,
    onClick,
    style,
    className: className.join(' '),
    ...dataProps,
  };
  const wrapperProps = {
    className: classNames.dayWrapper,
    styles: styles.dayWrapper,
  };

  return { Container, containerProps, wrapperProps };
}
