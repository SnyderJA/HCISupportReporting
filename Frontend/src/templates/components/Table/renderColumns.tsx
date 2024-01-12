import { dateTimeToString, dateToString } from '@/templates/utils/format.util';
import { updateQueryParams } from '@/templates/utils/url.util';
import { Modal, Tag } from 'antd';

import { useRouter } from 'next/router';

const { confirm } = Modal;

export const Link = ({ text, params }: { text: string; params: any }) => {
  const router = useRouter();
  return (
    <a
      onClick={() => {
        const href = updateQueryParams(params);
        router.push(href, undefined, { shallow: true });
      }}
    >
      {text}
    </a>
  );
};

export const renderLink = ({ fieldText, params }: { fieldText?: string; params: any }) => {
  return (text: any, record: any) => {
    if (fieldText) {
      text = record[fieldText];
    }
    return <Link text={text} params={params(record)} />;
  };
};

export const renderImage = ({ getSrc }: { getSrc?: any } = {}) => {
  return (src: any, record: any) => {
    if (getSrc) {
      src = getSrc(record);
    }
    if (!src || src === '') {
      return null;
    }
    // TODO config prefix s3
    return <img style={{ width: 120 }} src={src} />;
  };
};

export const renderIcon = ({ getSrc }: { getSrc?: any } = {}) => {
  return (src: any, record: any) => {
    if (getSrc) {
      src = getSrc(record);
    }
    if (!src || src === '') {
      return null;
    }
    return <img style={{ width: 30 }} src={src} />;
  };
};

export const renderDate = () => {
  return (date: any, record: any) => {
    if (!date) {
      return '';
    }
    return dateToString(date);
  };
};

export const renderDateTime = () => {
  return (date: any, record: any) => {
    if (!date) {
      return '';
    }
    return dateTimeToString(date);
  };
};

export const renderPreviewFiles = () => {
  const getFileName = (fileUrl: any) => {
    if (!fileUrl || !fileUrl.split) {
      return '';
    }
    const fileElements = fileUrl.split('/');
    const fileLastElement = fileElements[fileElements.length - 1];
    return fileLastElement;
  };
  return (files: any, record: any) => {
    if (!Array.isArray(files)) {
      files = [files];
    }

    return (
      <>
        {files.map((fileUrl: string, index: number) => {
          return (
            <a
              onClick={() => {
                confirm({
                  width: '100vw',
                  title: '',
                  icon: null,
                  content: (
                    <div>
                      <img width={'100%'} src={fileUrl} />
                    </div>
                  ),
                  cancelButtonProps: {
                    style: {
                      display: 'none',
                    },
                  },
                  okText: 'X',
                  okButtonProps: {
                    style: {
                      position: 'absolute',
                      top: '0',
                      right: '0',
                      background: 'transparent',
                      border: 'none',
                      color: '#424242',
                      fontSize: '16px',
                    },
                  },
                });
              }}
            >
              <Tag>{getFileName(fileUrl)}</Tag>
            </a>
          );
        })}
      </>
    );
  };
};
