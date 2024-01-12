import {
  dateToStringParamReq,
  DATE_SHOW_UI,
  stringParamReqToDate,
} from '@/templates/utils/format.util';
import { DatePicker } from 'antd';
import { RangePickerProps } from 'antd/lib/date-picker';
import moment from 'moment';
import { useEffect, useState } from 'react';
import styles from './RangePickerString.module.scss';
type Props = {
  reqFormat?: string;
  value?: string[];
} & RangePickerProps;
const RangePickerString = ({ onChange, reqFormat, ...props }: Props) => {
  const start = props.value ? props.value[0] : '';
  const end = props.value ? props.value[1] : '';
  const dateToString = (value: any) => {
    if (!value) {
      return null;
    }
    return dateToStringParamReq(value, reqFormat);
  };
  const [value, setValue] = useState<[moment.Moment | null, moment.Moment | null]>([
    stringParamReqToDate(start, reqFormat) ?? null,
    stringParamReqToDate(end, reqFormat) ?? null,
  ]);

  useEffect(() => {
    setValue([
      stringParamReqToDate(start, reqFormat) ?? null,
      stringParamReqToDate(end, reqFormat) ?? null,
    ]);
  }, [props.value]);

  const handleChange = (values: any, formatString: [string, string]): void => {
    const start = values ? values[0] : '';
    const end = values ? values[1] : '';
    onChange &&
      onChange(
        values
          ? ([
              dateToStringParamReq(start, reqFormat) ?? null,
              dateToStringParamReq(end, reqFormat) ?? null,
            ] as any)
          : null,
        formatString
      );
  };
  const { format } = props;
  return (
    <DatePicker.RangePicker
      className={styles.rangePicker}
      {...props}
      onChange={handleChange}
      value={value}
      format={format || DATE_SHOW_UI}
    />
  );
};

export default RangePickerString;
