import React, { forwardRef, useImperativeHandle, useMemo, useRef, useState } from 'react';
import ReactNativeCalendarStrip from 'react-native-calendar-strip';
import moment from 'moment';

import fonts from '../theme/fonts';
import { LayoutMetrics } from '../theme/commonLayout';
import { DimensionsData } from '../utils/scaling';
import { useTheme } from '../context/themeContext';
import { StyleSheet, ViewStyle } from 'react-native';
import YearMonthPicker from './YearMonthPicker';

const getValidMomentDate = (selectedMonth: string, selectedYear: string): moment.Moment => {
  const currentDay = moment().date();
  const targetMonthIndex = moment().month(selectedMonth).month();

  const tentativeDate = moment()
    .year(parseInt(selectedYear))
    .month(targetMonthIndex)
    .date(currentDay);

  if (tentativeDate.month() !== targetMonthIndex) {
    return moment().year(parseInt(selectedYear)).month(targetMonthIndex).date(1);
  }

  return tentativeDate;
};

export type CalendarStripHandle = {
  getSelectedDate?: () => Date | undefined;
  setSelectedDate?: (date: Date) => void;
};

type Props = {
  onDateSelected?: (date: Date) => void;
  style: ViewStyle;
};

const CalendarStrip = forwardRef<CalendarStripHandle, Props>((props, ref) => {
  const styles = useStyles();
  const calendarRef = useRef<any>(null);
  const [yearMonthPickerVisible, setYearMonthPickerVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(moment());

  useImperativeHandle(ref, () => ({
    getSelectedDate: () => calendarRef.current?.getSelectedDate(),
    setSelectedDate: (date: Date) => {
      calendarRef.current?.setSelectedDate?.(date);
      setSelectedDate(date);
    },
  }));

  return (
    <>
      <ReactNativeCalendarStrip
        key={selectedDate.format('YYYY-MM-DD')}
        ref={calendarRef}
        scrollable={true}
        scrollerPaging={true}
        scrollToOnSetSelectedDate={true}
        upperCaseDays={false}
        iconStyle={styles.iconStyle}
        iconLeftStyle={styles.iconLeftStyle}
        iconRightStyle={styles.iconRightStyle}
        style={[styles.style, props?.style]}
        calendarHeaderStyle={styles.calendarHeaderStyle}
        highlightDateNameStyle={styles.highlightDateNameStyle}
        dateNameStyle={styles.dateNameStyle}
        highlightDateNumberStyle={styles.highlightDateNumberStyle}
        dateNumberStyle={styles.dateNumberStyle}
        selectedDate={selectedDate}
        highlightDateContainerStyle={styles.highlightDateContainerStyle}
        dayContainerStyle={styles.dayContainerStyle}
        dayComponentHeight={55}
        calendarHeaderContainerStyle={styles.calendarHeaderContainerStyle}
        onDateSelected={props?.onDateSelected}
        onHeaderSelected={() => {
          setYearMonthPickerVisible(true);
        }}
      />
      <YearMonthPicker
        visible={yearMonthPickerVisible}
        onClose={() => {
          setYearMonthPickerVisible(false);
        }}
        onSelected={(month: string, year: string) => {
          const result = getValidMomentDate(month, year);
          setSelectedDate(result);
          // setSelectedDate(result.format('YYYY-MM-DD'));
          // setTimeout(() => {
          //   if (calendarRef.current && calendarRef.current.scrollToDate) {
          //     calendarRef.current.scrollToDate(date);
          //   }
          // }, 50);
          // calendarRef.current?.setSelectedDate?.(result.format('YYYY-MM-DD'));
        }}
      />
    </>
  );
});

const useStyles = () => {
  const { colors } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        calendarHeaderContainerStyle: {
          marginBottom: 12,
          marginTop: 24,
        },
        dayContainerStyle: {
          borderRadius: 10,
          width: 42,
        },
        highlightDateContainerStyle: {
          backgroundColor: colors.secondary,
        },
        dateNumberStyle: {
          color: colors.textPrimary,
          fontSize: 16,
          fontFamily: fonts.family.regular,
        },
        highlightDateNumberStyle: {
          color: colors.white,
          fontSize: 16,
          fontFamily: fonts.family.regular,
        },
        dateNameStyle: {
          color: colors.lightGrey,
          fontSize: 14,
          fontFamily: fonts.family.regular,
        },
        highlightDateNameStyle: {
          color: colors.white,
          fontSize: 12,
          fontFamily: fonts.family.black,
        },
        calendarHeaderStyle: {
          fontSize: 14,
          fontFamily: fonts.family.black,
          width: '100%',
        },
        style: {
          height: 130,
          backgroundColor: '#F8F5FF',
          width: DimensionsData.windowWidth,
          left: -LayoutMetrics.padding.horizontal,
          paddingHorizontal: LayoutMetrics.padding.horizontal,
        },
        iconRightStyle: {
          right: 0,
        },
        iconLeftStyle: {
          left: 0,
        },
        iconStyle: {
          position: 'absolute',
          top: -69,
          tintColor: colors.secondary,
          width: 20,
          height: 20,
          resizeMode: 'contain',
        },
      }),
    [colors],
  );
};

export default CalendarStrip;
