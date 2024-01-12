import { useTenant } from '@/templates/tenants/useTenant';
import { Button, Spin, Upload } from 'antd';
import { UploadProps } from 'antd/lib/upload';
import { UploadFile, UploadFileStatus } from 'antd/lib/upload/interface';
import { useEffect, useState } from 'react';

import styles from './UploadMultipleFileAjax.module.scss';

interface UploadMultipleFileProps extends Omit<UploadProps, 'value' | 'onChange'> {
  value?: Array<UploadFileType>;
  onChange?: (file: Array<UploadFile>) => void;
  service?: any;
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

const UploadMultipleFileAjax = ({
  value,
  onChange = () => {},
  ...uploadProps
}: UploadMultipleFileProps) => {
  const [fileUrlList, setFileUrlList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { config } = useTenant();
  
  useEffect(() => {
    setFileUrlList(value || []);
  }, [value])
  
  return (
    <Upload
      className={styles.uploadMultipleFile}
      name="file"
      multiple
      listType="text"
      disabled={loading}
      showUploadList={false}
      beforeUpload={() => false}
      {...uploadProps}
      fileList={fileUrlList.map(url => {
        return {
          uid: generateUUID(),
          name: 'image4.png',
          status: 'done',
          url: url,
        }
      })}
      onChange={async ({ fileList }) => {
        if (onChange) {
          setLoading(true);
          const newFileUrlList = [...fileUrlList];
          for (const file of fileList) {
            if (file.originFileObj) {
              let service = config.COMPONENTS?.DEFAULT_PROPS.UploadMultipleFileAjax.service;
              if (uploadProps.service) {
                service = uploadProps.service;
              }
              const fileUrl = await service(file.originFileObj);
              newFileUrlList.push(fileUrl)
            } else if (typeof file === "string") {
              newFileUrlList.push(file)
            }
          }
          setLoading(false);
          setFileUrlList(newFileUrlList)
          onChange(newFileUrlList);
        }
      }}
    >
       <Spin spinning={loading}>
        <Button className={styles.selectFileButton}>Select files</Button>
        {(fileUrlList|| []).map((fileUrl:any, index: number) => {
          return <>
          <div key={index}>{fileUrl}</div>
          <div style={{ marginBottom: 5, borderTop: '1px dashed #bdbdbd' }}></div>
          </>
        })}
      </Spin>
    </Upload>
  );
};

export default UploadMultipleFileAjax;
