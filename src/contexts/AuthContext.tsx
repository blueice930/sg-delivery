import React, { useContext, useState, useEffect } from 'react';
import { isEmpty } from 'lodash';
import { User } from 'src/types/user';
import Loading from 'src/components/Loading';
import {
  auth, fetchUser, registerUser, updateUser,
} from '../firebase';

const AuthContext = React.createContext<any>({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children } : any) => {
  const [currUser, setCurrUser] = useState<User>();
  const [storageAddr, setStorageAddr] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchUserInfo = async (email: string) => {
    const { data } = await fetchUser({ email });
    const { success, data: { user: userData, storageAddress } } = data;

    const user: User = {
      ...userData,
    };
    setCurrUser(user);
    setStorageAddr(storageAddress);
  };

  const signup = async (email: string, pw: string, fname: string, lname: string) => {
    const res = await auth.createUserWithEmailAndPassword(email, pw);

    if (!res?.user?.uid) {
      throw new Error('Signup failed!');
    }
    const fullname = `${fname} ${lname}`;
    const user: User = {
      id: res?.user?.uid,
      displayName: fullname,
      fname,
      lname,
      email,
      wallet: { balanceCent: 0 },
    };
    await registerUser(user);
    setCurrUser(user);
    return user;
  };

  const login = async (email: string, password: string) => {
    const res = await auth.signInWithEmailAndPassword(email, password);
    if (res?.user?.uid) {
      await fetchUserInfo(email);
    }
    return res;
  };

  const logout = async () => {
    await auth.signOut();
    setCurrUser(undefined);
  };

  const updateUserInfo = async (props: any) => {
    const { data } = await updateUser(props);
    if (data.success) {
      const updatedUser = { ...currUser, ...props };
      setCurrUser(updatedUser);
    }
  };

  const resetPassword = (email: string) => (
    auth.sendPasswordResetEmail(email)
  );

  const updatePassword = (password: string) => (
    auth?.currentUser?.updatePassword(password)
  );

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user && user.email && isEmpty(currUser)) {
        await fetchUserInfo(user.email);
      }
      setLoading(false);
    });
  }, []);

  const value = {
    currUser,
    storageAddr,
    signup,
    login,
    logout,
    updateUserInfo,
    resetPassword,
    updatePassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <Loading /> : children}
    </AuthContext.Provider>
  );
};
