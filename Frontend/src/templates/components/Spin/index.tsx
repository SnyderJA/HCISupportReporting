import { Spin as AntdSpin, SpinProps as AntdSpinProps } from 'antd';
import styles from './Spin.module.scss';

interface SpinProps extends AntdSpinProps {
  children: React.ReactNode;
}

const Spin = (props: SpinProps) => {
  return (
    <AntdSpin {...props} wrapperClassName={`${styles.spinTemplate} ${props.wrapperClassName}`}>
      {/* @ts-ignore */}
      {props.children}
    </AntdSpin>
  );
};
export default Spin;
