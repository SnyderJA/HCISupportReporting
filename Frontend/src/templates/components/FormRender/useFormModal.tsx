import { Modal } from 'antd';
import { useRef, useState } from 'react';
import { FormRenderProps } from '.';
import FormModalContent, { FormModalRenderHandle } from './FormModalContent';

type FormModalRenderProps = {
  title: string;
  formRender: FormRenderProps;
  onFinish?: any;
};

const useFormModal = (props: FormModalRenderProps) => {
  const [visible, setVisible] = useState(false);
  const [initValues, setInitValues] = useState({});
  const formRef = useRef<FormModalRenderHandle>(null);

  const show = (initValue: object) => {
    if (initValue) {
      setInitValues(initValue);
    } else {
      setInitValues({});
    }
    setVisible(true);
  };

  const hide = () => {
    setVisible(false);
    formRef.current?.form.resetFields();
  };

  const onFinish = async (values: any) => {
    try {
      formRef.current?.setLoading(true);
      await props.onFinish({ ...initValues, ...values });
      hide();
    } catch (e: any) {
      console.error(e);
    } finally {
      formRef.current?.setLoading(false);
    }
  };

  const comp = () => (
    <Modal
      width={620}
      maskClosable={false}
      closable={true}
      footer={null}
      title={props.title}
      visible={visible}
      onCancel={() => {
        hide();
      }}
    >
      <FormModalContent
        ref={formRef}
        formRender={props.formRender}
        onCancel={hide}
        onFinish={onFinish}
        initValue={initValues}
      />
    </Modal>
  );

  return { Modal: comp, show, hide };
};

export default useFormModal;
