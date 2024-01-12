import { login } from '@/services/login.service';
import useAuth from '@/templates/auth/useAuth';
import { useRouter } from 'next/router';
import { useState } from 'react';
import styles from './LoginForm.module.scss';
import { Alert, Spin } from 'antd';

type Props = {};
const backgroundUrl = 'https://colorlib.com/etc/lf/Login_v15/images/bg-01.jpg';
const LoginForm = (props: Props) => {
  const auth = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const router = useRouter();
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const response: any = await login({ email, password });
    setError(response[0]);
    if (response.filter(Boolean)[0].status === 200) {
      setLoading(false);
      auth.setStatus('LOGGED_IN');
      router.push('/');
    }
    setLoading(false);
  };
  return (
    <div className={styles.loginForm}>
      <div className={styles.loginForm__wrapper}>
        <div className={styles.loginForm__title}>
          <div className={styles.loginForm__title__text}>SIGN IN</div>
          <div
            className={styles.loginForm__background}
            style={{ backgroundImage: `url(${backgroundUrl})` }}
          />
        </div>
        <form
          action=""
          method="POST"
          className={styles.loginForm__container}
          onSubmit={handleSubmit}
        >
          <div
            className={styles.loginForm__container__field_container}
            data-validate="Username is required"
          >
            <span className={styles.loginForm__container__field_label}>Username</span>
            <input
              className={styles.loginForm__container__field_input}
              name="email"
              placeholder="Enter username"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div
            className={styles.loginForm__container__field_container}
            data-validate="Password is required"
          >
            <span className={styles.loginForm__container__field_label}>Password</span>
            <input
              className={styles.loginForm__container__field_input}
              type="password"
              name="password"
              placeholder="Enter password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && (
            <Alert description="The username or password is incorrect" type="error" showIcon />
          )}
          <div>
            <div
              className={styles.loginForm__container__field_container + ' ' + styles.remember_me}
            ></div>
          </div>

          <div>
            <button className={styles.loginForm__btnLogin} type="submit">
              <Spin spinning={loading}>Login</Spin>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
