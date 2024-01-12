import react, { useEffect, useState } from 'react';
import { Breadcrumb } from 'antd';
import { Link } from '../Table/renderColumns';
import { useRouter } from 'next/router';

const BreadcrumbData = (props: any) => {
  const router = useRouter();
  const [data, setData] = useState([]);

  const callService = async () => {
    const data = await props.service();
    setData(data);
  };

  useEffect(() => {
    callService();
  }, [router]);

  return (
    <Breadcrumb>
      {[{ name: 'Root' }, ...data].map((item: any) => {
        return (
          <Breadcrumb.Item key={item.name}>
            <Link text={item.name} params={item.routerParams} />
          </Breadcrumb.Item>
        );
      })}
    </Breadcrumb>
  );
};

export default BreadcrumbData;
