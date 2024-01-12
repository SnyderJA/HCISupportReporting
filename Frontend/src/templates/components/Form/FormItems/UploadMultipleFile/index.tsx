import { Button, Upload } from 'antd';
import { UploadProps } from 'antd/lib/upload';
import { UploadFile, UploadFileStatus } from 'antd/lib/upload/interface';
import { useEffect, useState } from 'react';

import styles from './UploadMultipleFile.module.scss';

interface UploadMultipleFileProps extends Omit<UploadProps, 'value' | 'onChange'> {
  value?: Array<UploadFileType>;
  onChange?: (file: Array<UploadFile>) => void;
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

const UploadMultipleFile = ({ value, onChange, ...uploadProps }: UploadMultipleFileProps) => {
  const [fileList, setFileList] = useState<UploadFileType[]>([]);

  useEffect(() => {
    const newFileList = (value || []).map((v) => {
      if (!v.fileId) {
        return v;
      }
      return {
        ...v,
        uid: generateUUID(),
        fileId: v.fileId,
        name: v.fileName || '',
        status: 'done' as UploadFileStatus,
        url: v.fileUrl,
      };
    });
    setFileList(newFileList);
  }, [value]);

  return (
    <Upload
      className={styles.uploadMultipleFile}
      name="file"
      multiple
      listType="text"
      beforeUpload={() => false}
      {...uploadProps}
      fileList={fileList}
      onChange={({ fileList }) => {
        if (onChange) {
          onChange(fileList);
        }
      }}
    >
      <Button className={styles.selectFileButton}>Select files</Button>
    </Upload>
  );
};

export default UploadMultipleFile;
