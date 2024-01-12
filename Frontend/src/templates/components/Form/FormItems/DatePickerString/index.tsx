import { DatePicker } from 'antd';
import moment, { Moment } from 'moment';
import { useEffect, useState } from 'react';

import {
  DATE_SHOW_UI,
  dateToStringParamReq,
  stringParamReqToDate,
} from '@/templates/utils/format.util';

import styles from './DatePickerString.module.scss';
import { PickerPanelDateProps } from 'antd/lib/calendar/generateCalendar';
import { PickerDateProps } from 'antd/lib/date-picker/generatePicker';

type DatePickerStringProps = {
  onChange?: (value: string) => void;
  value?: string;
  reqFormat?: string;
} & PickerPanelDateProps<Moment> &
  PickerDateProps<Moment>;

const DatePickerString = ({ onChange, reqFormat, ...props }: DatePickerStringProps) => {
  const [value, setValue] = useState<moment.Moment | null | undefined>(
    stringParamReqToDate(props.value, reqFormat)
  );

  useEffect(() => {
    setValue(stringParamReqToDate(props.value, reqFormat));
  }, [props.value]);

  const handleChange = (date: moment.Moment | null): void => {
    onChange && onChange(dateToStringParamReq(date, reqFormat));
  };

  const { format, showTime } = props;
  return (
    <DatePicker
      className={styles.datePickerString}
      format={format || DATE_SHOW_UI}
      value={value}
      onChange={handleChange}
      picker="date"
      showTime={showTime}
    />
  );
};

export default DatePickerString;
