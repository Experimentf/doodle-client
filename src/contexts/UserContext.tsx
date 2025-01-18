import { AvatarProps } from '@bigheads/core';
import React, {
  createContext,
  PropsWithChildren,
  useEffect,
  useState,
} from 'react';

import { LocalStorageKeys } from '@/constants/LocalStorage';
import { getRandomAvatarProps } from '@/utils/avatar';

interface UserContextInterface {
  name: string;
  updateName: (newName: string) => void;
  saveName: (newName: string) => void;
  avatarProps: AvatarProps;
  updateAvatarProps: (newProps: AvatarProps) => void;
}

export const UserContext = createContext<UserContextInterface>({
  name: '',
  updateName: () => {},
  saveName: () => {},
  avatarProps: {},
  updateAvatarProps: () => {},
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
