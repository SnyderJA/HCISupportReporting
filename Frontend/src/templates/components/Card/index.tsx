import { Card } from 'antd';
import { CardProps } from 'antd/lib/card';

import styles from './Card.module.scss';

const CommonCard = ({ children, ...props }: CardProps) => {
  const propsWithoutModel: any = { ...props };
  delete propsWithoutModel.model;
  return (
    <Card className={styles.card} {...propsWithoutModel}>
      {children}
    </Card>
  );
};

export default CommonCard;
