import { useTenant } from '@/templates/tenants/useTenant';
import { Button, Spin, Tooltip, Upload } from 'antd';
import { UploadProps } from 'antd/lib/upload';
import { UploadFile } from 'antd/lib/upload/interface';
import { useEffect, useState } from 'react';

import styles from './UploadFileAjax.module.scss';

interface UploadFileAjaxProps extends Omit<UploadProps, 'value' | 'onChange'> {
  value?: Array<UploadFileType>;
  onChange?: (file: Array<UploadFile>) => void;
  service?: any;
  multiple?: boolean;
}

type UploadFileType = UploadFile & { fileId?: string; fileUrl?: string };

const generateUUID = () => {
  // Public Domain/MIT
  let d = new Date().getTime(); //Timestamp
  let d2 = (performance && performance.now && performance.now() * 1000) || 0; //Time in microseconds since page-load or 0 if unsupported
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    let r = Math.random() * 16; //random number between 0 and 16
    if (d > 0) {
      //Use timestamp until depleted
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {
      //Use microseconds since page-load if supported
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
};

const UploadFileAjax = ({
  value,
  onChange = () => {},
  multiple = false,
  ...uploadProps
}: UploadFileAjaxProps) => {
  // const [fileUrl, setFileUrl] = useState();
  const [fileUrlList, setFileUrlList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { config } = useTenant();

  useEffect(() => {
    if (!multiple) {
      if (value) {
        setFileUrlList([value]);
      }
    } else {
      setFileUrlList(value || []);
    }
  }, [value]);

  return (
    <Spin spinning={loading}>
      <Upload
        className={styles.uploadMultipleFile}
        name="file"
        multiple={multiple}
        listType="text"
        disabled={loading}
        showUploadList={false}
        beforeUpload={() => false}
        {...uploadProps}
        onChange={async ({ fileList, file }) => {
          if (onChange) {
            setLoading(true);
            let service = config.COMPONENTS?.DEFAULT_PROPS.UploadFileAjax?.service;
            if (uploadProps.service) {
              service = uploadProps.service;
            }
            const fileUrl = await service(file);
            if (!multiple) {
              setFileUrlList([fileUrl]);
              onChange(fileUrl);
            } else {
              const newFileUrlList = [...fileUrlList, fileUrl];
              setFileUrlList(newFileUrlList);
              onChange(newFileUrlList);
            }
            setLoading(false);
          }
        }}
      >
        <Button className={styles.selectFileButton}>Select files</Button>
      </Upload>

      {fileUrlList && fileUrlList.length > 0 && (
        <div className={styles.fileNameContainer}>
          {fileUrlList.map((fileUrl: any, index: number) => {
            const getFileName = (fileUrl: any) => {
              const fileElements = fileUrl.split('/');
              const fileLastElement = fileElements[fileElements.length - 1];
              return fileLastElement;
            };
            return (
              <Tooltip key={fileUrl} placement="top" title={<img width={'100%'} src={fileUrl}></img>}>
                <div className={styles.fileItem}>
                  <div className={styles.fileName}>{getFileName(fileUrl)}</div>
                  <div className={styles.fileItemDelete}>
                    <button
                      type="button"
                      onClick={() => {
                        const newFileUrlList = fileUrlList.filter((item) => item !== fileUrl);
                        setFileUrlList(newFileUrlList);
                        if (!multiple) {
                          onChange(newFileUrlList[0]);
                        } else {
                          onChange(newFileUrlList);
                        }
                        return true;
                      }}
                    >
                      x
                    </button>
                  </div>
                </div>
                {index + 1 !== fileUrlList.length && (
                  <div style={{ marginBottom: 5, borderTop: '1px dashed #bdbdbd' }} />
                )}
              </Tooltip>
            );
          })}
        </div>
      )}
    </Spin>
  );
};

export default UploadFileAjax;
