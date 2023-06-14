import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import classes from './main-navigation.module.css';

function MainNavigation() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  const handleLogOut = () => {
    signOut();
  };

  return (
    <header className={classes.header}>
      <Link href='/' legacyBehavior>
        <div className={classes.logo}>Next Auth</div>
      </Link>
      <nav>
        <ul>

          {isAuthenticated
            ? (<>
              <li>
                <Link href='/profile'>Profile</Link>
              </li>
              <li>
                <button onClick={handleLogOut}>Logout</button>
              </li>
            </>)
            : (<li>
                <Link href='/auth'>Login</Link>
              </li>)
          }

        </ul>
      </nav>
    </header>
  );
}

export default MainNavigation;