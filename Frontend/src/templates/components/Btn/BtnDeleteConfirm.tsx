import { DeleteOutlined } from '@ant-design/icons';
import { Button, ButtonProps, Popconfirm } from 'antd';
import React, { FC } from 'react';

type Props = { loading?: boolean; onConfirm: () => void } & ButtonProps;

const BtnDeleteConfirm: FC<Props> = (props) => {
  const { loading, onConfirm = () => {}, ...buttonRes } = props;

  return (
    <Popconfirm okText="Delete" cancelText="Cancel" title="Want to delete?" onConfirm={onConfirm}>
      <Button loading={loading} danger type="primary" {...buttonRes}>
        <DeleteOutlined />
      </Button>
    </Popconfirm>
  );
};

export default BtnDeleteConfirm;
