import { Form, FormInstance, Modal, Spin } from 'antd';
import {
  useRef,
  useState,
  forwardRef,
  useEffect,
  useImperativeHandle,
  ForwardRefRenderFunction,
} from 'react';

import FormRender, { FormRenderProps } from '.';

type FormModalRenderProps = {
  formRender: FormRenderProps;
  onFinish?: any;
  onCancel?: any;
  initValue?: any;
};

export type FormModalRenderHandle = {
  form: FormInstance;
  setLoading: (value: boolean) => void;
};

const FormModalContent: ForwardRefRenderFunction<FormModalRenderHandle, FormModalRenderProps> = (
  { formRender, onCancel, onFinish, initValue }: FormModalRenderProps,
  ref
) => {
  const [form] = Form.useForm();
  const [initValues, setInitValues] = useState(initValue || {});
  const [loading, setLoading] = useState(false);

  useImperativeHandle(ref, () => ({
    form,
    setInitValues,
    getInitValues: () => initValues,
    setLoading,
  }));

  return (
    <Spin spinning={loading}>
      <FormRender {...formRender} initValues={initValues} onFinish={onFinish} onCancel={onCancel} />
    </Spin>
  );
};

export default forwardRef(FormModalContent);
