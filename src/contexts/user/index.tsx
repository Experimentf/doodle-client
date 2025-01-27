import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';

import { LocalStorageKeys } from '@/constants/LocalStorage';
import { DoodlerInterface } from '@/types/models/doodler';
import { getRandomAvatarProps } from '@/utils/avatar';

interface UserContextInterface {
  user: DoodlerInterface;
  updateUser: <T extends keyof DoodlerInterface>(
    key: T,
    value: DoodlerInterface[T]
  ) => void;
  resetUser: () => void;
}

const defaultUser: DoodlerInterface = {
  id: '',
  name: '',
  avatar: getRandomAvatarProps(),
};

const UserContext = createContext<UserContextInterface>({
  user: defaultUser,
  updateUser: () => {},
  resetUser: () => {},
});

const UserProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<DoodlerInterface>(defaultUser);

  const updateUser: UserContextInterface['updateUser'] = (key, value) => {
    if (key === 'name') {
      localStorage.setItem(LocalStorageKeys.USER_NAME, value as string);
    }
    setUser((prev) => ({ ...prev, [key]: value }));
  };

  const resetUser = () => setUser(defaultUser);

  useEffect(() => {
    const storedName = localStorage.getItem(LocalStorageKeys.USER_NAME);
    if (storedName) setUser((prev) => ({ ...prev, name: storedName }));
  }, []);

  return (
    <UserContext.Provider value={{ user, updateUser, resetUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

export default UserProvider;
