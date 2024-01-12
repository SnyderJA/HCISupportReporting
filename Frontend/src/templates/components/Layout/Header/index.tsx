import Icon, { UserOutlined } from '@ant-design/icons';
import { Avatar, Dropdown, Menu, Space, Typography } from 'antd';

import styles from './Header.module.scss';
import useAuth from '@/templates/auth/useAuth';
import Router from 'next/router';

const HeaderContent = () => {
  const { user } = useAuth();

  const userDropdownMenu = (
    <Menu>
      <Menu.Item>
        <Typography.Link
          onClick={() => {
            localStorage.removeItem('ss_token');
            Router.push('/login');
          }}
        >
          Logout
        </Typography.Link>
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <div>
        <h2 style={{ margin: 0 }}>JSM Dashboard</h2>
      </div>
      <ul style={{ marginLeft: 'auto' }} className={styles.headerContentContainer}>
        <li className={styles.iconContainer}>
          <Dropdown overlay={userDropdownMenu} placement="bottomLeft" trigger={['click']}>
            <Space style={{ cursor: 'pointer' }}>
              <Avatar src={user?.avatar} icon={<UserOutlined />} />
              {user?.name}
            </Space>
          </Dropdown>
        </li>
      </ul>
    </>
  );
};

export default HeaderContent;
