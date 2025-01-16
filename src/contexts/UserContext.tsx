/* eslint-disable @typescript-eslint/no-unused-vars */
import { AvatarProps } from '@bigheads/core';
import React, {
  createContext,
  PropsWithChildren,
  useEffect,
  useState,
} from 'react';

import { LocalStorageKeys } from '@/constants/LocalStorage';
import { getRandomAvatarProps } from '@/utils/avatar';

export const UserContext = createContext({
  name: '',
  updateName: (newName: string) => {},
  saveName: (newName: string) => {},
  avatarProps: {},
  updateAvatarProps: (newProps: AvatarProps) => {},
});

const UserProvider = ({ children }: PropsWithChildren) => {
  const [name, setName] = useState('');
  const [avatarProps, setAvatarProps] = useState<AvatarProps>(
    getRandomAvatarProps()
  );
  const updateName = (newName: string) => {
    setName(newName);
  };

  const saveName = (newName: string) => {
    localStorage.setItem(LocalStorageKeys.USER_NAME, newName);
  };

  const updateAvatarProps = (newProps: AvatarProps) => setAvatarProps(newProps);

  useEffect(() => {
    const storedName = localStorage.getItem('name');
    if (storedName) updateName(storedName);
  }, []);

  return (
    <UserContext.Provider
      value={{ name, updateName, saveName, avatarProps, updateAvatarProps }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
