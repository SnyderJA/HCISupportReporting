import { Select } from 'antd';
import { SelectProps } from 'antd/es/select';
import { FormInstance } from 'antd/lib/form';
import { useEffect, useState } from 'react';

import styles from './SelectAjax.module.scss';

interface SelectAjaxProps<ValueType = any>
  extends Omit<SelectProps<ValueType>, 'value' | 'onChange'> {
  allowGetObjSelected?: boolean;
  form: FormInstance;
  keyValue?: string;
  keyLabel?: string;
  setValue?: (item: object) => string | number;
  setLabel?: (item: object) => string;
  placeholder?: string;
  allowGetData?: boolean;
  params?: object | undefined;
  getParamOnSearch?: (params: string) => object;
  service: (params: object) => Promise<object>;
  handleGetDataResponse?: (res: object) => { [key: string]: string | number }[];
  onChange?: (value: number | string | object) => void;
  typeValue: string;
  value: string | number | string[];
  formFieldName: string;
}

type ResponseDataType = {
  data?: {
    items?: { [key: string]: string | number }[];
  };
};

function SelectAjax(props: SelectAjaxProps) {
  const [loading, setLoading] = useState<boolean>();
  const [data, setData] = useState<{ [key: string]: string | number }[]>([]);

  const {
    keyValue = 'id',
    keyLabel = 'label',
    setValue,
    setLabel,
    allowGetData,
    params,
    allowGetObjSelected,
    typeValue,
    service,
    value,
    onChange,
    form,
    formFieldName,
    getParamOnSearch,
    handleGetDataResponse,
    ...selectProps
  } = props;

  useEffect(() => {
    actionGetData();
  }, [params]); // eslint-disable-line react-hooks/exhaustive-deps

  const checkValueNumber = () => {
    if (typeValue === 'string') {
      return;
    }
    if (!value || typeof value === 'number') {
      return;
    }
    if (typeValue === 'int') {
      let numberValue;
      if (Array.isArray(value)) {
        numberValue = value.map((v) => parseInt(v));
      } else {
        numberValue = parseInt(value);
      }
      onChange && onChange(numberValue);
    }
  };

  const handleGetDataResponseDefault = (res: ResponseDataType) => {
    return res && res.data && res.data.items ? res.data.items : [];
  };

  const actionGetData = async (paramSearch = {}) => {
    removeValue();
    if (!allowGetData) {
      setData([]);
      return;
    }
    setLoading(true);
    const res = await service({ ...params, ...paramSearch });
    const data = handleGetDataResponse
      ? await handleGetDataResponse(res)
      : handleGetDataResponseDefault(res);
    setData(data);
    setLoading(false);
    checkValueNumber();
    setOriginalSelectedObjects(value);
  };

  const removeValue = () => {
    const { setFieldsValue } = form;
    if (formFieldName) {
      setFieldsValue({ [formFieldName]: undefined });
    }
  };

  const setOriginalSelectedObjects = (value: any) => {
    if (allowGetObjSelected && form && formFieldName) {
      if (selectProps.mode === 'multiple') {
        const selectedObjects = data.filter((item) => value.includes(`${valueOpt(item)}`));

        form.setFieldsValue({
          [`${formFieldName}`]:
            selectedObjects.length > 0
              ? data.filter((item) => value.includes(`${valueOpt(item)}`))
              : undefined,
        });
      } else {
        form.setFieldsValue({
          [`${formFieldName}`]: data.filter((item) => value === valueOpt(item))[0] || undefined,
        });
      }
    }
  };

  const valueOpt = (item: { [key: string]: string | number }) => {
    const value = setValue ? setValue(item) : item[keyValue];
    return value || '';
  };

  const labelOpt = (item: { [key: string]: string | number }) => {
    return setLabel ? setLabel(item) : item[keyLabel];
  };

  const handleSelectChange = (value: any) => {
    onChange && onChange(value);
    setOriginalSelectedObjects(value);
  };

  const handleSearch = (value: string) => {
    if (!getParamOnSearch) {
      return;
    }
    const paramSearch = getParamOnSearch(value);
    actionGetData(paramSearch);
  };

  const getValue = () => {
    if (props.mode === 'multiple') {
      return value || [];
    }
    return value;
  };

  return (
    <Select
      className={styles.selectAjax}
      dropdownClassName={styles.dropdownOptions}
      showSearch
      style={{ width: '100%' }}
      loading={loading}
      filterOption={(input, option) =>
        !!option && valueOpt(option).toString().toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
      {...selectProps}
      onSearch={handleSearch}
      onChange={handleSelectChange}
      options={data.map((item) => ({ label: labelOpt(item), value: valueOpt(item) }))}
      value={getValue()}
      
    />
  );
}

SelectAjax.defaultProps = {
  keyValue: 'id',
  keyLabel: 'label',
  allowClear: true,
  allowGetData: true,
  typeValue: 'string',
  allowGetObjSelected: false,
  params: {},
  service: null,
  value: undefined,
};

export default SelectAjax;
