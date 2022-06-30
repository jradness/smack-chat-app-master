import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import Modal from '../Modal/Modal';
import './UserCreate.css';
import { AVATARS } from '../../constants';
import { UserContext } from '../../App';
import Alert from '../Alert/Alert';
import UserAvatar from '../UserAvatar/UserAvatar';

const UserCreate = ({ history }) => {
const { authService } = useContext(UserContext);
const INIT_STATE = {
  userName: '',
  email: '',
  password: '',
  avatarName: 'avatarDefault.png',
  avatarColor: 'none',
};
const [userInfo, setUserInfo] = useState(INIT_STATE);
const [modal, setModal] = useState(false);
const [error, setError] = useState(false);
const [isLoading, setIsLoading] = useState(false);

const onChange = ({ target: { name, value }}) => {
  setUserInfo({ ...userInfo, [name]: value});
}

const chooseAvatar = (avatar) => {
  setUserInfo({ ...userInfo, avatarName: avatar });
  setModal(false);
}

const generateBgColor = () => {
  const randomColor = Math.floor(Math.random() * 16777215).toString(16);
  setUserInfo({ ...userInfo, avatarColor: `#${randomColor}` });
}

const createUser = (e) => {
  e.preventDefault();
  const { userName, email, password, avatarName, avatarColor } = userInfo;
  if (!!userName && !!email && !!password) {
    setIsLoading(true);
    authService.registerUser(email, password).then(() => {
      authService.loginUser(email, password).then(() => {
        authService.createUser(userName, email, avatarName, avatarColor).then(() => {
          setUserInfo(INIT_STATE);
          history.push('/');
        }).catch((error) => {
          console.error('creating user', error);
          setError(true);
        })
      }).catch((error) => {
        console.error('logging in user', error);
        setError(true);
      })
    }).catch((error) => {
      console.error('registering user', error);
      setError(true);
    })
    setIsLoading(false);
  }
}

const { userName, email, password, avatarName, avatarColor } = userInfo;
const errorMsg = 'Error creating account. Please try again.';
  return (
    <>
    <div className="center-display">
      {error ? <Alert message={errorMsg} type="alert-danger" /> : null}
      {isLoading ? <div>Loading...</div> : null}
      <h3 className="title">Create an account</h3>
      <form onSubmit={createUser} className="form">
        <input
          onChange={onChange}
          value={userName}
          type="text"
          className="form-control"
          name="userName"
          placeholder="enter username"
        />
        <input
          onChange={onChange}
          value={email}
          type="email"
          className="form-control"
          name="email"
          placeholder="enter email"
        />
        <input
          onChange={onChange}
          value={password}
          type="password"
          className="form-control"
          name="password"
          placeholder="enter password"
        />
        <div className="avatar-container">
          <UserAvatar avatar={{ avatarName, avatarColor }} className="create-avatar" />
          <div onClick={() => setModal(true)} className="avatar-text">Choose avatar</div>
          <div onClick={generateBgColor} className="avatar-text">Generate background color</div>
        </div>
        <input className="submit-btn" type="submit" value="Create Account" />
      </form>
      <div className="footer-text">Already have an Account? Login <Link to="/login">HERE</Link></div>
    </div>
  
    <Modal title="Choose Avatar" isOpen={modal} close={() => setModal(false)}>
      <div className="avatar-list">
        {AVATARS.map((img) => (
          <div role="presentation" key={img} className="create-avatar" onClick={() => chooseAvatar(img)}>
            <img src={img} alt="avatar"/>
          </div>
        ))}
      </div>
    </Modal>
    </>
  );
}

export default UserCreate;
