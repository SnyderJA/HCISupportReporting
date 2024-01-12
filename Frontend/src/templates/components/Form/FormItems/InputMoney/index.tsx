import { InputNumber } from 'antd';
import { InputNumberProps } from 'antd/lib/input-number';
import React from 'react';

import { moneyToString, stringToMoney } from '@/templates/utils/format.util';

import styles from './InputMoney.module.scss';

type InputMoneyProps = InputNumberProps<string> & {
  refInput?: React.Ref<HTMLInputElement>;
};

const InputMoney = (props: InputMoneyProps) => {
  return (
    <InputNumber
      className={styles.inputMoney}
      formatter={moneyToString}
      parser={stringToMoney}
      ref={props.refInput}
      {...props}
    />
  );
};

export default InputMoney;
