import { Switch, Tag, Modal } from 'antd';
import moment from 'moment';

export const colSwitch = (text: any, record: any) => {
  return <Switch style={{ cursor: 'default', pointerEvents: 'none' }} checked={text} />;
};

const imageStyle = {
  cursor: 'pointer',
  border: '1px solid #f0f0f0',
};

export const colImage = (text: any, record: any) => {
  if (!text) {
    return null;
  }
  return (
    <img
      onClick={() => {
        Modal.info({
          title: '',
          icon: <span></span>,
          width: 600,
          bodyStyle: { padding: 10 },
          content: (
            <div>
              <img style={{ width: '100%', ...imageStyle }} src={text} />
            </div>
          ),
          closable: true,
          onOk() {},
        });
      }}
      style={{ width: 80, ...imageStyle }}
      src={text}
    />
  );
};

export const colTags = (text: any, record: any) => {
  return (text || []).map((tag: any) => <Tag color="cyan">{tag}</Tag>);
};

export const colDate = (text: string) => (text ? moment(text).format('DD/MM/YYYY h:mm A') : '');
