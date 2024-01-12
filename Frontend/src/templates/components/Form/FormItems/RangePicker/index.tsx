import { DatePicker } from 'antd';
import { RangePickerProps } from 'antd/lib/date-picker';

import styles from './RangePicker.module.scss';

const CommonRangePicker = (props: RangePickerProps) => {
  return <DatePicker.RangePicker className={styles.rangePicker} {...props} />;
};

export default CommonRangePicker;
