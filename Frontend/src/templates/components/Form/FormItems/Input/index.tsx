import { Input } from 'antd';
import { InputProps } from 'antd/lib/input';
import { useEffect } from 'react';

import styles from './Input.module.scss';

type CommonInputProps = {
  defaultIfNull?: any;
} & InputProps;

const CommonInput = (props: CommonInputProps) => {
  const { defaultIfNull } = props;

  useEffect(() => {}, [defaultIfNull]);

  return <Input className={styles.input} {...props} />;
};

export default CommonInput;
