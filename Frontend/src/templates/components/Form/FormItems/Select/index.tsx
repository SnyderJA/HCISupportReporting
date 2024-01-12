import { Select as RootSelect } from 'antd';
import { SelectProps as RootSelectProps, SelectValue } from 'antd/lib/select';

import styles from './Select.module.scss';

interface SelectProps<T> extends RootSelectProps<T> {
  data:
    | Array<{
        value: string;
        label: string;
      }>
    | string[]
    | number[];
}

const Select = <T extends SelectValue = SelectValue>({ data, ...props }: SelectProps<T>) => {
  const dataSource: Array<{
    value: string;
    label: string;
  }> = data.map((item: any) => {
    if (item.value) {
      return item as any;
    }
    return { value: item, label: item };
  });

  return (
    <RootSelect<T> {...props} className={styles.select} dropdownClassName={styles.dropdownOptions}>
      {dataSource.map((item) => (
        <RootSelect.Option key={item.value} value={item.value}>
          {item.label}
        </RootSelect.Option>
      ))}
    </RootSelect>
  );
};

export default Select;
