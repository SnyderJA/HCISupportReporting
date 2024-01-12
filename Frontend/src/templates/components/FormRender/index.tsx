import { FormInstance, FormProps } from 'antd/lib/form';
import { Store } from 'antd/lib/form/interface';
import React, { useEffect } from 'react';

import { Form, FormItem, useForm } from '@/templates/components/Form';
import { camelCaseToSentenceCase } from '@/templates/utils/format.util';
import { Button } from 'antd';

type RenderProps = {
  form: FormInstance;
  item: any;
  formItemProps: any;
};

type ItemType = {
  field: string;
  label?: string;
  component?: React.ReactNode;
  render?: (props: RenderProps) => React.ReactNode;
  validationIconFixed?: boolean;
  customFormItem?: boolean;
};

export type FormRenderProps = {
  items: Array<ItemType>;
  initValue?: object;
  onFinish?: (values: object) => void;
  onCancel?: () => void;
  footerItems?: Array<React.ReactNode>;
  initValues?: Store;
};

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 7 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 17 },
  },
};

const footerLayout = {
  wrapperCol: { xs: { span: 24 }, sm: { offset: 7, span: 12 } },
};

const FormRender = ({
  items = [],
  footerItems = [],
  initValues,
  ...formProps
}: FormRenderProps & FormProps) => {
  const [form] = useForm();

  useEffect(() => {
    form.setFieldsValue(initValues);
  }, [initValues]);

  return (
    <Form {...formItemLayout} form={form} {...formProps}>
      {items.map((item) => {
        const label = item.label || camelCaseToSentenceCase(item.field);
        const { field, component, render, customFormItem, ...itemProps } = item;
        const formItemProps = {
          ...itemProps,
          key: field,
          name: field,
          label,
          hasFeedback: true,
        };
        if (customFormItem) {
          return render ? render({ form, item: initValues, formItemProps }) : component;
        }
        return (
          <FormItem {...formItemProps}>
            {render ? render({ form, item: initValues, formItemProps }) : component}
          </FormItem>
        );
      })}
      <FormItem {...footerLayout}>
        {footerItems && footerItems.length > 0 ? (
          footerItems
        ) : (
          <Button htmlType="submit" type="primary">
            Save
          </Button>
        )}
      </FormItem>
    </Form>
  );
};

export default FormRender;
