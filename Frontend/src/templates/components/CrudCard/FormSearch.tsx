import { Button, Form } from 'antd';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import { getQueryParams, updateQueryParams } from '@/templates/utils/url.util';
import { camelCaseToSentenceCase } from '@/templates/utils/format.util';
import { SearchOutlined } from '@ant-design/icons';

export type FormSearchProps = {
  items: any;
};

const FormSearch = ({ items }: FormSearchProps) => {
  const [form] = Form.useForm();
  const router = useRouter();
  useEffect(() => {
    form.setFieldsValue(getQueryParams());
  }, []);

  const onFinish = (values: any) => {
    // TODO validate
    const href = updateQueryParams(values);
    router.push(href);
  };
  return (
    <Form form={form} name="horizontal_search" layout="inline" onFinish={onFinish}>
      {items.map((item: any) => {
        const label = item.label ? item.label : camelCaseToSentenceCase(item.field);
        return (
          <div style={{ marginRight: 20 }} key={item.field}>
            <div
              style={{
                color: '#535353c7',
                fontWeight: 100,
                textAlign: 'left',
                fontSize: 13,
                lineHeight: '12px',
              }}
            >
              {label}
            </div>
            <Form.Item style={{ margin: 0 }} name={item.field}>
              {item.component}
            </Form.Item>
          </div>
        );
      })}
      <Form.Item style={{ marginTop: 10 }}>
        <Button icon={<SearchOutlined />} shape="circle" type="primary" htmlType="submit"></Button>
      </Form.Item>
    </Form>
  );
};

export default FormSearch;
