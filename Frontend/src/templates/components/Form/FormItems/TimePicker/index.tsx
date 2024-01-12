import { TimePicker } from 'antd';
import { TimePickerProps } from 'antd/lib/time-picker';

import styles from './TimePicker.module.scss';

const CommonTimePicker = (props: TimePickerProps) => {
  return <TimePicker className={styles.timePicker} {...props} />;
};

export default CommonTimePicker;
