import { ReactElement } from 'react';

import Layout from '@/templates/components/Layout';

import { NextPageWithLayout } from './_app';
import Dashboard from '@/modules/Dashboard';

const Home: NextPageWithLayout = () => {
  return (
    <div>
      <main>
        <Dashboard />
      </main>
    </div>
  );
};
Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
export default Home;
