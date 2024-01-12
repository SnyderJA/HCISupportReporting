import { Radio } from 'antd';
import { RadioGroupProps } from 'antd/lib/radio';

import styles from './Radio.module.scss';

interface CommonRadioGroupProps extends RadioGroupProps {
  data: Array<{
    value: string;
    label: string;
  }>;
}

const CommonRadio = ({ data, ...props }: CommonRadioGroupProps) => {
  return (
    <Radio.Group {...props} className={styles.radio}>
      {data.map((item) => (
        <Radio key={item.value} value={item.value}>
          {item.label}
        </Radio>
      ))}
    </Radio.Group>
  );
};

export default CommonRadio;
