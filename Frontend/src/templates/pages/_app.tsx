import '@ant-design/pro-layout/dist/layout.css';
import 'antd/dist/antd.css';
import '@/templates/styles/styles.scss';

import { ConfigProvider as ProConfigProvider, enUSIntl } from '@ant-design/pro-provider';
import { ConfigProvider } from 'antd';
import locale from 'antd/lib/locale/en_US';
import produce from 'immer';
import type { AppContext, AppProps } from 'next/app';
import App from 'next/app';
import Head from 'next/head';
import { Provider } from 'react-redux';

import Layout from '@/templates/components/Layout';
import { useStore } from '@/templates/states/store';
import { initialTenantState } from '@/templates/tenants/tenant.util';

const HeadDefault = () => {
  return (
    <Head>
      <title>Admin panel</title>
      <link rel="preload" href="fonts/NoirPro/NoirPro-Regular.ttf" as="font"></link>
      <link rel="icon" href="/logo.png" />
    </Head>
  );
};

function AdminTemplateApp({ Component, pageProps }: AppProps) {
  let initialReduxState = pageProps.initialReduxState || {};
  initialReduxState = produce(initialReduxState, (state: any) => {
    state.tenant = initialTenantState(pageProps);
  });
  const store = useStore(initialReduxState);
  return (
    <ProConfigProvider
      value={{
        intl: enUSIntl,
        valueTypeMap: {},
      }}
    >
      <ConfigProvider locale={locale}>
        <Provider store={store}>
          <HeadDefault />
          <Layout>
            <Component {...pageProps}></Component>
          </Layout>
        </Provider>
      </ConfigProvider>
    </ProConfigProvider>
  );
}

AdminTemplateApp.getInitialProps = async (appContext: AppContext) => {
  const { ctx } = appContext;
  const pageProps = App.getInitialProps(appContext);
  // HTTP/1.x
  let host = ctx.req?.headers.host?.split(':')[0];
  if (!host) {
    // HTTP/2
    let authorityHeader = ctx.req?.headers[':authority'];
    if (authorityHeader && Array.isArray(authorityHeader)) {
      authorityHeader = authorityHeader[0];
    }
    host = (authorityHeader as string)?.split(':')[0];
  }
  return {
    pageProps: {
      ...pageProps,
      host,
    },
  };
};

export default AdminTemplateApp;
