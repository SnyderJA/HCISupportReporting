import { Switch } from 'antd';
import { SwitchProps } from 'antd/lib/switch';

import styles from './Switch.module.scss';

const CommonSwitch = (props: SwitchProps) => {
  return <Switch className={styles.switch} {...props} />;
};

export default CommonSwitch;
