import { Form } from 'antd';
import { FormItemProps, FormProps } from 'antd/lib/form';

import styles from './Form.module.scss';

const CommonForm = ({ children, ...props }: FormProps) => {
  return (
    <Form className={styles.form} {...props}>
      {/* @ts-ignore */}
      {children}
    </Form>
  );
};

interface CommonFormItemProps extends FormItemProps {
  fixValidationIcon?: boolean;
}

const CommonFormItem = ({ children, fixValidationIcon, ...props }: CommonFormItemProps) => {
  return (
    <Form.Item
      className={`${styles.formItem} ${fixValidationIcon ? styles.fixValidationIcon : ''}`}
      {...props}
    >
      {children}
    </Form.Item>
  );
};

const useForm = Form.useForm;

export { CommonForm as Form, CommonFormItem as FormItem, useForm };
