import { Input } from 'antd';
import { InputProps } from 'antd/lib/input';

import styles from './InputNumberOnly.module.scss';

const InputNumberOnly = ({
  isDecimals = true,
  canNegative = true,
  onChange,
  ...props
}: InputProps & {
  isDecimals?: boolean;
  canNegative?: boolean;
  onChange?: (value: string) => void;
}) => {
  const valid = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    let reg = /^-?\d*\.?\d*$/;

    if (isDecimals && canNegative) {
      reg = /^-?\d*\.?\d*$/;
    }

    if (isDecimals && !canNegative) {
      reg = /^\d*\.?\d*$/;
    }

    if (!isDecimals && canNegative) {
      reg = /^-?\d*$/;
    }

    if (!isDecimals && !canNegative) {
      reg = /^\d*$/;
    }

    if ((!Number.isNaN(value) && reg.test(value)) || value === '') {
      onChange && onChange(value);
    } else {
      onChange && onChange(value.replace(/\D/g, ''));
    }
  };

  return <Input className={styles.inputNumberOnly} {...props} onChange={valid} />;
};

export default InputNumberOnly;
