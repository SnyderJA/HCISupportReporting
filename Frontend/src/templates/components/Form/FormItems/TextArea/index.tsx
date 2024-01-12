import { Input } from 'antd';
import { TextAreaProps } from 'antd/lib/input';

import styles from './Input.module.scss';

const TextArea = (props: TextAreaProps) => {
  return <Input.TextArea className={styles.textArea} {...props} autoSize={{ minRows: 2 }} />;
};

export default TextArea;
