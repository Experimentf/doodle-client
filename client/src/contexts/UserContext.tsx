/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {
  PropsWithChildren,
  createContext,
  useEffect,
  useState,
} from 'react';
import { LocalStorageKeys } from '../constants/LocalStorage';

export const UserContext = createContext({
  name: '',
  updateName: (newName: string) => {},
  saveName: (newName: string) => {},
});

const UserProvider = ({ children }: PropsWithChildren) => {
  const [name, setName] = useState('');

  const updateName = (newName: string) => {
    setName(newName);
  };

  const saveName = (newName: string) => {
    localStorage.setItem(LocalStorageKeys.USER_NAME, newName);
  };

  useEffect(() => {
    const storedName = localStorage.getItem('name');
    if (storedName) updateName(storedName);
  }, []);

  return (
    <UserContext.Provider value={{ name, updateName, saveName }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
