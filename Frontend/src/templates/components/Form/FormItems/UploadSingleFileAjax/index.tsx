import { useTenant } from '@/templates/tenants/useTenant';
import { Button, Spin, Tooltip, Upload } from 'antd';
import { UploadProps } from 'antd/lib/upload';
import { UploadFile } from 'antd/lib/upload/interface';
import { useEffect, useState } from 'react';
import styles from './UploadSingleFileAjax.module.scss';

interface UploadSingleFileAjax extends Omit<UploadProps, 'value' | 'onChange'> {
  value?: {
    name: string;
  };
  onChange?: (file: UploadFile) => void;
  service?: any;
}

const UploadSingleFileAjax = ({ value, onChange, ...uploadProps }: UploadSingleFileAjax) => {
  const [fileUrl, setFileUrl] = useState();
  const [loading, setLoading] = useState(false);
  const { config } = useTenant();

  useEffect(() => {
    setFileUrl(value as any)
  }, [value])
  
  return (
    <Upload
      className={styles.uploadSingleFile}
      name="file"
      multiple={false}
      listType="text"
      beforeUpload={() => false}
      showUploadList={false}
      {...uploadProps}
      onChange={async ({ file }) => {
        if (onChange) {
          setLoading(true);
          let service = config.COMPONENTS?.DEFAULT_PROPS.UploadSingleFileAjax.service;
          if (uploadProps.service) {
            service = uploadProps.service;
          }
          const fileUrl = await service(file);
          setLoading(false);
          setFileUrl(fileUrl);
          onChange(fileUrl);
        }
      }}
    >
      <Spin spinning={loading}>
        {fileUrl ? (
          <Tooltip title={<img width={'250'} src={fileUrl}></img>}>
            <div className={styles.fileName}>{fileUrl}</div>
          </Tooltip>
        ) : (
          <Button block className={styles.selectFileButton}>
            Select a file
          </Button>
        )}
      </Spin>
    </Upload>
  );
};

export default UploadSingleFileAjax;
