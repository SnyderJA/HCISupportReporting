import { Button, Tooltip, Upload } from 'antd';
import { UploadProps } from 'antd/lib/upload';
import { UploadFile } from 'antd/lib/upload/interface';

import styles from './UploadSingleFile.module.scss';

interface UploadSingleFileProps extends Omit<UploadProps, 'value' | 'onChange'> {
  value?: {
    name: string;
  };
  onChange?: (file: UploadFile) => void;
}

const UploadSingleFile = ({ value, onChange, ...uploadProps }: UploadSingleFileProps) => {
  return (
    <Upload
      className={styles.uploadSingleFile}
      name="file"
      multiple={false}
      listType="text"
      beforeUpload={() => false}
      showUploadList={false}
      {...uploadProps}
      onChange={({ file }) => {
        if (onChange) {
          onChange(file);
        }
      }}
    >
      {value ? (
        <Tooltip title={value.name}>
          <div className={styles.fileName}>{value.name}</div>
        </Tooltip>
      ) : (
        <Button className={styles.selectFileButton}>Select a file</Button>
      )}
    </Upload>
  );
};

export default UploadSingleFile;
