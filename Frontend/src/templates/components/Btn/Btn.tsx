import { Button } from 'antd';
import React, { useState } from 'react';

const Btn = (props: any) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async (e: any) => {
    if (loading) {
      return;
    }
    if (!props.onClick) {
      return;
    }
    setLoading(true);
    await props.onClick(e);
    setLoading(false);
  };

  return (
    <Button loading={loading} disabled={loading} {...props} onClick={handleClick}>
      <span>{props.children || props.title}</span>
    </Button>
  );
};

Btn.defaultProps = {
  className: '',
  title: '',
};

export default Btn;
