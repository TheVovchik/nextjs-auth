import { useState } from 'react';
import classes from './profile-form.module.css';

const intialState = {
  oldPassword: '',
  newPassword: '',
}

function ProfileForm() {
  const [data, setData] = useState(intialState);

  const handlePasswordsInput = (key, value) => {
    setData(curr => { 
      return { ...curr, [key]: value };
    });
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();

    fetch('/api/user/change-password', {
      method: 'PATCH',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      }
    }).then((res) => res.json()).then(res => console.log(res.message));
  };

  return (
    <form className={classes.form} onSubmit={handlePasswordChange}>
      <div className={classes.control}>
        <label htmlFor='new-password'>New Password</label>
        <input
          type='password'
          id='new-password'
          value={data.newPassword}
          onChange={(e) => handlePasswordsInput('newPassword', e.target.value)}
        />
      </div>
      <div className={classes.control}>
        <label htmlFor='old-password'>Old Password</label>
        <input
          type='password'
          id='old-password'
          value={data.oldPassword}
          onChange={(e) => handlePasswordsInput('oldPassword', e.target.value)}
        />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
}

export default ProfileForm;