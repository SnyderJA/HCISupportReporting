import { NextRouter, useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { openAuthUI } from '@/templates/auth/auth.util';
import { Dispatch, RootState } from '@/templates/states/store';

import { useTenant } from '@/templates/tenants/useTenant';
import { AuthStatus, AuthUser } from './auth';
import { TenantConfig } from '../tenants/tenant';

const useAuth = () => {
  const authUser: AuthUser = useSelector((state: RootState) => (state.auth as any).user);
  const authStatus: AuthStatus = useSelector((state: RootState) => (state.auth as any).status);
  const authDispatch = useDispatch<Dispatch>().auth;
  const router = useRouter();
  const [isPublicPage, setIsPublicPage] = useState(Boolean);
  const { config: tenantConfig = {} as TenantConfig } = useTenant();

  if (!tenantConfig) {
    throw new Error('Invalid tenant');
  }

  useEffect(() => {
    const isPublicPage = tenantConfig.AUTH.PUBLIC_PATH_NAMES.includes(router.pathname);
    setIsPublicPage(isPublicPage);
  }, [router, tenantConfig]);

  useEffect(() => {
    if (!router.isReady) {
      return;
    }
    if (authStatus === 'NOT_CHECK') {
      authDispatch.checkAuth(tenantConfig);
      return;
    }

    if (authStatus === 'NOT_LOGGED_IN' && isPublicPage === false) {
      openAuthUI(tenantConfig);
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, authStatus, tenantConfig, isPublicPage]);
  return { status: authStatus, user: authUser, isPublicPage, setStatus: authDispatch.setStatus };
};

export default useAuth;
