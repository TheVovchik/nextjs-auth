import { useEffect, useMemo } from 'react';
import ProfileForm from './profile-form';
import classes from './user-profile.module.css';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Loader from '../Loader/Loader';

function UserProfile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const isLoading = useMemo(() => status !== 'authenticated', [status]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth');
    }
  }, [status]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className={classes.profile}>
      <h1>Your User Profile</h1>

      <ProfileForm />
    </section>
  );
}

export default UserProfile;
