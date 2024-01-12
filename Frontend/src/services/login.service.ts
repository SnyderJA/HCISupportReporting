import { request } from '@/templates/utils/request.util';

export interface LoginDataService {
  email: string;
  password: string;
}
export const login = async (data: LoginDataService) => {
  const token = `${data.email}:${data.password}`;
  const encodedToken = Buffer.from(token).toString('base64');
  const result = await request({
    url: '/api/auth/verify',
    method: 'POST',
    headers: { Authorization: 'Basic ' + encodedToken },
  });
  const [err, res] = result;
  if (res) {
    localStorage.setItem('ss_token', encodedToken);
  }
  return result;
};
