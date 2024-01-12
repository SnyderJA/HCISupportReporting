import { Button, Tooltip, Upload } from 'antd';
import { UploadProps } from 'antd/lib/upload';
import { UploadFile } from 'antd/lib/upload/interface';
import { useState } from 'react';

import styles from './UploadSingleFileBase64.module.scss';

interface UploadSingleFileBase64 extends Omit<UploadProps, 'value' | 'onChange'> {
  value?: string;
  onChange?: (file: UploadFile) => void;
}

function getBase64(img: any, callback: any) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

const UploadSingleFileBase64 = ({ value, onChange, ...uploadProps }: UploadSingleFileBase64) => {
  const [file, setFile] = useState<any>();

  const getFileName = () => {
    if (!value) return '';
    return value.startsWith('http') ? value : file.name;
  };

  return (
    <Upload
      className={styles.uploadSingleFile}
      name="file"
      multiple={false}
      listType="text"
      showUploadList={false}
      beforeUpload={(file) => false}
      {...uploadProps}
      onChange={({ file }) => {
        if (file) {
          setFile(file);
          // Get this url from response in real world.
          getBase64(file, (imageBase64: any) => {
            if (onChange) {
              onChange(imageBase64);
            }
          });
        }
      }}
    >
      {value ? (
        <Tooltip title={getFileName()}>
          <div className={styles.fileName}>{getFileName()}</div>
        </Tooltip>
      ) : (
        <Button className={styles.selectFileButton}>Select a file</Button>
      )}
    </Upload>
  );
};

export default UploadSingleFileBase64;
