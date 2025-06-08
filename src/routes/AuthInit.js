import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { login, logout } from '../redux/userSlice';

const AuthInit = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const nickname = localStorage.getItem('nickname');
    const token = localStorage.getItem('jwtToken');

    if (nickname && token) {
      dispatch(login({ nickname }));
    } else {
      dispatch(logout());
    }
  }, [dispatch]);

  return null;
};

export default AuthInit;
