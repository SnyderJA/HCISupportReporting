import { createModel } from '@rematch/core';
import produce from 'immer';
import { AuthState, AuthStatus, AuthUser } from '@/templates/auth/auth';
import { RootModel } from '@/templates/states/models';
import { TenantConfig } from '../tenants/tenant';

export const storeName = 'auth';

const initialState: AuthState = {
  status: 'NOT_CHECK',
  user: undefined,
};

export const auth = createModel<RootModel>()({
  state: initialState,
  reducers: {
    setStatus: produce((state, status: AuthStatus) => {
      state.status = status;
    }),
    setUser: produce((state, payload: AuthUser | undefined) => {
      state.user = payload;
    }),
  },
  effects: (dispatch) => ({
    checkAuth: async (tenantConfig: TenantConfig, state) => {
      const dispatchAuth = dispatch.auth;
      dispatchAuth.setStatus('WAITING_CHECK');
      try {
        const user: AuthUser = await tenantConfig.AUTH.SERVICES.verifyAuth();
        // TODO valid AuthUser data
        dispatchAuth.setUser(user);
        dispatchAuth.setStatus('LOGGED_IN');
        return user;
      } catch (e) {
        dispatchAuth.setUser(undefined);
        dispatchAuth.setStatus('NOT_LOGGED_IN');
        console.error(e);
      }
    },
  }),
});
