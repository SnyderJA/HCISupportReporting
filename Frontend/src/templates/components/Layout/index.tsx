import { UserOutlined } from '@ant-design/icons';
import { BasicLayoutProps, PageLoading, ProSettings } from '@ant-design/pro-layout';
import { Avatar, Button, Result } from 'antd';
import dynamic from 'next/dynamic';
import Router from 'next/router';
import { useState } from 'react';

import useAuth from '@/templates/auth/useAuth';
import { useTenant } from '@/templates/tenants/useTenant';

import { crudMenus } from './layout.util';
import HeaderContent from './Header';
import styles from './Layout.module.scss';

const ProLayout = dynamic(() => import('@ant-design/pro-layout'), {
  ssr: false,
});
const SettingDrawer = dynamic(() => import('@ant-design/pro-layout/lib/components/SettingDrawer'), {
  ssr: false,
});
const PageContainer = dynamic(() => import('@ant-design/pro-layout/lib/components/PageContainer'), {
  ssr: false,
});

const Layout = (props: BasicLayoutProps) => {
  const { status: authStatus } = useAuth();
  const { config: tenantConfig } = useTenant();
  const [settings, setSetting] = useState<Partial<ProSettings> | undefined>({
    fixSiderbar: true,
  });
  const [pathname, setPathname] = useState('/welcome');

  const _renderLayout = () => {
    if (authStatus === 'LOGGED_IN') {
      return (
        <>
          <ProLayout
            style={{ height: '100vh' }}
            route={{
              path: '/',
              routes: [...tenantConfig.MENU_DRAWER.MENU_DATA, ...crudMenus],
            }}
            className=""
            location={{
              pathname,
            }}
            waterMarkProps={{
              content: 'Pro Layout',
            }}
            headerContentRender={() => <HeaderContent />}
            onMenuHeaderClick={(e) => console.info(e)}
            menuItemRender={(item, dom) => (
              <Button
                type="text"
                onClick={() => {
                  setPathname(item.path || '/');
                  Router.push(item.path || '/', undefined, { shallow: false });
                }}
                className={styles.menuItemRender}
              >
                {dom}
              </Button>
            )}
            rightContentRender={() => (
              <div>
                <Avatar shape="square" size="small" icon={<UserOutlined />} />
              </div>
            )}
            siderWidth={0}
            {...settings}
            title={tenantConfig.MENU_DRAWER.TITLE}
            logo={<img src={tenantConfig.MENU_DRAWER.LOGO} alt="Logo" width="auto" height={32} />}
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            getContainer={() => document.getElementById('theme-layout')}
            menuProps={{
              className: styles.antMenuWrapper,
            }}
            collapsedButtonRender={() => null}
          >
            <PageContainer content={props.children}></PageContainer>
          </ProLayout>
          {/* <SettingDrawer
            pathname={pathname}
            getContainer={() => document.getElementById('theme-layout')}
            settings={settings}
            onSettingChange={(changeSetting) => {
              setSetting(changeSetting);
            }}
            disableUrlParams
          /> */}
        </>
      );
    }
    // if (authStatus === 'NOT_LOGGED_IN') {
    //   return (
    //     <div>
    //       <Result
    //         status="403"
    //         title="403"
    //         subTitle="Sorry, you are not authorized to access this page."
    //       />
    //     </div>
    //   );
    // }

    return (
      <div>
        <PageLoading />
      </div>
    );
  };

  return (
    <div
      id="theme-layout"
      className={styles.themLayoutContainer}
      style={{
        height: '100vh',
      }}
    >
      {_renderLayout()}
    </div>
  );
};

export default Layout;
