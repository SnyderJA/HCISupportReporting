import { Switch, SwitchProps } from 'antd';
import { useEffect } from 'react';

import styles from './Switch2Value.module.scss';

interface Switch2ValueProps extends SwitchProps {
  value?: boolean;
  values?: Array<string | number | boolean>;
  onChange?: (value: string | number | boolean) => void;
}

const Switch2Value = ({ value = false, values = [false, true], ...props }: Switch2ValueProps) => {
  useEffect(() => {
    if (!values.includes(value)) {
      onChange(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onChange = (checked: boolean) => {
    const valueIndex = checked ? 1 : 0;
    const value = values[valueIndex];

    if (props.onChange) {
      props.onChange(value);
    }
  };

  return (
    <Switch
      className={styles.switch2Value}
      {...props}
      checked={values.indexOf(value) === 1}
      onChange={onChange}
    />
  );
};

Switch2Value.defaultProps = {
  values: [false, true],
};

export default Switch2Value;
