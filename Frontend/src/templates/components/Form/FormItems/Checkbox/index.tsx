import { Checkbox as CheckBoxAntd } from 'antd';
import { CheckboxGroupProps } from 'antd/lib/checkbox';

import styles from './Checkbox.module.scss';

const Checkbox = (props: CheckboxGroupProps) => {
  return <CheckBoxAntd.Group className={styles.checkbox} {...props} />;
};

export default Checkbox;
