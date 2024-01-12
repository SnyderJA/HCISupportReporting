import { DatePicker } from 'antd';
import { DatePickerProps } from 'antd/lib/date-picker';

import styles from './DatePicker.module.scss';

const CommonDatePicker = (props: DatePickerProps) => {
  return (
    <DatePicker
      className={styles.datePicker}
      dropdownClassName={styles.datePickerDropdown}
      {...props}
    />
  );
};

export default CommonDatePicker;
