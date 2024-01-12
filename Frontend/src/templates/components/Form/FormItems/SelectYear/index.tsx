import { Select } from 'antd';
import { SelectProps } from 'antd/lib/select';
import { useEffect, useState } from 'react';

import styles from './SelectYear.module.scss';

interface OptionProps {
  label: string;
  value: number;
}

type YearSelectProps = {
  from: number;
  to: number;
};

const SelectYear = ({ from, to, ...props }: YearSelectProps & SelectProps<OptionProps>) => {
  const [options, setOptions] = useState<OptionProps[]>([]);

  useEffect(() => {
    if (from && to && from < to) {
      const generateOptions = () => {
        const years: number[] = [];
        for (let count: number = from; count <= to; count++) {
          years.push(count);
        }
        setOptions(years.map((year) => ({ label: `${year}`, value: year })));
      };
      generateOptions();
    }
  }, [from, to]);

  return (
    <Select
      {...props}
      className={styles.selectYear}
      dropdownClassName={styles.selectDropdownOptions}
      options={options}
    />
  );
};

export default SelectYear;
