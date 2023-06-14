import { useState, useRef, useEffect, useMemo } from 'react';
import { signIn, useSession } from 'next-auth/react'
import classes from './auth-form.module.css';
import { useRouter } from 'next/router';
import Loader from '../Loader/Loader';

function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const { data: session, status } = useSession();
  const router = useRouter();
  const isLoading = useMemo(() => status === 'loading', [status]);


  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/profile');
    }
  }, [status]);

  function switchAuthModeHandler() {
    setIsLogin((prevState) => !prevState);
  }

  async function createUser(email, password) {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json();

    if (data.error) {
      throw new Error(data.message);
    }

    return data;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const email = emailInputRef.current.value;
    const password = passwordInputRef.current.value;

    if (isLogin) {
      return await signIn('credentials', {
        redirect: false,
        email,
        password,
      });
    }

    try {
      const res = await createUser(email, password);

      console.log(res.message);
    } catch (error) {
      console.log(error.message);
    }
  }

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={handleSubmit}>
        <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input type='email' id='email' ref={emailInputRef} required />
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input type='password' id='password' ref={passwordInputRef} required />
        </div>
        <div className={classes.actions}>
          <button>{isLogin ? 'Login' : 'Create Account'}</button>
          <button
            type='button'
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
}

export default AuthForm;